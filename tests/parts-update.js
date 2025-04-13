const { PORT } = require("../config.js");

// This endpoint updates the quantity of a single part
// in our database.
(async () => {
  const res = await fetch(`http://localhost:${PORT}/api/parts/1`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity: 10,
    }),
  });
  const data = await res.json();
  console.log(data);
})();
