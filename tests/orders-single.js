const { PORT } = require("../config.js");

// This endpoint fetches the details of a single order, along
// with all of the parts ordered.
(async () => {
  const res = await fetch(
    `http://localhost:${PORT}/api/orders/ff5d8ecc-4d93-4cd9-a21b-83cd180fd5e8`
  );
  const data = await res.json();
  console.log(data);
})();
