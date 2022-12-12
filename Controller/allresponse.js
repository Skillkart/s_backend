const Feedback = require("../Model/Feedback");
const PendingModel = require("../Model/Pendingfeedback");
const Recuirtment = require("../Model/recuirter");
const Referal = require("../Model/Referal");
const Raproblem = require("../Model/Reportaproblem");
const RoomModel = require("../Model/Roomcreation");
const RoomMessModel = require("../Model/Roommsg");
const Transcation = require("../Model/Transaction");
const User = require("../Model/Usermodel");
const Waitinglist = require("../Model/Waitinglis");

exports.userdata = async (req, res) => {
  const { email, role } = req.body;
  const response = await Recuirtment.findOne({
    Email: email,
  });

  res.status(200).json({
    data: response?.busydate,
  });
};

exports.mentor = async (req, res) => {
  const request = await Recuirtment.find();
  const room = await RoomModel.find();
  const user = await User.find();
  const waitinglist = await Waitinglist.find();
  const reportproblem = await Raproblem.find();
  const referal = await Referal.find();
  const pendingfee = await PendingModel.find();``
  const transcations = await Transcation.find();
  const feedback = await Feedback.find();
  res.status(200).json({
    status: "success",
    data: request,
    user: user,
    transcations: transcations,
    room: room,
    pendingfee: pendingfee,
    requestproblem: reportproblem,
    Waitingmember: waitinglist,
    Feedback: feedback,
    referal: referal
  });
};
