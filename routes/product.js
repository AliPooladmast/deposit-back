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

module.exports = router;
