import express from "express";
import useAppConfig from "./config/AppConfig.js";
import "dotenv/config";
import { query } from "./config/db";
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3000;

useAppConfig(app, __dirname);
useMiddleware(app);
useExpressRoute(app);
// Log request to console

app.get("/", async (req, res) => {
  res.render('index', {data: "nothing"})
});

app.listen(port, () => {
  console.log(`Express started on port ${port}`);
});
