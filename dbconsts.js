// This file contains the constants needed to connect to
// both our database and the legacy database.

const dotenv = require("dotenv").config();

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

module.exports = {
  OUR_DB_URL,
  LEGACY_DB_INFO,
};
