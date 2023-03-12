const { verifyToken } = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { User, schema } = require("../models/User");
const validateSchema = require("../middleware/validateSchema");
const validateObjectId = require("../middleware/validateObjectId");

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

module.exports = router;
