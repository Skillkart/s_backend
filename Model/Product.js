const mongoose = require("mongoose");

const Productmodel = new mongoose.Schema({
  product_name: String,
  product_pricing: String,
  discount_pricing: String,
  total_session: Number,
  activate: Boolean,
});

module.exports.Product = mongoose.model("Product", Productmodel);
