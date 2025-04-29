const { OUR_DB_URL, make_query } = require("../../../db.js");
const { asyncHandler } = require("../../utils.js");
const SqlString = require("sqlstring");

//
// POST /api/parts/[partID]
// Sets the quantity of a particular part.
// If that part is not tracked in our database, add it.
//
module.exports = asyncHandler(async (req, res) => {
  try {
    const { partID } = req.params;
    const { quantity } = req.body;

    const cleanedPartID = SqlString.escape(partID);
    const cleanedQuantity = SqlString.escape(quantity);

    await make_query(
      OUR_DB_URL,
      `INSERT INTO part_quantities (part_id,quantity) 
           VALUES (${cleanedPartID},${cleanedQuantity}) 
           ON DUPLICATE KEY UPDATE quantity = ${cleanedQuantity}`
    );

    res.status(200);
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    res.json({ success: false, error });
  }
});
