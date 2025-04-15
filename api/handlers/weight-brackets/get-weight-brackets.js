const { OUR_DB_URL, make_query } = require("../../../db.js");
const { asyncHandler } = require("../../utils.js");

// GET /api/weight-brackets
// Returns a list of all weight-brackets
module.exports = asyncHandler(async (_, res) => {
  try {
    const result = await make_query(
      OUR_DB_URL,
      `SELECT * FROM weight_brackets
       ORDER BY minimum_weight`
    );

    res.status(200);
    res.json(result);
  } catch (error) {
    res.status(400);
    res.json({ error });
  }
});
