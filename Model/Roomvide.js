const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  user: String,
  recuiter: String,
  roomid: String,
  video: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const RoomVideos = mongoose.model("roomvideos", RoomSchema);

module.exports = RoomVideos;
