const { OUR_DB_URL, LEGACY_DB_INFO, make_query } = require("../../db.js");

const { asyncHandler } = require("../utils.js");

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
    
        const mergedParts = ordersQuery.map((orderedItem) => {
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

        let response = `Invoice for order ${orderID}`;
        response += "\n" + "=".repeat(response.length) + "\n\n";

        mergedParts.forEach(part => {
            const partTotal = Math.round(part.price * part.amount_ordered * 100) / 100;
            const strPartTotal = `$${partTotal}`.padStart(12);
            response += `${strPartTotal} : $${part.price} each ${part.description} x${part.amount_ordered}\n`;
        });

        response += `\nSubtotal: ${`$${ordersQuery[0].base_price.toFixed(2)}`.padStart(10)}`;
        response += `\nShipping: ${`$${ordersQuery[0].shipping_price.toFixed(2)}`.padStart(10)}`;
        response += `\n   Total: ${`$${(ordersQuery[0].base_price + ordersQuery[0].shipping_price).toFixed(2)}`.padStart(10)}\n`;

        res.set('Content-Type', 'text/plain');
        res.send(response);   
    } catch (error) {
        res.set('Content-Type', 'text/plain');
        res.send(error);   
    }
});
