import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import memberSchema from "../Models/member.js";
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await memberSchema.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "user already exist" });
  }
  const use = await memberSchema
    .create({
      username,
      email,
      password: hashedPassword,
    })
    .then((r) => {
      const { password, ...data } = r.toJSON();
      res.send(data);
    });
});

router.post("/login", async (req, res) => {
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

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const claims = jwt.verify(cookie, process.env.SECRET_KEY);

    if (!claims) {
      return res.status(401).json({
        message: "unauthenticaed",
      });
    }

    const user = await memberSchema.findOne({ _id: claims._id });

    const { password, ...data } = await user.toJSON();

    res.send(data);
  } catch (e) {
    return res.status(401).send(
      "unauthenticaed"
    );
  }
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  return res.json({
    message: "success",
  });
});

export default router;
