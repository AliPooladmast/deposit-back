const mongooseModule = require("mongoose");
const JoiModule = require("joi");

const ProductSchema = new mongooseModule.Schema(
  {
    sellerId: { type: String, required: true },
    productName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    cost: { type: Number, required: true, min: 1 },
    amountAvailable: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const schema = JoiModule.object({
  sellerId: JoiModule.string().hex().required(),
  productName: JoiModule.string().min(3).max(50).required().trim(),
  cost: JoiModule.number().min(1).required(),
  amountAvailable: JoiModule.number().min(1).required(),
});

module.exports.Product = mongooseModule.model("Product", ProductSchema);
module.exports.schema = schema;
