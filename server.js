const express = require("express");

// Once we start writing URL endpoint handlers,
// we'll need to use con to interface with the db.
// See schema.js for an example.
// const { our_db_con, legacy_con, make_query } = require("./dbconsts.js");

const app = express();
app.use(express.static("src"));
const PORT = 80;

// Include API routes
require("./api.js")(app);

app.listen(PORT, (error) => {
  if (!error)
    console.log(`Server is Successfully Running on localhost:${PORT}`);
  else console.log("Error occurred, server can't start", error);
});
