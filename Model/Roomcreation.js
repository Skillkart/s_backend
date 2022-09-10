const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  user: String,
  recuiter: String,
  user_name: String,
  recuiter_name: String,
  recuiter_photo: String,
  roomid: String,
  course_index: Number,
  Course_cat: String,
  time: String,
  date: String,
  course: String,
  price: String,
  course_index: Number,
  Course_cat: String,
  pendingfeedback: { type: Boolean, default: false },
  status:String, 
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const RoomModel = mongoose.model("room", RoomSchema);

module.exports = RoomModel;
