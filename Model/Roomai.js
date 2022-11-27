const mongoose = require("mongoose");

const AiModel = new mongoose.Schema({
  userid: String,
  recuiterid: String,
  expression: [
    {
      angry: Number,
      disgusted: Number,
      fearful: Number,
      happy: Number,
      neutral: Number,
      sad: Number,
    },
  ],

  //   surprised: Number,
});

module.exports = Roomai = mongoose.model("Aicalculation", AiModel);
