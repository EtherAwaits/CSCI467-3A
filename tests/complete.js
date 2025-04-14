const { PORT } = require("../config.js");

(async () => {
  // The format of this endpoint is /api/orders/[orderID]/complete.
  // Of course, replace [orderID] with an actual ID.
  // This endpoint just changes the status of an order to complete.
  // It will be used in the warehouse worker's UI, when they finish
  // working on an order.
  const result = await fetch(
    `http://localhost:${PORT}/api/orders/6657efc5-d908-4a70-8d00-aef339d69805/complete`,
    {
      method: "POST"
    }
  );

  const content = await result.json();
  console.log(content);
})();
