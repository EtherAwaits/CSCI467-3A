// This file runs as a standalone script.
// Its sole purpose is to initialize the db schema.

const { con } = require("./db.js");

// TODO: Define the schema here, one SQL statement per string
const SQL_CODE = [
  `
DROP TABLE IF EXISTS Inventory;
`,
  `
CREATE TABLE Inventory (PartNumber int NOT NULL, description varchar(50) NOT NULL, price float(8,2) NOT NULL,
    weight float (4,2) NOT NULL, pictureURL varchar (50), count int NOT NULL, on_order int, PRIMARY KEY (PartNumber));
`, `

INSERT INTO Inventory (PartNumber, description, price, weight, pictureURL, 0, 0)
SELECT PartNumber, description, price, weight, pictureURL
FROM csci467;
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
