const { PORT } = require("../config.js");

// This endpoint retrieves the parts in the legacy database,
// and also syncs our database to the legacy db
// (by adding quantities as needed).
(async () => {
  const res = await fetch(`http://localhost:${PORT}/api/weight-brackets`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      minimum_weight: 10,
      shipping_price: 5,
    }),
  });
  const data = await res.json();
  console.log(data);
})();
