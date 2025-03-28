// This file runs as a standalone script.
// Its sole purpose is to initialize the db schema.

const { con } = require("./db.js");

// TODO: Define the schema here, one SQL statement per string
const SQL_CODE = [
  `
DROP TABLE IF EXISTS Example;
`,
  `
CREATE TABLE Example (
    PrimKey INT AUTO_INCREMENT PRIMARY KEY
);
`,
];

// When using the database, we first need to connect to it.
// When writing handlers for endpoints, you can pretty much just copy this.
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the database; attempting to generate schema");
});

// Run all statements defined in SQL_CODE
for (const query of SQL_CODE) {
  con.query(query, function (err) {
    if (err) throw err;
    console.log(query);
  });
}

// Make sure to close the connection when we're done with it,
// otherwise it just stays open.
con.end();
