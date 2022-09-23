const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  user: String,
  recuiter: String,
  user_name: String,
  recuiter_name: String,
  recuiter_photo: String,
  roomid: String,
  time: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
  round :{
    type:String,
  },
  compeleted: {
    type: Boolean,
    default: false,
  },
  resume:{
    type:String 
  },
  transcationid:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const RoomModel = mongoose.model("room", RoomSchema);

module.exports = RoomModel;
