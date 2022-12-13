const Jobs = require("../Model/Jobs");

exports.postjobs = async (req, res) => {
  const {
    jobtitle,
    jobplace,
    jobtype,
    description,
    jobskills,
    jobresponsibility,
    otherdetail,
  } = req.body;

  const request = await Jobs.create({
    jobtitle: jobtitle,
    jobplace: jobplace,
    jobtype: jobtype,
    jobSkills: jobskills,
    jobdescription: description,
    jobresponsibility: jobresponsibility,
    otherdetail: otherdetail,
  });

  res.status(200).json({
    status: "success",
  });
};

exports.getjobs = async (req, res) => {
  const request = await Jobs.find();
  res.status(200).json({
    status: "success",
    data: request,
  });
};
