const { make_query, OUR_DB_URL } = require("../db");

const data = {
  cc: "6011 1234 4321 1234",
  exp: "12/2025",
  name: "Mr. Smith",
  email: "msmith@gmail.com",
  address: "6067 S. Reindeer Rd., NothingCity, IL, 60067",
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
  const result = await fetch("http://localhost:3000/api/checkout", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const content = await result.json();
  console.log(content);

  const orders = await make_query(OUR_DB_URL, "SELECT * FROM orders");
  console.log(orders);
})();
