import express from "express";
import useAppConfig from "./config/AppConfig.js";
import "dotenv/config";
import morgan from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import { query } from "./config/db";
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3000;

useAppConfig(app, __dirname);
// useExpressRoute(app);
// useMiddleware(app);

// Log request to console
app.use(morgan("dev"));

// Gzip respone
app.use(compression());

// Parse post body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM cities");
    res.render("index", { data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Express started on port ${port}`);
});
