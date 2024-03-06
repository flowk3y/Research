import express from "express";
import useExpressRoute from "./routes";
import useAppConfig from "./config/AppConfig.js";
import useMiddleware from "./middlewares";
import "dotenv/config";
import morgan from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3000;

useAppConfig(app, __dirname);
useExpressRoute(app);
// useMiddleware(app);

// Log request to console
app.use(morgan("dev"));

// Gzip respone
app.use(compression());

// Parse post body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function (err, req, res, next) {
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function (req, res) {
  res.status(404);
  res.send({ error: "Sorry, can't find that" });
});

app.listen(port, () => {
  console.log(`Express started on port ${port}`);
});
