const Secretaac = require("../Model/secreta/Secretaac");
const Secretamess = require("../Model/secreta/Secretamess");

const randomstring = (username, size) => {
  let resize = 0;
  if (parseInt(resize / 10) == 0) {
    resize = 1;
  } else {
    resize = parseInt(size / 10) + 1;
  }
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //   let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < resize; i++) {
    username += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return username;
};

const checkusername = async (username, findlength) => {
  const user = await Secretaac.findOne({
    username,
  });
  if (user) {
    const newusername = await randomstring(username, findlength);
    return checkusername(newusername, findlength);
  } else {
    return username;
  }
};
exports.secreatuser = async (req, res) => {
  const { username, email, phone } = req.body;
  const findlength = await Secretaac.find();
  const rstring = await checkusername(username.toLowerCase(), findlength);
  const usercheck = await Secretaac.findOne({ Email: email });
  if (usercheck) {
    res.status(200).json({
      status: "success",
      data: usercheck,
    });
  } else {
    const r = await Secretaac.create({
      username: rstring,
      Email: email,
      phone: phone,
    });
    res.status(200).json({
      status: "success",
      data: r,
    });
  }
};

exports.getaccountdetail = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  const user = await Secretaac.findOne({
    username: id.toLowerCase(),
  });

  if (user) {
    res.status(200).json({
      status: "success",
      data: user,
    });
  } else {
    res.status(401).json({
      status: "Fail",
      message: "user not found",
    });
  }
};

exports.getmessages = async (req, res) => {
  const { username, message } = req.body;
  const user = await Secretaac.findOne({
    username,
  });

  if (user) {
    await Secretamess.create({
      userid: username,
      message: message,
    });
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(400).json({
      status: "Failed",
    });
  }
};

exports.secretamessage = async (req, res) => {
  const { username } = req.query;
  console.log(username);
  const mess = await Secretamess.find({
    userid: username.toLowerCase(),
  }).sort({ seen: "asc" });
  console.log(mess);
  res.status(200).json({
    status: "success",
    data: mess,
  });
};

exports.seenrqt = async (req, res) => {
  const { id } = req.query;
  const seen = await Secretamess.findOne({
    _id: id,
    seen: false,
  });
  if (seen) {
    seen.seen = true;
    await seen.save();
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(200).json({
      status: "success",
    });
  }
};
