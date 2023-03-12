const express = require("express");
const authRoute = require("../routes/auth");
const userRoute = require("../routes/user");
const productRoute = require("../routes/product");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/products", productRoute);
};
