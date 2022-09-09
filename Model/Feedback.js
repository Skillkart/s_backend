const mongoose = require("mongoose");

const FeedbackModel = new mongoose.Schema({
  EDB: String,
  CS: String,
  LISL: String,
  INSI: String,
  EAS: String,
  LA: String,
  EL: String,
  EIO: String,
  TM: String,
  TK: String,
  EONLNS: String,
  SH: String,
  CITA: String,
  AC: String,
  STLP: String,
  TSI: String,
  SU: String,
  OHI: String,
  IOT: String,
  userid:String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Feedback = mongoose.model("Feedback", FeedbackModel);
module.exports = Feedback;
