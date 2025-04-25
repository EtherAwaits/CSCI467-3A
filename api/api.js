module.exports = (app) => {
  //
  //  ORDERS ENDPOINTS
  //

  // Queries the orders from our database
  app.get("/api/orders", require("./handlers/orders/get-orders"));

  // Obtains all of the information about a single order in our database.
  app.get(
    "/api/orders/:orderID",
    require("./handlers/orders/get-single-order")
  );

  // Sets the status of an order to "complete".
  app.post(
    "/api/orders/:orderID/complete",
    require("./handlers/orders/set-complete")
  );

  //
  //  PARTS ENDPOINTS
  //

  // Queries parts from the legacy database
  app.get("/api/parts", require("./handlers/parts/get-parts"));

  // Sets the quantity of a particular part
  app.post("/api/parts/:partID", require("./handlers/parts/set-quantity"));

  //
  //  WEIGHT BRACKET ENDPOINTS
  //

  app.get(
    "/api/weight-brackets",
    require("./handlers/weight-brackets/get-weight-brackets")
  );

  app.post(
    "/api/weight-brackets",
    require("./handlers/weight-brackets/create-weight-bracket")
  );

  app.delete(
    "/api/weight-brackets/:weightBracketID",
    require("./handlers/weight-brackets/delete-weight-bracket")
  );

  //
  //  CHECKOUT ENDPOINT
  //

  // This is in its own category, although it does create an order.
  app.post("/api/checkout", require("./handlers/checkout"));

  //
  //  FILE ENDPOINTS
  //

  app.get("/invoices/:orderID", require("./files/invoice"));
};
