const Recuirtment = require("../Model/recuirter");
const Raproblem = require("../Model/Reportaproblem");
const Roomai = require("../Model/Roomai");
const RoomModel = require("../Model/Roomcreation");
const Transcation = require("../Model/Transaction");
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
  const trans = await Transcation.find();
  const recuiter = await Recuirtment.find();

  user.sort((a, b) => {
    return (
      new Date(a.createdAt).getMonth() - new Date(b.createdAt).getMonth() &&
      new Date(a.createdAt).getFullYear() - new Date(b.createdAt).getFullYear()
    );
  });
  trans.sort((a, b) => {
    return (
      new Date(a.createdAt).getMonth() - new Date(b.createdAt).getMonth() &&
      new Date(a.createdAt).getFullYear() - new Date(b.createdAt).getFullYear()
    );
  });
  recuiter.sort((a, b) => {
    return (
      new Date(a.createdAt).getMonth() - new Date(b.createdAt).getMonth() &&
      new Date(a.createdAt).getFullYear() - new Date(b.createdAt).getFullYear()
    );
  });
  console.log(recuiter.length - 5, trans.length - 5, user.length - 5);

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     userarray,
  //     recuirterarray,
  //     transarray,
  //   },
  // });
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

exports.resumetest = async (req, res) => {
  console.log(req.files);
};

exports.Aicalculation = async (req, res) => {
  const {
    userid,
    rid,
    angry,
    disguted,
    fearful,
    happy,
    netural,
    sad,
    roomid,
    surprised,
  } = req.body;

  const finduser = await Roomai.findOne({
    roomid: roomid,
  });

  if (finduser) {
    let newarr = {
      Ranacorus: angry,
      disguted: disguted,
      Nervousness: fearful,
      Enthusiasm: happy,
      Confidence: netural,
      Depress: sad,
    };

    finduser.expression.push(newarr);
    await finduser.save();
    res.status(200).json({
      status: "success",
    });
  } else {
    await Roomai.create({
      userid: userid,
      recuiterid: rid,
      roomid: roomid,
      Ranacorus: angry,
      disgusted: disguted,
      Nervousness: fearful,
      Enthusiasm: happy,
      Confidence: netural,
      Depress: sad,
    });
    res.status(200).json({
      status: "success",
    });
  }
};

exports.getairesult = async (req, res) => {
  const { id } = req.query;
  const request = await Roomai.findOne({
    roomid: id,
  });
  res.status(200).json({
    status: "success",
    data: request,
  });
};
