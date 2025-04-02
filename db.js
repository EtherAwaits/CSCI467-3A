// This file initializes the database.
// It does not actually connect to the database, though;
// that probably needs to be done for each individual URL handler,
// unless there's a better way to do it.

const mysql = require("mysql");
const dotenv = require("dotenv").config();

if (dotenv.error) {
  throw new Error(
    "`.env` file count not be parsed. Did you remember to rename `.env.example` to `.env`?"
  );
}

const DB_URL = dotenv.parsed.DB_URL;

// Our database connection
const con = mysql.createConnection(DB_URL);

// legacy db connection
const legacy_con = mysql.createConnection({
  host: "blitz.cs.niu.edu",
  user: "student",
  password: "student",
  database: "csci467",
});

module.exports = {
  con,
  legacy_con,
};
