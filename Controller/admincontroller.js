const Jobsapply = require("../Model/Jobapply");

exports.adminjobpanel = async (req, res) => {
  const request = await Jobsapply.find();

  res.status(200).json({
    statue: "success",
    data: request,
  });
};
