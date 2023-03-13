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
    deposit: { type: Number, required: true, min: 0 },
    role: {
      type: String,
      default: "Buyer",
      minlength: 2,
      maxlength: 10,
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: "3d" }
  );
  return token;
};

const createSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(5).max(1023).required(),
  deposit: Joi.number().min(1).required(),
  role: Joi.string().min(2).max(10),
});

const editSchema = Joi.object({
  username: Joi.string().min(2).max(50),
  password: Joi.string().min(5).max(1023),
  deposit: Joi.number().min(0),
  role: Joi.string().min(2).max(10),
});

module.exports.User = mongoose.model("User", UserSchema);
module.exports.createSchema = createSchema;
module.exports.editSchema = editSchema;
