const mongoose = require("mongoose");

const TranscationModel = new mongoose.Schema({
  user: String,
  user_name: String,
  course: String,
  price: Number,
  status: String,
  razarpay_order_id: String,
  razarpay_payment_id: String,
  Purchasedate: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Transcation = mongoose.model("transcation", TranscationModel);
module.exports = Transcation;
