import bcrypt from "bcryptjs";
import memberSchema from "../../Models/member.js";
import express from "express";

const router = express.Router();

export default router.post("/", async (req, res) => {
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
