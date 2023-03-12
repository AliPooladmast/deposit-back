const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token?.split(" ")?.[1];

  if (!token)
    return res.status(401).json("access denied, token is not provided");

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json("access denied, token is not valid");
    req.user = user;
    next();
  });
};

const verifyTokenSeller = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json("access denied, not enough privileges to perform this action");
    }
    next();
  });
};

const verifyTokenBuyer = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "buyer") {
      return res
        .status(403)
        .json("access denied, not enough privileges to perform this action");
    }
    next();
  });
};

module.exports = { verifyToken, verifyTokenSeller, verifyTokenBuyer };
