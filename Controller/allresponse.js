const PendingModel = require("../Model/Pendingfeedback");
const Recuirtment = require("../Model/recuirter");
const RoomModel = require("../Model/Roomcreation");
const RoomMessModel = require("../Model/Roommsg");
const Transcation = require("../Model/Transaction");
const User = require("../Model/Usermodel");

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
  const pendingfee = await PendingModel.find()
  const transcations = await Transcation.find(
    {},
    {
      sort: {
        createdAt: -1, //Sort by Date Added DESC
      },
    }
  );
  res.status(200).json({
    status: "success",
    data: request,
    user: user,
    transcations: transcations,
    room: room,
    pendingfee : pendingfee
  });
};




