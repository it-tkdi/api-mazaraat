// const mysql = require("mysql");
import mysql from "mysql"

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mazaraat",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("V MySQL DB is up and running at port 3306");
});

export default db
