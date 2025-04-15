const { OUR_DB_URL, LEGACY_DB_INFO, make_query } = require("../../../db.js");
const { asyncHandler } = require("../../utils.js");

// GET /api/orders/[orderID]
// Returns the specific details of a single order,
// including all items in the order.
module.exports = asyncHandler(async (req, res) => {
  try {
    const { orderID } = req.params;

    const ordersQuery = await make_query(
      OUR_DB_URL,
      `SELECT * FROM orders 
       JOIN ordered_items ON orders.order_id = ordered_items.order_id
       WHERE orders.order_id = '${orderID}'`
    );

    if (ordersQuery.length < 1) {
      res.status(400);
      res.json({ error: "Order not found" });
      return;
    }

    const queryStr = ordersQuery.reduce(
      (prev, curr) => prev + curr.part_id + ",",
      "("
    );

    const closedQueryStr = queryStr.slice(0, queryStr.length - 1) + ")";

    const partsQuery = await make_query(
      LEGACY_DB_INFO,
      `SELECT * from parts
       WHERE number IN ${closedQueryStr}`
    );

    const mergedResults = ordersQuery.map((orderedItem) => {
      // Again, inefficient because O(n^2), but it always works
      const part = partsQuery.find(
        (currPart) => currPart.number === orderedItem.part_id
      );

      return {
        part_id: part.number,
        amount_ordered: orderedItem.amount_ordered,
        price: orderedItem.price,
        weight: part.weight,
        description: part.description,
        pictureURL: part.pictureURL,
      };
    });

    res.status(200);
    res.json({
      order_id: ordersQuery[0].order_id,
      is_complete: ordersQuery[0].is_complete,
      customer_name: ordersQuery[0].customer_name,
      email: ordersQuery[0].email,
      mailing_address: ordersQuery[0].mailing_address,
      base_price: ordersQuery[0].base_price,
      shipping_price: ordersQuery[0].shipping_price,
      total_weight: ordersQuery[0].total_weight,
      authorization_number: ordersQuery[0].authorization_number,
      date_placed: ordersQuery[0].date_placed,
      date_completed: ordersQuery[0].date_completed,
      items: mergedResults,
    });
  } catch (error) {
    res.status(400);
    res.json({ error });
  }
});
