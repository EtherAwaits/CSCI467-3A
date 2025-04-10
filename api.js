const mysql = require("mysql");
const SqlString = require("sqlstring");
const { LEGACY_DB_INFO } = require("./dbconsts.js");

//
// Utility Functions
// Serve the purpose of making queries and
// response handling easier.
//

const asyncHandler = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(next);
};

const make_query = (connectionInfo, sqlQuery) =>
  new Promise((resolve, reject) => {
    const con = mysql.createConnection(connectionInfo);

    con.connect();

    con.query(sqlQuery, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });

    con.end();
  });

//
// Specific Query Functions
// Any SQL queries that are reused go here
//

//
// Endpoints
// The initAPI function declares all of the API endpoints
//

const initAPI = (app) => {
  //
  // CUSTOMER INTERFACE
  //

  // GET /api/parts
  // Returns a list of the parts from the legacy database.
  // A "?search=" parameter may be added to query for
  // specific parts.
  app.get(
    "/api/parts",
    asyncHandler(async (req, res) => {
      let query = "SELECT * FROM parts";

      if (req?.query?.search) {
        const escapedSearch = SqlString.escape(req.query.search);
        const cleanedSearch = escapedSearch.slice(1, escapedSearch.length - 1);

        query += ` WHERE description LIKE '%${cleanedSearch}%'`;
      }

      const result = await make_query(LEGACY_DB_INFO, query);

      res.status(result ? 200 : 400);
      res.json({ result });
    })
  );

  // POST /api/checkout
  // Takes in a JSON array of parts and their quantities.
  // Attempts to authorize a purchase. If successful,
  // adds the order to our database. If unsuccessful,
  // returns an error message.

  //
  // WAREHOUSE WORKER INTERFACE
  //

  // GET /api/orders/authorized
  // Returns only the orders that have a status of "Authorized".

  // GET /api/orders/[orderID]/invoice
  // Returns an invoice (PDF?) detailing the price that the customer paid

  // GET /api/orders/[orderID]/packing-list
  // Returns a list (PDF?) of the items in the order.

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
};

module.exports = initAPI;
