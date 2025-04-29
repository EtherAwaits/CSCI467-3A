const { OUR_DB_URL, make_query } = require("../../../db.js");

const { asyncHandler } = require("../../utils.js");
const SqlString = require("sqlstring");

// POST /api/weight-brackets
// Creates a weight bracket.
// Note that the minimum weight must be unique.
module.exports = asyncHandler(async (req, res) => {
  try {
    const { minimum_weight, shipping_price } = req.body;

    const cleanedMinWeight = SqlString.escape(minimum_weight);
    const cleanedShipPrice = SqlString.escape(shipping_price);

    await make_query(
      OUR_DB_URL,
      `INSERT INTO weight_brackets 
       (minimum_weight,shipping_price) VALUES
       (${cleanedMinWeight},${cleanedShipPrice})`
    );

    res.status(200);
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    res.json({ success: false, error });
  }
});
