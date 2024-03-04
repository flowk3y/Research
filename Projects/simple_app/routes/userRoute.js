import express from "express";
import controllers from "../controllers/index.js";
var bodyParser = require("body-parser");
const { userController } = controllers;

const userRoute = express.Router();

userRoute.get("/edit", userController.edit);
// userRoute.post("/create", userController.create);
var urlencode = bodyParser.urlencoded({ extended: false });
userRoute.post("/create", urlencode, (req, res, next) => {
  const data = req.body;
  console.log(data);
});

userRoute.get("/", userController.index);

export default userRoute;
