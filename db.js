// This file contains the constants needed to connect to
// both our database and the legacy database.

const dotenv = require("dotenv").config();
const mysql = require("mysql");

if (dotenv.error) {
  throw new Error(
    "`.env` file count not be parsed. Did you remember to create a `.env` file?"
  );
}

// Our database connection info.
const OUR_DB_URL = dotenv.parsed.DB_URL;

// Legacy db connection info.
const LEGACY_DB_INFO = {
  host: "blitz.cs.niu.edu",
  user: "student",
  password: "student",
  database: "csci467",
};

// Below are two utility functions to make queries easier.

const make_query_with_con = (con, sqlQuery) =>
  new Promise((resolve, reject) => {
    con.query(sqlQuery, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        con.end();
        reject(err);
      }
    });
  });

const make_query = (connectionInfo, sqlQuery) =>
  new Promise((resolve, reject) => {
    const con = mysql.createConnection(connectionInfo);

    con.connect();

    make_query_with_con(con, sqlQuery)
      .then((result) => {
        con.end();
        resolve(result);
      })
      .catch((err) => reject(err));
  });

module.exports = {
  OUR_DB_URL,
  LEGACY_DB_INFO,
  make_query_with_con,
  make_query,
};
