const Recuirtment = require("../Model/recuirter");
const Raproblem = require("../Model/Reportaproblem");
const RoomModel = require("../Model/Roomcreation");
const User = require("../Model/Usermodel");
const RoomEmail = require("../Other/roomhandler");

exports.mailer = async (req, res) => {
  const { username, url, email } = req.body;
  await new RoomEmail(username, email).send();
};

exports.getrounds = async (req, res) => {
  const { user_id, transid } = req.body;

  const request = await RoomModel.find({
    user: user_id,
    transcationid: transid,
  });
  res.status(200).json({
    status: "success",
    data: request,
  });
};

exports.getuandr = async (req, res) => {
  const user = await User.find();
  const recuiter = await Recuirtment.find();

  let userarray = [];
  let recuirterarray = [];
  let month = new Date().getMonth();
  let um = month - 5;
  let rm = month - 5;
  for (let i = 0; i < 6; i++) {
    const fi = user.filter(
      (state) => new Date(state.createdAt).getMonth() == um
    );
    um += 1;
    userarray.push(fi.length);
  }
  for (let i = 0; i < 6; i++) {
    const fi = recuiter.filter(
      (state) => new Date(state.createdAt).getMonth() == rm
    );
    rm += 1;
    recuirterarray.push(fi.length);
  }

  res.status(200).json({
    status: "success",
    data: {
      userarray,
      recuirterarray,
    },
  });
};

exports.reportproblem = async (req, res) => {
  const { userid, recuiterid, message, roomid } = req.body;

  await Raproblem.create({
    userid,
    roomid,
    report: message,
    bordedRecuiter: recuiterid,
  });
  
  res.status(200).json({
    status: "success",
  });
};



exports.resumetest=async(req,res)=>{
    console.log(req.files)
}