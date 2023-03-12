const router = require("express").Router();
const { User, schema } = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const validateSchema = require("../middleware/validateSchema");

//Register
router.post("/register", validateSchema(schema), async (req, res) => {
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

  const accessToken = savedUser.generateAuthToken();
  const { resPassword, ...resOthers } = savedUser._doc;
  resOthers.token = accessToken;

  res.status(201).json(resOthers);
});

module.exports = router;
