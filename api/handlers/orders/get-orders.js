const { OUR_DB_URL, make_query } = require("../../../db.js");
const { asyncHandler } = require("../../utils.js");
const SqlString = require("sqlstring");

// GET /api/orders
// Returns all of the orders in our database.
// This endpoint may take up to five search parameters:
//   status=     may be 'authorized' or 'complete'
//   lowDate=    the minimum date
//   highDate=   the maximum date
//   lowprice=   the minimum total price
//   highprice=  the maximum total price
module.exports = asyncHandler(async (req, res) => {
  const { status, lowDate, highDate, lowPrice, highPrice } = req.query;
  let whereAlreadyPresent = false;
  let query = `SELECT * FROM orders`;

  // Parse the status parameter
  if (status) {
    whereAlreadyPresent = true;
    switch (status.toLowerCase()) {
      case "authorized":
        query += ` WHERE is_complete = 0`;
        break;

      case "complete":
        query += ` WHERE is_complete = 1`;
        break;

      default:
        res.status(400);
        res.json({ error: "Invalid status parameter" });
        return;
    }
  }

  // Parse the remaining parameters
  [lowDate, highDate, lowPrice, highPrice].forEach((param, i) => {
    if (param) {
      if (whereAlreadyPresent) {
        query += " AND";
      } else {
        query += " WHERE";
        whereAlreadyPresent = true;
      }

      const cleaned = SqlString.escape(param);

      if (i < 2) {
        // Unfortunately this timezone conversion is necessary in order for the query to return the correct results.
        // There's almost certainly a better way to handle this, but it's not immediately clear what that way is.
        query += ` date_placed ${i > 0 ? "<=" : ">="} CONVERT_TZ(${cleaned.slice(0, cleaned.length - 1)} ${i > 0 ? "23:59:59" : "00:00:00"}', '-05:00', '-10:00')`;
      } else {
        query += ` (base_price + shipping_price) ${
          i > 2 ? "<=" : ">="
        } ${cleaned}`;
      }
    }
  });

  try {
    const dbQuery = await make_query(OUR_DB_URL, query);

    res.status(200);
    res.json(dbQuery);
  } catch (error) {
    res.status(400);
    res.json({ error });
  }
});
