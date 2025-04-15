const { PORT } = require("../config.js");

// This endpoint retrieves all orders that have been authorized,
// but which have not yet been fulfilled. Should be used in the
// warehouse worker interface to see which orders they need to
// work on.
(async () => {
  const result = await fetch(
    `http://localhost:${PORT}/api/orders?status=authorized`
  );

  const content = await result.json();
  console.log(content);
})();
