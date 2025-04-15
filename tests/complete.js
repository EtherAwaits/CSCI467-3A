const { PORT } = require("../config.js");

(async () => {
  // The format of this endpoint is /api/orders/[orderID]/complete.
  // Of course, replace [orderID] with an actual ID.
  // This endpoint just changes the status of an order to complete.
  // It will be used in the warehouse worker's UI, when they finish
  // working on an order.
  const result = await fetch(
    `http://localhost:${PORT}/api/orders/3a991a49-ce7d-44e2-a31c-b4b15d90acc2/complete`,
    {
      method: "POST",
    }
  );

  const content = await result.json();
  console.log(content);
})();
