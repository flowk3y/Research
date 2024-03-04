import mysql from "mysql2";
import "dotenv/config";

require("dotenv").config();
// Create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || "root",
  database: process.env.DATABASE,
});

export default connection;
