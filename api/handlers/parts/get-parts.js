const {
  OUR_DB_URL,
  LEGACY_DB_INFO,
  make_query,
  make_query_with_con,
} = require("../../../db.js");

const { asyncHandler } = require("../../utils.js");
const SqlString = require("sqlstring");
const mysql = require("mysql");

// GET /api/parts
// Returns a list of the parts from the legacy database.
// A "?search=" parameter may be added to query for
// specific parts.
// This endpoint also syncs our database with the
// legacy database, ensuring that we have a quantity
// for each part that was found in the legacy db.
module.exports = asyncHandler(async (req, res) => {
  let query = "SELECT * FROM parts";

  if (req?.query?.search) {
    const escapedSearch = SqlString.escape(req.query.search);
    const cleanedSearch = escapedSearch.slice(1, escapedSearch.length - 1);

    query += ` WHERE description LIKE '%${cleanedSearch}%'`;
  }

  try {
    const parts = await make_query(LEGACY_DB_INFO, query);

    let insertStr = "";
    let queryStr = "(";

    parts.forEach((part, i) => {
      if (i < parts.length - 1) {
        insertStr += "(" + part.number + "),";
        queryStr += part.number + ",";
      } else {
        insertStr += "(" + part.number + ");";
        queryStr += part.number + ");";
      }
    });

    const our_db_con = mysql.createConnection(OUR_DB_URL);
    our_db_con.connect();

    // If we don't have quantities for any of the parts we found,
    // we should create them. This ensures that our database
    // remains in sync with the legacy database.
    if (parts.length) {
      await make_query_with_con(
        our_db_con,
        `INSERT IGNORE INTO part_quantities (part_id) VALUES ${insertStr}`
      );
    }

    // Retrieve all of the part quantities for the parts that
    // we retrieved from the legacy database.
    const quantities = parts.length > 0 
      ? await make_query_with_con(
          our_db_con,
          `SELECT * FROM part_quantities WHERE part_id IN ${queryStr}`
        ) 
      : [];

    // Merges the parts with the quantities.
    // We can't "JOIN" a query from our own DB with a query from the legacy DB,
    // so we essentially have to do that with JavaScript.
    // Slightly inefficient because O(n^2), but this method guarantees success.
    const partsWithQuantities = parts.map((part) => ({
      ...part,
      quantity: quantities.find((quant) => quant.part_id === part.number)
        .quantity,
    }));

    our_db_con.end();

    res.status(200);
    res.json(partsWithQuantities);
  } catch (error) {
    res.status(400);
    res.json({ error });
  }
});
