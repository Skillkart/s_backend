const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resumeSchema = new Schema({
  user:String,
  resume: {
    type: String,
  },
});

module.exports = mongoose.model("Resumes", resumeSchema);
