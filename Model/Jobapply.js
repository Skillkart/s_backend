const mongoose = require("mongoose");

const Jobapply = new mongoose.Schema({
  jobid: String,
  userid: String,
  applyedon: String,
});

module.exports.Jobsapply = mongoose.model("Jobsapply", Jobapply);
