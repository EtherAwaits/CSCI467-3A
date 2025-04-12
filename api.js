const mysql = require("mysql");
const SqlString = require("sqlstring");
const uuid = require("uuid");

const {
  LEGACY_DB_INFO,
  OUR_DB_URL,
  make_query,
  make_query_with_con,
} = require("./db.js");

//
// Utility Functions
// Serves the purpose of making response handling easier.
//

const asyncHandler = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(next);
};

//
// Endpoints
// The initAPI function declares all of the API endpoints.
//

const initAPI = (app) => {
  //
  // CUSTOMER INTERFACE
  //

  // GET /api/parts
  // Returns a list of the parts from the legacy database.
  // A "?search=" parameter may be added to query for
  // specific parts.
  // This endpoint also syncs our database with the
  // legacy database, ensuring that we have a quantity
  // for each part that was found in the legacy db.
  app.get(
    "/api/parts",
    asyncHandler(async (req, res) => {
      let query = "SELECT * FROM parts";

      if (req?.query?.search) {
        const escapedSearch = SqlString.escape(req.query.search);
        const cleanedSearch = escapedSearch.slice(1, escapedSearch.length - 1);

        query += ` WHERE description LIKE '%${cleanedSearch}%'`;
      }

      try {
        const parts = await make_query(LEGACY_DB_INFO, query);

        let insertStr = "";
        let queryStr = "(";

        parts.forEach((part, i) => {
          if (i < parts.length - 1) {
            insertStr += "(" + part.number + "),";
            queryStr += part.number + ",";
          } else {
            insertStr += "(" + part.number + ");";
            queryStr += part.number + ");";
          }
        });

        const our_db_con = mysql.createConnection(OUR_DB_URL);
        our_db_con.connect();

        // If we don't have quantities for any of the parts we found,
        // we should create them. This ensures that our database
        // remains in sync with the legacy database.
        await make_query_with_con(
          our_db_con,
          `INSERT IGNORE INTO part_quantities (part_id) VALUES ${insertStr}`
        );

        // Retrieve all of the part quantities for the parts that
        // we retrieved from the legacy database.
        const quantities = await make_query_with_con(
          our_db_con,
          `SELECT * FROM part_quantities WHERE part_id IN ${queryStr}`
        );

        // Merges the parts with the quantities.
        // Slightly inefficient because O(n^2), but this method guarantees success.
        const partsWithQuantities = parts.map((part) => ({
          ...part,
          quantity: quantities.find((quant) => quant.part_id === part.number)
            .quantity,
        }));

        our_db_con.end();

        res.status(200);
        res.json(partsWithQuantities);
      } catch (error) {
        res.status(500);
        res.json({ error });
      }
    })
  );

  // POST /api/checkout
  // Takes in credit card info along with a JSON array of
  // parts and their quantities.
  // Attempts to authorize a purchase.
  // If successful, adds the order to our database.
  // If unsuccessful, returns an error message.
  //
  // See tests/checkout.js for an example.
  app.post(
    "/api/checkout",
    asyncHandler(async (req, res) => {
      const { name, email, address, cc, exp, items } = req.body;
      const transactionID = uuid.v4();
      let orderedItemsStr = "";
      let price = 0;

      for (const parm of [name, email, address, cc, exp]) {
        if (!parm || typeof parm !== "string") {
          res.status(400);
          res.json({
            error: "Missing parameter(s)",
          });
          return;
        }
      }

      if (!Array.isArray(items) || items.length < 1) {
        res.status(400);
        res.json({
          error: "Must provide a nonempty list of items",
        });
        return;
      }

      for (const item of items) {
        if (
          typeof item?.part_id !== "number" ||
          typeof item?.quantity !== "number" ||
          item.quantity < 1
        ) {
          res.status(400);
          res.json({
            error: "At least one line item has an invalid format",
          });
          return;
        }

        try {
          const currPrice = await make_query(
            LEGACY_DB_INFO,
            `SELECT price FROM parts WHERE number = ${item.part_id}`
          );

          const currStockQuery = await make_query(
            OUR_DB_URL,
            `SELECT * FROM part_quantities WHERE part_id = ${item.part_id}`
          );

          // TODO: Eventually validate to ensure that we have enough in stock?
          // I'm not sure that we actually want to check that, though.
          // In the use case diagram, I wrote that the quantity only gets
          // decreased when the warehouse worker ships something, rather
          // than when the customer makes a purchase.
          const currStock = currStockQuery[0]?.quantity;
          if (typeof currStock !== "number") throw new Error();

          price += currPrice[0].price * item.quantity;

          orderedItemsStr +=
            `('${transactionID}','${item.part_id}',` +
            `'${item.quantity}','${currPrice[0].price}'),`;
        } catch (error) {
          res.status(400);
          res.json({
            error: "Could not find at least one specified part",
          });
          return;
        }
      }

      const finalItemsStr =
        orderedItemsStr.slice(0, orderedItemsStr.length - 1) + ";";

      try {
        const authResponse = await fetch(
          "http://blitz.cs.niu.edu/CreditCard/",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              vendor: "Auto Parts",
              trans: transactionID,
              cc,
              name,
              exp,
              amount: price,
            }),
          }
        );

        const authResult = await authResponse.json();

        await make_query(
          OUR_DB_URL,
          "INSERT INTO orders (order_id,customer_name,email,mailing_address,authorization_number,shipping_price) VALUES" +
            `('${transactionID}','${name}','${email}','${address}',` +
            `'${authResult.authorization}',${0})`
        );

        await make_query(
          OUR_DB_URL,
          `INSERT INTO ordered_items (order_id,part_id,quantity,price) VALUES ${finalItemsStr}`
        );

        // TODO: Email the customer that their order succeeded?

        res.status(200);
        res.json({
          result: authResult,
        });
      } catch (error) {
        res.status(400);
        res.json({
          error,
        });
        return;
      }
    })
  );

  //
  // WAREHOUSE WORKER INTERFACE
  //

  // GET /api/orders/authorized
  // Returns only the orders that have a status of "Authorized".
  app.get(
    "/api/orders/authorized",
    asyncHandler(async (_, res) => {
      try {
        const dbQuery = await make_query(
          OUR_DB_URL,
          "SELECT * FROM orders WHERE is_complete = 0"
        );

        res.status(200);
        res.json(dbQuery);
      } catch (error) {
        res.status(400);
        res.json({ error });
      }
    })
  );

  // GET /api/orders/[orderID]/invoice
  // Returns an invoice (PDF?) detailing the price that the customer paid

  // GET /api/orders/[orderID]/packing-list
  // Returns a list (PDF?) of the items in the order.

  // POST /api/orders/[orderID]/complete
  // Changes the status of an order to "complete".
  app.get(
    "/api/orders/:orderID/complete",
    asyncHandler(async (req, res) => {
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
    })
  );

  //
  // RECEIVING DESK CLERK INTERFACE
  //

  // Note that the receiving desk clerk shares the /api/parts endpoint

  //
  // POST /api/parts/[partID]
  // Sets the quantity of a particular part.
  // If that part is not tracked in our database, add it.
  //

  //
  // ADMINISTRATOR INTERFACE
  //

  // GET /api/orders
  // Returns all of the orders in our database.
  // A "?search" parameter may be added to search for specific
  // types of orders.
  // This endpoint is only available to administrators.
  app.get(
    "/api/orders",
    asyncHandler(async (req, res) => {
      let query = "SELECT * FROM orders";

      // Eventually the admin will be able to search for specific orders,
      // but I'll handle that later. See "View Order" in use case model.
      // if (req?.query?.search) {
      //   const escapedSearch = SqlString.escape(req.query.search);
      //   const cleanedSearch = escapedSearch.slice(1, escapedSearch.length - 1);

      //   query += ` WHERE description LIKE '%${cleanedSearch}%'`;
      // }

      try {
        const dbQuery = await make_query(OUR_DB_URL, query);

        res.status(200);
        res.json(dbQuery);
      } catch (error) {
        res.status(400);
        res.json({ error });
      }
    })
  );

  // GET /api/weight-brackets
  // Returns a list of all weight-brackets

  // POST /api/weight-brackets
  // Creates a weight bracket

  // DELETE /api/weight-brackets/[weight-bracket-ID]
};

module.exports = initAPI;
