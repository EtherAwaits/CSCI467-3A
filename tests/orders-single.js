const { PORT } = require("../config.js");

// This endpoint fetches the details of a single order, along
// with all of the parts ordered.
(async () => {
  const res = await fetch(
    `http://localhost:${PORT}/api/orders/c9debb2a-765b-4e8f-a3b6-1fd4ce151e50`
  );
  const data = await res.json();
  console.log(data);
})();
