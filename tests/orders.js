const { PORT } = require("../config.js");

// This endpoint retrieves all orders, regardless of whether
// they are authorized or completed. Can be used by the
// admin.
(async () => {
  const result = await fetch(
    `http://localhost:${PORT}/api/orders?lowDate=2025-04-15`
  );

  const content = await result.json();
  console.log(content);
})();
