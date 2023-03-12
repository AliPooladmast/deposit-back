const express = require("express");
const authRoute = require("../routes/auth");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", authRoute);
};
