const { PORT } = require("../config.js");

// This endpoint fetches the details of a single order, along
// with all of the parts ordered.
(async () => {
  const res = await fetch(
    `http://localhost:${PORT}/api/orders/e5ea8a68-04a0-4fa4-97e9-af4196d32cbe`
  );
  const data = await res.json();
  console.log(data);
})();
