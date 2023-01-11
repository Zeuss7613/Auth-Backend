import express from "express";
import memberSchema from "../../Models/member.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = express.Router();

export default router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await memberSchema.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const pass = await bcrypt.compare(password, user.password);
  if (!pass) {
    return res.status(400).json({ message: "invalid credentials" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ message: "success" });
});
