const { OUR_DB_URL, LEGACY_DB_INFO, make_query } = require("../../db.js");
const { asyncHandler } = require("../utils.js");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const SqlString = require("sqlstring");

// Configures emails using our credentials.
// I found a free SMTP service called Zoho,
// and that's what we're using to send emails
// in this project.
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: "465",
  secure: true, // true for 465, false for other ports
  auth: {
    user: "autoparts467",
    pass: dotenv.parsed.EMAIL_PASSWORD,
  },
});

// This is just a simple utility function to make
// it easier to send emails. We only call it once, though.
const send = (to, content, subject) => {
  return new Promise((resolve, reject) => {
    if (!content)
      return reject(new Error("cannot send email with no content"));
    const options = {
      from: "autoparts467@zohomail.com",
      to,
      subject,
      text: "", // plain text body
      html: content, // html body
    };
    return transporter.sendMail(options, (error, info) => {
      if (error) return reject(error);
      return resolve(info);
    });
  });
};

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
  let emailContent = `
    <h1 align='center'>Order Succeeded!</h1>
    <p align='center'>Thank you for shopping at Ege Auto Parts.</p>
    <p align='center'>Your Order ID is ${transactionID}</p>
    <table align='center'>
      <tr>
          <th align='right'>Product</th>
          <th align='right'>Qty</th>
          <th align='right'>Rate</th>
          <th align='right'>Amount</th>
      </tr>
  `;

  // Simple validation of what the customer submitted - 
  // make sure that all of the parameters exist
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

  // The "items" parameter needs to be an array,
  // and it needs to contain at least one item.
  // The customer cannot place an order with
  // no items in it.
  if (!Array.isArray(items) || items.length < 1) {
    res.status(400);
    res.json({
      error: "Must provide a nonempty list of items",
      success: false,
    });
    return;
  }

  // This loop validate each individual item
  // that the customer asked to purchase.
  for (const item of items) {
    // The ID and the amount ordered should
    // both be numbers, and the minimum amount
    // ordered is 1
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
      // We now verify that the part(s) specified.
      // We first check that they exist in the legacy database.
      // Then we check that we have quantity information for
      // those part(s) in our own database.

      const partInfo = await make_query(
        LEGACY_DB_INFO,
        `SELECT price,weight,description FROM parts WHERE number = ${item.part_id}`
      );

      const currStockQuery = await make_query(
        OUR_DB_URL,
        `SELECT * FROM part_quantities WHERE part_id = ${item.part_id}`
      );

      // We could validate to ensure that we have enough in stock.
      // However, I decided it isn't necessary to check for this.
      // In the use case diagram, I wrote that the quantity only gets
      // decreased when the warehouse worker ships something, rather
      // than when the customer makes a purchase.
      const currStock = currStockQuery[0]?.quantity;
      if (typeof currStock !== "number") throw new Error();

      // Accrue totals
      basePrice += partInfo[0].price * item.amount_ordered;
      weight += partInfo[0].weight * item.amount_ordered;

      // Each order in our database has a one-to-many relationship
      // with ordered_item. Here we're constructing a string to be
      // part of an SQL query to create the ordered_items.
      orderedItemsStr += `('${transactionID}','${item.part_id}',
                           '${item.amount_ordered}','${partInfo[0].price}'),`;

      // We're also constructing the html to make up the email content.
      emailContent += `<tr>
        <td align='right' width='300px'>${partInfo[0].description}</td>
        <td align='right' width='50px'>${item.amount_ordered}</td>
        <td align='right' width='100px'>$${partInfo[0].price.toFixed(2)}</td>
        <td align='right' width='100px'>$${(
          partInfo[0].price * item.amount_ordered
        ).toFixed(2)}</td>
      </tr>`;
    } catch (error) {
      res.status(400);
      res.json({
        error: "Could not find at least one specified part",
        success: false,
      });
      return;
    }
  }

  // Validation has finished
  try {
    // Determine shipping price. Pick the weight
    // bracket with the lowest minimum_weight that
    // is still higher than the weight of our order.
    const shippingPriceQuery = await make_query(
      OUR_DB_URL,
      `SELECT shipping_price FROM weight_brackets 
       WHERE minimum_weight < ${weight}
       ORDER BY minimum_weight DESC
       LIMIT 1`
    );

    // If we don't find a weight bracket, default to 0
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

  // Replace tailing comma with semicolon in our SQL query
  const finalItemsStr =
    orderedItemsStr.slice(0, orderedItemsStr.length - 1) + ";";

  // Calculate total price
  const totalAmount = Math.round((basePrice + shippingPrice) * 100) / 100;

  try {
    // Make a request to the payment processor
    const authResponse = await fetch("http://blitz.cs.niu.edu/CreditCard/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor: "Ege Auto Parts",
        trans: transactionID,
        cc,
        name,
        exp,
        amount: totalAmount,
      }),
    });

    // Get the result from the payment processor
    const authResult = await authResponse.json();

    // If the payment processor sent back errors,
    // send those errors to the frontend
    if (authResult.errors) {
      res.status(400);
      res.json({
        success: false,
        error: "Payment processor rejected the transaction",
        error_messages: authResult.errors,
      });
      return;
    }

    // Escape direct user input
    const cleanedName = SqlString.escape(name);
    const cleanedEmail = SqlString.escape(email);
    const cleanedAddress = SqlString.escape(address);

    // Create the order.
    // Keep track of the price they paid and the weight of the order
    // when they made the purchase - the legacy database could change
    // prices/weights later, and we don't want that to affect this order.
    await make_query(
      OUR_DB_URL,
      `INSERT INTO orders (
          order_id,customer_name,email,
          mailing_address,authorization_number,
          base_price,shipping_price,total_weight
      ) VALUES (
          '${transactionID}',${cleanedName},${cleanedEmail},
         ${cleanedAddress},'${authResult.authorization}',
          ${basePrice},${shippingPrice},${weight}
      )`
    );

    // Stores records of which items were ordered
    // into the database. 
    await make_query(
      OUR_DB_URL,
      `INSERT INTO ordered_items (
          order_id,part_id,amount_ordered,price
        ) VALUES ${finalItemsStr}`
    );

    // Writes the "totals" section of the email.
    emailContent += `
      <tr>
        <td><br></td>
      </tr>
      <tr>
        <td></td><td></td><td align='right' width='100px'>Subtotal:</td><td align='right'>
          $${basePrice.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td align='right' width='100px'>Shipping:</td>
        <td width='100px' align='right'>
          $${shippingPrice.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td align='right' width='100px'>Total:</td>
        <td width='100px' align='right'>
          $${totalAmount.toFixed(2)}
        </td>
      </tr>
    </table>`;

    // If we have the email password configured,
    // then send the email.
    if (dotenv.parsed.EMAIL_PASSWORD) {
      await send(email, emailContent, "Order Succeeded");
    }

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
