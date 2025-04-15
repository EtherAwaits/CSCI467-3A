const { OUR_DB_URL, make_query } = require("../../../db.js");

const { asyncHandler } = require("../../utils.js");

// POST /api/weight-brackets
// Creates a weight bracket
module.exports = asyncHandler(async (req, res) => {
  try {
    const { minimum_weight, shipping_price } = req.body;

    await make_query(
      OUR_DB_URL,
      `INSERT INTO weight_brackets 
       (minimum_weight,shipping_price) VALUES
       ('${minimum_weight}','${shipping_price}')`
    );

    res.status(200);
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    res.json({ success: false, error });
  }
});
