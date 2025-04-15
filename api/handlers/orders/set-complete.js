const { OUR_DB_URL, make_query } = require("../../../db.js");
const { asyncHandler } = require("../../utils.js");

// POST /api/orders/[orderID]/complete
// Changes the status of an order to "complete".
module.exports = asyncHandler(async (req, res) => {
  try {
    const { orderID } = req.params;

    await make_query(
      OUR_DB_URL,
      `UPDATE orders SET is_complete = '1' WHERE order_id = '${orderID}'`
    );

    res.status(200);
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    res.json({ success: false, error });
  }
});
