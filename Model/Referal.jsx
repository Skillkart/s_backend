const mongoose = require("mongoose");
const ReferalModel = new mongoose.Schema({
  refererEmail: String,
  referfor: Number,
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Referal = mongoose.Model("refer", ReferalModel);

module.exports = Referal