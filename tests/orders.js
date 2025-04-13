const { PORT } = require("../config.js");

// This endpoint retrieves all orders, regardless of whether
// they are authorized or completed. Can be used by the
// admin.
(async () => {
  const result = await fetch(
    `http://localhost:${PORT}/api/orders?lowPrice=253&highPrice=254`
  );

  const content = await result.json();
  console.log(content);
})();
