const {
  verifyTokenSeller,
  verifyTokenBuyer,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const { Product, schema } = require("../models/Product");
const { User } = require("../models/User");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validateSchema");
const depositCoins = [100, 50, 20, 10, 5];

//Create Product
router.post("/", [verifyTokenSeller, validate(schema)], async (req, res) => {
  const newProduct = new Product({ ...req.body, sellerId: req.user.id });

  const savedProduct = await newProduct.save();

  res.json(savedProduct);
});

//Upadate Product
router.put("/:id", [verifyTokenSeller, validateObjectId], async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedProduct)
    return res
      .status(404)
      .json("the product with the current ID was not found");

  res.json(updatedProduct);
});

//Delete Product
router.delete(
  "/:id",
  [verifyTokenSeller, validateObjectId],
  async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res
        .status(404)
        .json("the product with the current ID was not found");

    res.json("product has been deleted...");
  }
);

//Get Product
router.get("/find/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return res
      .status(404)
      .json("the product with the current ID was not found");

  res.json(product);
});

//Buy Product
router.put("/perform/buy", verifyTokenBuyer, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json("the user not found");

  const { products } = req.body;
  let total = 0;

  const productIds = Object.keys(products);

  const dbProducts = await Product.find({
    _id: { $in: productIds },
  });

  if (!dbProducts)
    return res.status(404).json("there are no such products on DB");

  const updatedProducts = dbProducts.map((product) => {
    const productAmount = products[product._id];
    product.amountAvailable -= productAmount;
    total += product.cost * productAmount;
    product.save();
    return product;
  });

  user.deposit -= total;
  user.save();

  let remainder = user.deposit;
  let quotient = 0;

  const coinRemainders = depositCoins.map((coin) => {
    quotient = Math.floor(remainder / coin);
    remainder = remainder % coin;
    return { [coin]: quotient };
  });

  res.json({ total, updatedProducts, coinRemainders });
});

module.exports = router;
