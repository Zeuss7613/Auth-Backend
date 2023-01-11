export const auth = (req, res, next) => {
  const auth = req.cookies.jwt;
  if (!auth) {
    return res.status(401).json({ message: "unauthunticated" });
  }
  next();
};

export const state = (req, res, next) => {
  const auth = req.cookies.jwt;
  if (!auth) {
    return next();
  }

  res.json({message: "has logged in"})
};
