const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },
    password: { type: String, required: true, minlength: 5, maxlength: 1023 },
    deposit: { type: Number, required: true, min: 1 },
    role: { type: String, default: "Buyer" },
  },
  { timestamps: true }
);

const schema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(5).max(1023).required(),
  deposit: Joi.number().min(1).required(),
  role: Joi.boolean(),
});

module.exports.User = mongoose.model("User", UserSchema);
module.exports.schema = schema;
