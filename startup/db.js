const mongoose = require("mongoose");
const winston = require("winston");

module.exports = async () => {
  mongoose.set("strictQuery", false);

  const conn = await mongoose
    .connect(process.env.DB_URL)
    .then(() => winston.info("Backend server is connected to DB"))
    .catch((err) => winston.error(err));
};
