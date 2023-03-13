const { verifyToken, verifyTokenBuyer } = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { User, schema } = require("../models/User");
const validateSchema = require("../middleware/validateSchema");
const validateObjectId = require("../middleware/validateObjectId");
const depositCoins = [5, 10, 20, 50, 100];

//Upadate User
router.put(
  "/:id",
  [verifyToken, validateObjectId, validateSchema(schema)],
  async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json("the user with the current ID was not found");

    res.json(updatedUser);
  }
);

//Delete User
router.delete("/:id", [verifyToken, validateObjectId], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user)
    return res.status(404).json("the user with the current ID was not found");

  res.json("user has been deleted...");
});

//Get User
router.get("/find/:id", [verifyToken, validateObjectId], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user)
    return res.status(404).json("the user with the current ID was not found");

  res.json(user);
});

//Charge Deposit
router.put("/perform/deposit", verifyTokenBuyer, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) return res.status(404).json("the user not found");

  if (!depositCoins.includes(req.body.deposit))
    return res
      .status(404)
      .json("deposit is only allowed by 5, 10, 20, 50 and 100 amounts");

  user.deposit += req.body.deposit;
  user.save();

  res.json(user);
});

//Reset Deposit
router.put("/deposit/reset", verifyTokenBuyer, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) return res.status(404).json("the user not found");

  user.deposit = 0;
  user.save();

  res.json(user);
});

module.exports = router;
