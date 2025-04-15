const { OUR_DB_URL, make_query } = require("../../../db.js");
const { asyncHandler } = require("../../utils.js");

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

  [lowDate, highDate, lowPrice, highPrice].forEach((param, i) => {
    if (param) {
      if (whereAlreadyPresent) {
        query += " AND";
      } else {
        query += " WHERE";
        whereAlreadyPresent = true;
      }

      if (i < 2) {
        query += ` date_placed ${i > 0 ? "<" : ">"} '${param}'`;
      } else {
        query += ` (base_price + shipping_price) ${
          i > 2 ? "<" : ">"
        } '${param}'`;
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
