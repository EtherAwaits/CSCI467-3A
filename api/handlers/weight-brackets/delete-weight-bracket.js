const { OUR_DB_URL, make_query } = require("../../../db.js");

const { asyncHandler } = require("../../utils.js");

// DELETE /api/weight-brackets/[weight-bracket-ID]
module.exports = asyncHandler(async (req, res) => {
  try {
    const { weightBracketID } = req.params;

    await make_query(
      OUR_DB_URL,
      `DELETE FROM weight_brackets WHERE weight_bracket_id = ${weightBracketID}`
    );

    res.status(200);
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    res.json({ success: false, error });
  }
});
