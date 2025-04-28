const { OUR_DB_URL, make_query } = require("../db.js");

(async () => {
  try {
    const res = await make_query(
      OUR_DB_URL,
      `SELECT NOW();`
    );

    console.log(res)
  } catch (error) {
    console.log(error)
  }
})();
