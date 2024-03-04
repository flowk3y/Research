import express from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

export default function (app) {
  // Log request to console
  app.use(morgan("dev"));

  // Cross Origin
  app.use(cors());

  // Gzip respone
  app.use(compression());

  // Parse post body
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
}
