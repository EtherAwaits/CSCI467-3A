const { make_query, OUR_DB_URL } = require("../db");
const { PORT } = require("../config.js");

// This is the format for the input data for the checkout endpoint.
const data = {
  cc: "6011 1234 4321 1234",
  exp: "12/2025",
  name: "Mr. Smith",
  email: "msmith@gmail.com",
  address: "219 S Reindeer Rd, Surfside Beach, SC 29575",
  items: [
    {
      part_id: 104,
      quantity: 1,
    },
    {
      part_id: 105,
      quantity: 4,
    },
  ],
};

(async () => {
  // Fetch requests for the checkout endpoint can be formatted like this.
  // This endpoint will create an 'Order' object in our database.
  // This customer makes a request to this endpoint when they wish
  // to make a purchase.
  const result = await fetch(`http://localhost:${PORT}/api/checkout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // This just checks that our endpoint did something
  const content = await result.json();
  console.log(content);

  const orders = await make_query(OUR_DB_URL, "SELECT * FROM orders");
  console.log(orders);
})();
