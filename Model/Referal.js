const mongoose = require("mongoose");
const ReferalModel = new mongoose.Schema({
  referedEmail: String,
  referedbyEmail: String,
  refererid: String,
  refererusername: String,
  referedusername: String,
  used: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  refercode:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  refererphonenumber: {
    type: String
  }
});

const Referal = mongoose.model("refer", ReferalModel);

module.exports = Referal;
