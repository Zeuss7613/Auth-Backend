import express from "express";
const router = express.Router();

export default router.post("/", (req, res) => {
  if (!req.cookies.jwt) {
    return res.json({ message: "not logged in" });
  }

  res.cookie("jwt", "", { maxAge: 0 });

  return res.json({
    message: "success",
  });
});
