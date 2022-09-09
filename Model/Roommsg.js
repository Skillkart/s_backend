const mongoose = require("mongoose");

const RoomMessSchema = new mongoose.Schema({
  message: String,
  user_name: String,
  roomid: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const RoomMessModel = mongoose.model("roommsg", RoomMessSchema);

module.exports = RoomMessModel;
