const Secretaac = require("../Model/secreta/Secretaac");
const Secretamess = require("../Model/secreta/Secretamess");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");

const serviceAccount = require("./hizzz-439a5-firebase-adminsdk-ojnby-53d8edca51.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const jsontoken = async (id) => {
  return jwt.sign({ data: id }, process.env.tokn_crypt, {
    expiresIn: "90d",
  });
};

const createtoken = async (user, statuscode, res, req) => {
  const token = await jsontoken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  res.status(statuscode).json({
    status: "success",
    token: token,
    data: user,
  });
};

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
  const { username, email, phone, ftoken, password } = req.body;
  const findlength = await Secretaac.find();
  const usercheck = await Secretaac.findOne({ Email: email.toLowerCase() });
  if (usercheck) {
    res.status(400).json({
      status: "failed",
    });
  } else {
    const rstring = await checkusername(
      username.toLowerCase().split(" ").join(""),
      findlength
    );
    const cryptpassword = await bcrypt.hash(password, 15);
    const r = await Secretaac.create({
      username: rstring,
      Email: email.toLowerCase(),
      password: cryptpassword,
      ftoken,
    });
    createtoken(r, 200, res, req);
  }
};

exports.userlogin = async (req, res) => {
  const { user, password, ftoken } = req.body;
  const useremail = await Secretaac.findOne({
    Email: user.toLowerCase(),
  });
  const username = await Secretaac.findOne({
    username: user.toLowerCase(),
  });
  const userephone = await Secretaac.findOne({
    phone: user.toLowerCase(),
  });

  if (username || useremail || userephone) {
    if (username) {
      const dcrpt = await bcrypt.compare(password, username.password);
      if (dcrpt) {
        username.ftoken = ftoken;
        await username.save();
        createtoken(username, 201, res, req);
      } else {
        res.status(400).json({
          status: "failed",
          message: "Incorrect password",
        });
      }
    }
    if (useremail) {
      const dcrpt = await bcrypt.compare(password, useremail.password);
      if (dcrpt) {
        useremail.ftoken = ftoken;
        await useremail.save();
        createtoken(useremail, 201, res, req);
      } else {
        res.status(400).json({
          status: "failed",
          message: "Incorrect password",
        });
      }
    }
    if (userephone) {
      const dcrpt = await bcrypt.compare(password, userephone.password);
      if (dcrpt) {
        userephone.ftoken = ftoken;
        await userephone.save();
        createtoken(userephone, 201, res, req);
      } else {
        res.status(400).json({
          status: "failed",
          message: "Incorrect password",
        });
      }
    }
  } else {
    res.status(401).json({
      status: "failed",
      message: "user not found",
    });
  }
};

exports.getaccountdetail = async (req, res) => {
  const { id } = req.query;

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
  const { token } = req.body;
  // const { username, usermessage, contenttype, token } = req.body;
  // console.log(username, usermessage, token);

  // const user = await Secretaac.findOne({
  //   username,
  // });
  // const usermess = await Secretamess.find({
  //   userid: username,
  // });
  // if (user) {
  //   await Secretamess.create({
  //     userid: user._id,
  //     message: usermessage,
  //     contenttype: contenttype,
  //     messageindex: usermess.length + 1,
  //   });
  const notify = {
    tokens: [token],
    notification: {
      title: "New message arrive",
      body: "Someone send you a message",
    },
  };

  await admin
    .messaging()
    .sendMulticast(notify)
    .then((res) => {
      console.log("send success", res);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200).json({
    status: "success",
  });
};

exports.secretamessage = async (req, res) => {
  const { username } = req.query;
  console.log(username);
  const mess = await Secretamess.find({
    userid: username,
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
    const message = await Secretamess.find();
    res.status(200).json({
      status: "success",
      message: message,
    });
  } else {
    res.status(200).json({
      status: "success",
    });
  }
};

exports.sislogin = async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.tokn_crypt);
      const currentUser = await Secretaac.findById(decoded.data);
      res.status(200).json({
        status: "success",
        data: currentUser,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.secretaphone = async (req, res) => {
  const { userid, phone } = req.body;
  const user = await Secretaac.findOne({
    _id: userid,
  });

  if (user) {
    user.phone = phone;
    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
  } else {
    res.status(400).json({
      status: "Fail",
    });
  }
};
