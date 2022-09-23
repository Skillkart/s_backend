const mongoose = require("mongoose");
const ReferalModel = new mongoose.Schema({
  refererEmail: String,
  referedby: String,
  used: {
    type: Boolean,
    default: false,
  },
  paid: {
    type:Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Referal = mongoose.model("refer", ReferalModel);

module.exports = Referal