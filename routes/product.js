const { verifyTokenSeller } = require("../middleware/verifyToken");
const router = require("express").Router();
const { Product, schema } = require("../models/Product");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validateSchema");

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

module.exports = router;
