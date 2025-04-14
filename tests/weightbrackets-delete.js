const { PORT } = require("../config.js");

// This endpoint retrieves the parts in the legacy database,
// and also syncs our database to the legacy db
// (by adding quantities as needed).
(async () => {
  const res = await fetch(`http://localhost:${PORT}/api/weight-brackets/1`, {
    method: "DELETE",
  });
  const data = await res.json();
  console.log(data);
})();
