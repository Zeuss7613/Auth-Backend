import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import login from "./Routes/User_Operations/Login.js";
import register from "./Routes/User_Operations/Register.js";
import logout from "./Routes/User_Operations/Logout.js";
import { auth, state } from "./Routes/Guard/guard.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/login", state, login);
app.use("/api/register", state, register);
app.use("/api/logout", auth, logout);

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
