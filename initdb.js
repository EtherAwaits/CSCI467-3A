// This file runs as a standalone script.
// Its sole purpose is to push the database schema to the database.

const fs = require("fs");
const { OUR_DB_URL } = require("./db.js");
const mysql = require("mysql");

const con = mysql.createConnection(OUR_DB_URL);

// Read in the SQL script. We'll pass it off to the database
// in order to create all of our tables.
const sqlInstructions = fs
  .readFileSync("./schema.sql")
  .toString()
  .trim() // Remove tailing newline
  .split(";") // Convert to array; one item per index
  .filter((item) => item); // remove any empty string items

// When using the database, we first need to connect to it.
// When writing handlers for endpoints, you can pretty much just copy this.
con.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database; attempting to generate schema");
});

// Run all statements defined in SQL_CODE
for (const query of sqlInstructions) {
  con.query(query, function (err) {
    if (err) throw err;
    console.log(query);
  });
}

// Make sure to close the connection when we're done with it,
// otherwise it just stays open.
con.end();
