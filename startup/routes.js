const express = require("express");
const authRoute = require("../routes/auth");
const userRoute = require("../routes/user");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
};
