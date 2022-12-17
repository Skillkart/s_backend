const mongoose = require("mongoose");

const AiModel = new mongoose.Schema({
  userid: String,
  recuiterid: String,
  expression: [
    {
      Ranacorus: Number,
      disgusted: Number,
      Nervousness: Number,
      Enthusiasm: Number,
      Confidence: Number,
      Depress: Number,
    },
  ],

  //   surprised: Number,
});

module.exports = Roomai = mongoose.model("Aicalculation", AiModel);
