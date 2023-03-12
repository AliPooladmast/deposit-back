const router = require("express").Router();
const { User, schema } = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).json("User already registered.");

  const { reqPassword, ...reqOthers } = req.body;

  user = new User({
    ...reqOthers,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(),
  });

  const savedUser = await user.save();

  const { resPassword, ...resOthers } = savedUser._doc;

  res.status(201).json(resOthers);
});

module.exports = router;
