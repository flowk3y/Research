import express from "express";
import path from "path";

const useAppConfig = (app, __dirname) => {
  app.use(express.static(path.join(__dirname, "public")));
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
};

export default useAppConfig;
