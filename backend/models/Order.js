const mongoose = require("mongoose");

module.exports = mongoose.model("Order", {
  item: String,
  price: Number,
  user: String,
  date: { type: Date, default: Date.now }
});
