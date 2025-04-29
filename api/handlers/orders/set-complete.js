const { OUR_DB_URL, make_query } = require("../../../db.js");
const { asyncHandler } = require("../../utils.js");
const SqlString = require("sqlstring");

// POST /api/orders/[orderID]/complete
// Changes the status of an order to "complete".
module.exports = asyncHandler(async (req, res) => {
  try {
    const { orderID } = req.params;

    const cleanedOrderID = SqlString.escape(orderID);

    // Set to complete and reduce quantity
    await make_query(
      OUR_DB_URL,
      `UPDATE orders 
       JOIN ordered_items ON orders.order_id = ordered_items.order_id
       JOIN part_quantities ON ordered_items.part_id = part_quantities.part_id
       SET part_quantities.quantity = part_quantities.quantity - ordered_items.amount_ordered,
                        is_complete = '1' WHERE orders.order_id = ${cleanedOrderID}`
    );

    res.status(200);
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    res.json({ success: false, error });
  }
});
