const mongoose = require("mongoose");

const JobModel = new mongoose.Schema({
  jobtitle: String,
  jobplace: String,
  jobtype: String,
  jobdescription: String,
  jobresponsibility: String,
  jobSkills: String,
  otherdetail: String,
});

const Jobs = mongoose.model("Jobs", JobModel);

module.exports = Jobs;
