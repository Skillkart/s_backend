const mongoose = require("mongoose");

const PendingSchema = new mongoose.Schema({
  recuiter: String,
  roomid: String,
  userid: String,
  date: String,
  time: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const PendingModel = mongoose.model("pendingfeedback", PendingSchema);

module.exports = PendingModel;
