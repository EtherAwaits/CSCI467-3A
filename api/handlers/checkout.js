const { OUR_DB_URL, LEGACY_DB_INFO, make_query } = require("../../db.js");
const { asyncHandler } = require("../utils.js");
const uuid = require("uuid");

// POST /api/checkout
// Takes in credit card info along with a JSON array of
// parts and their quantities.
// Attempts to authorize a purchase.
// If successful, adds the order to our database.
// If unsuccessful, returns an error message.
//
// See tests/checkout.js for an example.
module.exports = asyncHandler(async (req, res) => {
  const { name, email, address, cc, exp, items } = req.body;
  const transactionID = uuid.v4();
  let orderedItemsStr = "";
  let shippingPrice = 0;
  let basePrice = 0;
  let weight = 0;

  for (const param of [name, email, address, cc, exp]) {
    if (!param || typeof param !== "string") {
      res.status(400);
      res.json({
        error: "Missing parameter(s)",
        success: false,
      });
      return;
    }
  }

  if (!Array.isArray(items) || items.length < 1) {
    res.status(400);
    res.json({
      error: "Must provide a nonempty list of items",
      success: false,
    });
    return;
  }

  for (const item of items) {
    if (
      typeof item?.part_id !== "number" ||
      typeof item?.amount_ordered !== "number" ||
      item.amount_ordered < 1
    ) {
      res.status(400);
      res.json({
        error: "At least one line item has an invalid format",
        success: false,
      });
      return;
    }

    try {
      const partInfo = await make_query(
        LEGACY_DB_INFO,
        `SELECT price,weight FROM parts WHERE number = ${item.part_id}`
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

      basePrice += partInfo[0].price * item.amount_ordered;
      weight += partInfo[0].weight * item.amount_ordered;

      orderedItemsStr += `('${transactionID}','${item.part_id}',
                           '${item.amount_ordered}','${partInfo[0].price}'),`;
    } catch (error) {
      res.status(400);
      res.json({
        error: "Could not find at least one specified part",
        success: false,
      });
      return;
    }
  }

  try {
    const shippingPriceQuery = await make_query(
      OUR_DB_URL,
      `SELECT shipping_price FROM weight_brackets 
       WHERE minimum_weight < ${weight}
       ORDER BY minimum_weight DESC
       LIMIT 1`
    );

    if (shippingPriceQuery.length > 0) {
      shippingPrice = shippingPriceQuery[0].shipping_price;
    }
  } catch (error) {
    res.status(500);
    res.json({
      error,
    });
    return;
  }

  const finalItemsStr =
    orderedItemsStr.slice(0, orderedItemsStr.length - 1) + ";";

  try {
    const authResponse = await fetch("http://blitz.cs.niu.edu/CreditCard/", {
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
        amount: Math.round((basePrice + shippingPrice) * 100) / 100,
      }),
    });

    const authResult = await authResponse.json();

    if (authResult.errors) {
      res.status(400);
      res.json({
        success: false,
        error: "Payment processor rejected the transaction",
        error_messages: authResult.errors,
      });
      return;
    }

    await make_query(
      OUR_DB_URL,
      `INSERT INTO orders (
          order_id,customer_name,email,
          mailing_address,authorization_number,
          base_price,shipping_price,total_weight
      ) VALUES (
          '${transactionID}','${name}','${email}',
         '${address}','${authResult.authorization}',
          ${basePrice},${shippingPrice},${weight}
      )`
    );

    await make_query(
      OUR_DB_URL,
      `INSERT INTO ordered_items (
          order_id,part_id,amount_ordered,price
        ) VALUES ${finalItemsStr}`
    );

    // TODO: Email the customer that their order succeeded?

    res.status(200);
    res.json({ ...authResult, success: true });
  } catch (error) {
    res.status(400);
    res.json({
      success: false,
      error,
    });
    return;
  }
});
