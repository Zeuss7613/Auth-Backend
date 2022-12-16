import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import route from "./Routes/routes.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true, origin: ["http://localhost:3000"]
  })
);
app.use("/api", route);

mongoose
  .connect(process.env.MONGO_URL, {
    useunifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server Çalııyor...");
    });
  })
  .catch(() => {
    return console.log("db error");
  });
