const mongoose = require("mongoose");

const TranscationModel = new mongoose.Schema({
  U_id: String,
  price: String,
  course: String,
  recuiter_id: String,
  roomId: String,
  course_index: Number,
  Course_cat: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Transcation = mongoose.model("transcation", TranscationModel);
module.exports = Transcation;
