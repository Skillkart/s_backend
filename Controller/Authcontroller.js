const Crypto = require("crypto");
const Feedback = require("../Model/Feedback");
const Recuirtment = require("../Model/recuirter");
const User = require("../Model/Usermodel");
const Email = require("../Other/Emailhandler");
const RoomEmail = require("../Other/roomhandler");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const uuidv4 = require("uuidv4");
const AppError = require("../Other/Apperror");
const bcrypt = require("bcrypt");
const RoomModel = require("../Model/Roomcreation");
const Transcation = require("../Model/Transaction");
const { findByIdAndUpdate } = require("../Model/recuirter");
const RoomMessModel = require("../Model/Roommsg");
const { deleteMany } = require("../Model/Roommsg");
const PendingModel = require("../Model/Pendingfeedback");
const Razorpay = require("razorpay");
const Waitinglist = require("../Model/Waitinglis");
const Subscribe = require("../Model/Subscribe");
const Referal = require("../Model/Referal");
const RoomVideos = require("../Model/Roomvide");
const { Callrequest } = require("../Model/Callrequest");

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const jsontoken = async (id) => {
  return jwt.sign({ data: id }, process.env.tokn_crypt, {
    expiresIn: "90d",
  });
};

const createtoken = async (user, statuscode, res, req, redirect) => {
  const token = await jsontoken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  res.status(statuscode).json({
    status: "success",
    token,
    redirect,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  const {
    username,
    email,
    phone,
    password,
    college,
    stream,
    degree,
    graduateyear,
    photo,
    Linkedin,
    step,
  } = req.body;
  console.log(
    username,
    email,
    phone,
    password,
    college,
    stream,
    degree,
    graduateyear
  );

  const rec = await Recuirtment.findOne({
    Email: email.toLowerCase(),
  });

  if (rec) {
    res.status(401).json({
      status: "success",
      message: "already had an account as Recuiter.",
    });
  } else {
    const user = await User.findOne({
      Email: email,
    });

    if (!user) {
      const ecrpyt = await bcrypt.hash(password, 15);
      const newuser = await User.create({
        Name: username,
        Email: email,
        password: ecrpyt,
        phone: phone,
        step: step,
      });
      const refer = await Referal.findOne({
        referedEmail: email,
      });

      await new Email("", username, email, "VerifyEmail").welcomesend();

      if (refer) {
        refer.used = true;
        await refer.save();
      }

      res.status(200).json({
        status: "success",
        data: newuser,
      });
    } else {
      if (user.completed) {
        res.status(401).json({
          status: "Fail",
        });
      } else {
        if (stream && degree && college && graduateyear && photo) {
          user.stream = stream;
          user.degree = degree;
          user.college = college;
          user.photo = photo;
          user.graduateyear = graduateyear;
          user.completed = true;
          user.Linkedinprofile = Linkedin;
          await user.save();
          createtoken(user, 201, res, req);
        } else {
          res.status(200).json({
            status: "success",
            data: user,
          });
        }
      }
    }
  }
  // if (!user) {
  //   const ecrpt = await bcrypt.hash(password, 10);
  //   const verifytoken = getRandomArbitrary(100000, 999999);
  //   const newUser = await User.create({
  //     Name: username,
  //     Email: email,
  //     password: ecrpt,
  //     phone: phone,
  //     passwordResetToken: verifytoken,
  //   });
  //   const refer = await Referal.findOne({
  //     referedEmail: email,
  //   });

  //   if (refer) {
  //     refer.used = true;
  //     await refer.save();
  //   }

  //   createtoken(newUser, 201, res, req);

  //   await new Email(verifytoken, username, email, "VerifyEmail").send();
  //   await new Email(verifytoken, username, email, "VerifyEmail").welcomesend();

  //   setTimeout(() => {
  //     newUser.passwordResetToken = "";
  //     newUser.save();
  //   }, 1000 * 300);
  // } else {
  //   res.status(400).json({
  //     status: "Failed",
  //   });
  // }
};

exports.login = async (req, res, next) => {
  const { email, password, ipaddress, lastlogin } = req.body;
  const user = await User.findOne({
    Email: email,
  });
  const rec = await Recuirtment.findOne({
    Email: email,
  });
  if (!user && !rec) {
    return next(
      new AppError("Didn't find associate with this EmailId.", 401, res)
    );
  }
  if (rec) {
    const dcrpt = await bcrypt.compare(password, rec.Password);
    console.log(dcrpt);
    console.log(password, rec.Password);
    if (!dcrpt) {
      return next(new AppError("Incorrect email or password.", 401, res));
    } else {
      rec.ipaddress = ipaddress;
      rec.lastlogin = lastlogin;
      await rec.save();
      createtoken(rec, 201, res, req, true);
    }
  } else {
    const dcrpt = await bcrypt.compare(password, user.password);

    if (dcrpt) {
      user.ipaddress = ipaddress;
      user.lastlogin = lastlogin;

      await user.save();
      const trans = await Transcation.find({
        user: user._id,
        status: "success",
      });
      const transfilter = trans.filter(
        (state) =>
          Math.floor(
            (new Date().getTime() - new Date(state.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          ) < 60 && state.status == "success"
      );
      if (transfilter.length) {
        if (!dcrpt) {
          return next(new AppError("Incorrect email or password.", 401, res));
        } else {
          createtoken(user, 201, res, req, true);
        }
      } else {
        createtoken(user, 201, res, req, false);
      }
    } else {
      return next(new AppError("Incorrect email or password.", 401, res));
    }
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await jwt.verify(req.cookies.jwt, process.env.tokn_crypt);
      const currentUser = await User.findById(decoded.data);
      if (!currentUser) {
        const ctUser = await Recuirtment.findById(decoded.data);
        if (ctUser) {
          res.locals.user = ctUser;
          return next();
        }
        res.locals.user = "";
        return next();
      } else {
        res.locals.user = currentUser;
        return next();
      }
    } catch (err) {
      return next();
    }
  } else {
    res.locals.user = "";
    return next();
  }
};

exports.loggedin = async (req, res, next) => {
  const { token } = req.body;
  console.log(req.cookies, "hi");
  console.log("hi");
  const mentor = await Recuirtment.find();
  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.tokn_crypt);
      const currentUser = await User.findById(decoded.data);
      if (!currentUser) {
        const ctUser = await Recuirtment.findById(decoded.data);
        if (ctUser) {
          const meeting = await RoomModel.find({
            recuiter: ctUser._id,
          });
          res.status(200).json({
            status: "success",
            data: ctUser,
            meeting: meeting,
          });
        } else {
          res.status(400).json({
            status: "Failed",
            message: "Not User Found",
          });
        }
      } else {
        const meeting = await RoomModel.find({
          user: currentUser._id,
        });

        res.status(200).json({
          status: "success",
          data: currentUser,
          meeting: meeting,
        });
      }
    } catch (error) {
      res.status(400).json({
        status: "Logout",
        // mentor: mentor,
      });
    }
  } else {
    res.status(400).json({
      status: "Logout",
      // mentor: mentor,
    });
  }
};

exports.tknvrfy = async (req, res) => {
  const { email, tkn } = req.body;
  const user = await User.findOne({
    Email: email,
  });

  if (user.passwordResetToken) {
    if (user.passwordResetToken === tkn) {
      user.Emailverified = true;
      await user.save();
      res.status(201).json({
        status: "success",
        message: "done",
      });
    } else {
      res.status(401).json({
        status: "failed",
        message: "Incorrect Code",
      });
    }
  } else {
    res.status(400).json({
      status: "fail",
      message: "Verification code expire",
    });
  }
};

exports.mentosignup = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    qualy,
    currentrole,
    workat,
    Linkendin,
    expertise,
    gender,
    recuirment,
    qualityrelookingfor,
    sparetime,
    experience,
  } = req.body;

  const user = await User.findOne({
    Email: email,
  });
  const rec = await Recuirtment.findOne({
    Email: email,
  });
  if (!user && !rec) {
    const ecrpt = await bcrypt.hash(password, 15);
    const verifytoken = getRandomArbitrary(100000, 999999);
    const mentor = await Recuirtment.create({
      Name: name,
      Email: email,
      Password: ecrpt,
      phone: phone,
      Gender: gender,
      Experience: experience,
      qualification: qualy,
      workat: workat,
      currentrole: currentrole,
      Linkendin: Linkendin,
      AOE: expertise,
      NERE: recuirment,
      qualities: qualityrelookingfor,
      Rsparetime: sparetime,
      passwordResetToken: verifytoken,
    });
    createtoken(mentor, 201, res, req);

    await new Email(verifytoken, name, email).welcomementor();

    setTimeout(() => {
      mentor.passwordResetToken = "";
      mentor.save();
    }, 90000);

    setTimeout(async () => {
      await new Email(verifytoken, name, email).welcome();
    }, 1000 * 15 * 60);
    return mentor;
  }
  if (user) {
    res.status(400).json({
      status: "failed",
      message: "Already had an account as student",
    });
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Already had an account ",
    });
  }
};

exports.deleteroom = async (req, res) => {
  const { roomid } = req.body;

  const Room = await RoomModel.findByIdAndDelete(roomid);

  res.status(200).json({
    status: "success",
  });
};
exports.verifyroom = async (req, res) => {
  const { room_id } = req.body;
  if (room_id.length >= 12) {
    const Room = await RoomModel.findById(room_id);

    if (Room) {
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(401).json({
        status: "fail",
      });
    }
  } else {
    res.status(400).json({
      status: "Fail",
    });
  }
};

exports.getfeedbackdetail = async (req, res) => {
  const { roomid } = req.body;
  if (room_id.length >= 12) {
    const roomava = await Transcation.findOne({
      roomId: roomid,
    });

    if (roomava) {
      const user = await User.findById(roomava.U_id);
      const re = await Recuirtment.findById(roomava.recuiter_id);
      res.status(200).json({
        status: "success",
        user: user,
        rec: re,
      });
    } else {
      res.status(400).json({
        status: "fail",
      });
    }
  } else {
    res.status(400).json({
      status: "Fail",
    });
  }
};

exports.userdata = async (req, res) => {
  const { role, id } = req.body;
  if (id.length >= 12) {
    if (role == "recuirter") {
      const profile = await Recuirtment.findById(id);
      res.status(200).json({
        status: "success",
        data: profile,
      });
    } else {
      const profile = await User.findById(id);
      const roomparticipate = await RoomModel.findOne({
        recuiter_id: id,
      });
      const feedback = await Feedback.findOne({
        feedbackfor: id,
      });
      res.status(200).json({
        status: "success",
        data: profile,
        parties: roomparticipate,
        feedback: feedback,
      });
    }
  } else {
    res.status(400).json({
      status: "Fail",
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.feedback = async (req, res) => {
  const { feedbackfor, by, feedbackinput, rating, roomid } = req.body;
  if (roomid.length >= 12) {
    const feedbcksrch = await Feedback.findOne({
      roomid: roomid,
    });
    if (!feedbcksrch) {
      const feedbackcreate = await Feedback.create({
        feedbackfor: feedbackfor,
        by: by,
        feedback: feedbackinput,
        rating: rating,
        roomid: roomid,
      });
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "Fail",
      });
    }
  } else {
    res.status(400).json({
      status: "Fail",
    });
  }
};

exports.mentortknvrfy = async (req, res) => {
  const { email, tkn } = req.body;
  const user = await Recuirtment.findOne({
    Email: email,
  });
  if (user.passwordResetToken) {
    if (user.passwordResetToken == tkn) {
      user.Emailverified = true;
      await user.save();
      res.status(201).json({
        status: "success",
      });
    }
  } else {
    res.status(401).json({
      status: "failed",
    });
  }
};

exports.Editprofile = async (req, res) => {
  const { id, name, phone, role, Currentrole, workat, AOE, qualification } =
    req.body;
  if (role == "user") {
    const user = await User.findById(id);
    user.Name = name;
    user.phone = phone;
    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
  }
  if (role == "recuirter") {
    const rec = await Recuirtment.findById(id);
    rec.Name = name;
    rec.phone = phone;
    rec.currentrole = Currentrole;
    rec.workat = workat;
    rec.AOE = AOE;
    rec.qualification = qualification;
    await rec.save();
    res.status(200).json({
      status: "success",
      data: rec,
    });
  }
};

exports.busydate = async (req, res) => {
  const { date, time, user_id, schdule, day } = req.body;
  const data = await Recuirtment.findById({ _id: user_id });

  const total_day_in_month = new Date(
    new Date().getFullYear(),
    parseInt(date.split(" ")[1]),
    0
  ).getDate();
  let current_date = parseInt(date.split(" ")[0]);
  let left_days = total_day_in_month - parseInt(date.split(" ")[0]);
  if (schdule) {
    if (left_days < 7) {
      data.busydate.push({
        date: `${current_date} ${date.split(" ")[1]} ${date.split(" ")[2]}`,
        time: [time],
        index: data.busydate.length,
      });
      await data.save();
      res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      let timeleft =
        (total_day_in_month -
          parseInt(current_date) -
          ((total_day_in_month - parseInt(current_date)) % 7)) /
        7;
      console.log((31 - 2 - ((31 - 2) % 7)) / 7);
      console.log(timeleft);
      for (let d = 0; d < timeleft + 1; d++) {
        const filter = data.busydate.filter(
          (state) =>
            state.date ==
            `${parseInt(date.split(" ")[0]) + d * 7} ${date.split(" ")[1]} ${
              date.split(" ")[2]
            }`
        );
        if (filter.length) {
          const clude = filter[0]?.time?.includes(time);
          if (!clude) {
            data.busydate[filter[0]?.index]?.time?.push(time);
            await data.save();
          } else {
            continue;
          }
        } else {
          data.busydate.push({
            date: `${parseInt(date.split(" ")[0]) + d * 7} ${
              date.split(" ")[1]
            } ${date.split(" ")[2]}`,
            time: [time],
            index: data.busydate.length,
          });
        }
      }

      await data.save();
      res.status(200).json({
        status: "success",
        data,
      });
    }
  } else {
    const filter = data.busydate.filter((state) => state.date == date);
    if (filter.length) {
      const clude = filter[0]?.time?.includes(time);
      if (!clude) {
        data.busydate[filter[0]?.index]?.time?.push(time);
        await data.save();
        res.status(200).json({
          status: "success",
          data: data,
        });
      } else {
        res.status(400).json({
          status: "FAILED",
          message: "Change time slot",
        });
      }
    } else {
      data.busydate.push({
        date: date,
        time: [time],
        index: data.busydate.length,
      });
      await data.save();
      // const updator = await Recuirtment.findByIdAndUpdate(
      //   { _id: user_id },
      //   {
      //     $push: {
      //       busydate: [
      //         {
      //           date: date,
      //           time: [time],
      //           index: data.busydate.length,
      //         },
      //       ],
      //     },
      //   }
      // );
      res.status(200).json({
        status: "success",
        data: data,
        // updator,
      });
    }
  }
  // if (data.busydate.length) {
  //   const filter = data.busydate.filter((state) => state.date == date);
  //   if (filter.length) {
  //     const clude = filter[0]?.time?.includes(time);
  //     if (!clude) {
  //       data.busydate[filter[0]?.index]?.time?.push(time);
  //       await data.save();
  //       res.status(200).json({
  //         status: "success",
  //         data: data,
  //       });
  //     } else {
  //       res.status(400).json({
  //         status: "FAILED",
  //         message: "Change time slot",
  //       });
  //     }
  //   } else {
  //     if (schdule) {
  //       let monthdate = new Date(
  //         new Date().getFullYear(),
  //         new Date().getMonth() + 1,
  //         0
  //       ).getDate();
  //       let s = 0;
  //       let ds = parseInt(date.split(" ")[0]);
  //       for (let d = 0; d < 7 - day; d++) {
  //         if (monthdate - ds >= 0) {
  //           const updator = await Recuirtment.findByIdAndUpdate(
  //             { _id: user_id },
  //             {
  //               $push: {
  //                 busydate: [
  //                   {
  //                     date: `${parseInt(date.split(" ")[0]) + d} ${
  //                       date.split(" ")[1]
  //                     } ${date.split(" ")[2]}`,
  //                     time: [time],
  //                     index: data.busydate.length,
  //                   },
  //                 ],
  //               },
  //             }
  //           );
  //           await updator.save();
  //           ds++;
  //         } else {
  //           break;
  //         }
  //       }

  //       res.status(200).json({
  //         status: "success",
  //         data: data,
  //       });
  //     } else {
  //       const updator = await Recuirtment.findByIdAndUpdate(
  //         { _id: user_id },
  //         {
  //           $push: {
  //             busydate: [
  //               {
  //                 date: date,
  //                 time: [time],
  //                 index: data.busydate.length,
  //               },
  //             ],
  //           },
  //         }
  //       );
  //       res.status(200).json({
  //         status: "success",
  //         data: updator,
  //         f: "yeap",
  //       });
  //     }
  //   }
  // } else {
  //   const updator = await Recuirtment.findByIdAndUpdate(
  //     { _id: user_id },
  //     {
  //       $push: {
  //         busydate: [
  //           {
  //             date: date,
  //             time: [time],
  //             index: data.busydate.length,
  //           },
  //         ],
  //       },
  //     }
  //   );
  //   res.status(200).json({
  //     status: "success",
  //     data: updator,
  //     f: "yeap",
  //   });
  // }
};

exports.userforgetpass = async (req, res) => {
  const { token, password } = req.body;
  console.log(token, password);
  const rec = await Recuirtment.findOne({
    passwordResetToken: token,
  });
  const user = await User.findOne({
    passwordResetToken: token,
  });

  if (user || rec) {
    if (user) {
      const ecrpt = await bcrypt.hash(password, 15);
      user.password = ecrpt;
      user.passwordResetToken = "";
      console.log(user);
      await user.save();
      res.status(200).json({
        status: "success",
      });
    }
    if (rec) {
      const ecrpt = await bcrypt.hash(password, 15);
      rec.Password = ecrpt;
      rec.passwordResetToken = "";
      await rec.save();
      res.status(200).json({
        status: "success",
      });
    }
  } else {
    res.status(401).json({
      status: "Fail",
      message: "Token expired.",
    });
  }
  // if (role == "user") {
  //   const user = await User.findOne({ Email: email });
  //   const ecrpt = await bcrypt.hash(password, 10);
  //   user.password = ecrpt;
  //   console.log(user);
  //   await user.save();
  //   res.status(200).json({
  //     status: "success",
  //   });
  // } else {
  //   const user = await Recuirtment.findOne({ Email: email });
  //   const ecrpt = await bcrypt.hash(password, 10);
  //   user.Password = ecrpt;
  //   await user.save();
  //   res.status(200).json({
  //     status: "success",
  //   });
  // }
};

exports.createmsg = async (req, res) => {
  const { msg, username, roomid } = req.body;

  const request = await RoomMessModel.create({
    message: msg,
    user_name: username,
    roomid: roomid,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.getmessage = async (req, res) => {
  const { roomid } = req.body;
  const message = await RoomMessModel.find({
    roomid: roomid,
  }).sort({ createdAt: -1 });
  res.status(200).json({
    data: message,
  });
};

exports.deleteroommsg = async (req, res) => {
  const { roomid, userid } = req.body;
  const pendingfeedback = await Recuirtment.findById(userid);
  pendingfeedback.pendingfeedback = true;
  const request = await RoomMessModel.deleteMany({
    roomid: roomid,
  });

  await pendingfeedback.save();
  res.status(200).json({
    status: "success",
  });
};

exports.pfee = async (req, res) => {
  const { roomid, userid, time, date } = req.body;
  const re = await RoomModel.findOne({
    roomid: roomid,
  });
  const p = await PendingModel.findOne({
    roomid,
  });
  if (p) {
    res.status(200).json({
      status: "success",
    });
  } else {
    const request = await PendingModel.create({
      recuiter: userid,
      userid: re.user,
      roomid: roomid,
      date: date,
      time: time,
    });

    const recuit = await Recuirtment.findById(userid);
    recuit.pendingfeedback = true;
    await recuit.save();
    if (request) {
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "Failed",
      });
    }
  }
};
exports.mentorfeedback = async (req, res) => {
  const {
    EDB,
    CS,
    LISL,
    INSI,
    EAS,
    LA,
    EL,
    EIO,
    TM,
    TK,
    EONLNS,
    SH,
    CITA,
    AC,
    STLP,
    TSI,
    SU,
    OHI,
    tread,
    userid,
    roomid,
  } = req.body;
  const user = await Recuirtment.findById(userid);
  user.pendingfeedback = false;

  const request = await Feedback.create({
    EDB,
    CS,
    LISL,
    INSI,
    EAS,
    LA,
    EL,
    EIO,
    TM,
    TK,
    EONLNS,
    SH,
    CITA,
    AC,
    STLP,
    TSI,
    SU,
    OHI,
    tread,
    userid,
    roomid,
  });
  await user.save();
  const crequest = await RoomModel.findOne({
    roomid: roomid,
  });

  if (crequest) {
    const pfe = await PendingModel.findOneAndDelete({ roomid });
    request.compeleted = true;
    await crequest.save();
  }
  res.status(200).json({
    status: "success",
  });
};

function randomString(size = 8) {
  return Crypto.createHash("sha256").digest("hex").slice(0, size);
}

exports.updateroomdetail = async (req, res) => {
  const { roomid } = req.body;
  const request = await RoomModel.findOne({
    roomid: roomid,
  });

  if (request) {
    request.compeleted = true;
    res.status(200).json({
      status: "success",
    });
    await request.save();
  } else {
    res.status(400).json({
      status: "Failed",
    });
  }
};

exports.payment = async (req, res) => {
  const { amount, email } = req.body;
  console.log(amount, email);

  const instance = new Razorpay({
    key_id: process.env.live_r_key_id,
    key_secret: process.env.live_r_key_secret,
  });

  const transcation = await Transcation.find({
    status: "success",
  });

  const refer = await Referal.findOne({
    referedEmail: email.toLowerCase(),
    used: false,
  });
  let options;

  if (refer) {
    let refered =
      Math.floor(
        (new Date().getTime() -
          new Date(
            `${refer.referedon.split(" ")[2]}-${
              refer.referedon.split(" ")[1]
            }-${refer.referedon.split(" ")[0]}`
          ).getTime()) /
          (1000 * 60 * 60 * 24)
      ) <= 3;
    if (refered) {
      options = {
        amount: 4999 * 100,
        currency: "INR",
        receipt: "order_rcptid_11",
      };
    } else {
      options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "order_rcptid_11",
      };
    }
  } else {
    options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    };
  }

  // if (transcation.length < 26) {
  //   options = {
  //     amount: 4999 * 100, // amount in the smallest currency unit
  //     currency: "INR",
  //     receipt: "order_rcptid_11",
  //   };
  // } else {
  //   options = {
  //     amount: amount * 100, // amount in the smallest currency unit
  //     currency: "INR",
  //     receipt: "order_rcptid_11",
  //   };
  // }

  instance.orders.create(options, function (err, order) {
    if (order) {
      res.status(200).json({
        status: "success",
        data: order,
      });
    } else {
      res.status(400).json({
        status: "Failed",
      });
    }
  });
};

exports.waitinglist = async (req, res) => {
  const { name, email, phone } = req.body;
  const request = await Waitinglist.create({
    Name: name,
    Email: email,
    phone: phone,
  });
  res.status(200).json({
    status: "success",
  });
};

const dispatchdates = (f, array) => {
  for (let j = 0; j < f.length; j++) {
    if (f[j].time.length) {
      array.push(f[j]);
    } else {
      continue;
    }
  }
  return array;
};
exports.getmentors = async (req, res) => {
  const { user_id } = req.body;

  const get = await RoomModel.findOne({
    user: user_id,
    status: "success",
  });

  if (get) {
    if (get.course_index > 1) {
      const request = await Recuirtment.findOne({
        _id: get.recuiter,
      });
      let d = new Date();
      let m = d.getMonth();
      let date = d.getDate();
      let array = [];

      let f = request.busydate.filter(
        (state) =>
          state.date.split(" ")[1] >= m + 1 && state.date.split(" ")[0] >= date
      );
      dispatchdates(f, array);

      res.status(200).json({
        status: "success",
        meeting: array,
      });
    } else {
      const request = await Recuirtment.find();
      let d = new Date();
      let m = d.getMonth();
      let date = d.getDate();
      let array = [];
      for (let i = 0; i < request.length; i++) {
        let f = request[i].busydate.filter(
          (state) =>
            state.date.split(" ")[1] >= m + 1 &&
            state.date.split(" ")[0] >= date
        );

        dispatchdates(f, array);
      }
      res.status(200).json({
        status: "success",
        meeting: array,
      });
    }
  } else {
    res.status(400).json({
      status: "failed",
    });
  }
};

const gtime = (item) => {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const nd = new Date(utc + 3600000 * 5.5);
  const hour = nd.getHours();
  const miu = nd.getMinutes();

  function gettime() {
    if (hour > 12) {
      return { time: hour - 12, zone: "PM" };
    } else {
      return {
        time: hour,
        zone: "AM",
      };
    }
  }

  let time = gettime();
  const filter = item.filter(
    (state) =>
      state.split(" ")[1] == time.zone &&
      state.split(" ")[0].split(":")[0] >= time.time
  );
  if (filter.length) {
    const index = item.indexOf(filter[0]);
    item.splice(index, 1);
    return filter[0];
  } else {
    return false;
  }
};
const searching = async (
  d,
  dnow,
  mnow,
  ynow,
  recuiter,
  user_id,
  course,
  price,
  username,
  email,
  date,
  index
) => {
  if (index < recuiter.length) {
    if (recuiter[index].pendingfeedback) {
      return searching(
        d,
        dnow,
        mnow,
        ynow,
        recuiter,
        user_id,
        course,
        price,
        username,
        email,
        date,
        index + 1
      );
    } else {
      if (recuiter[index].busydate.length) {
        const filter = recuiter[index].busydate.filter(
          (state) => state.date == `${dnow} ${mnow + 1} ${ynow}`
        );
        if (filter.length) {
          const time = gtime(recuiter[index].busydate[filter[0].index].time);
          if (!time) {
            return searching(
              d,
              dnow,
              mnow,
              ynow,
              recuiter,
              user_id,
              course,
              price,
              username,
              email,
              date,
              index + 1
            );
          } else {
            // const shift = recuiter[index].busydate[filter[0].index].time.shift();
            await recuiter[index].save();
            return {
              time: time,
              date: `${dnow} ${mnow + 1} ${ynow}`,
              recuiter: recuiter[index],
            };
          }
        } else {
          return searching(
            d,
            dnow,
            mnow,
            ynow,
            recuiter,
            user_id,
            course,
            price,
            username,
            email,
            date,
            index + 1
          );
        }
      } else {
        return searching(
          d,
          dnow,
          mnow,
          ynow,
          recuiter,
          user_id,
          course,
          price,
          username,
          email,
          date,
          index + 1
        );
      }
    }
  } else {
    return false;
  }
};

function randomString(size = 8) {
  return Crypto.createHash("sha256").digest("hex").slice(0, size);
}

const randomstringge = async () => {
  const rstring = await randomString();
  if (rstring) {
    const s = await RoomModel.findOne({
      roomid: rstring,
    });
    if (s) {
      return randomstringge();
    } else {
      return rstring;
    }
  } else {
    randomstringge();
  }
};
const rstring = (size = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < size; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const rstringe = async () => {
  const sng = await rstring();
  if (sng) {
    const s = await RoomModel.findOne({
      roomid: sng,
    });
    if (s) {
      return rstring();
    } else {
      return sng;
    }
  } else {
    rstring();
  }
};

const Creatingroom = async (
  slot,
  user_id,
  username,
  email,
  course,
  price,
  status,
  res
) => {
  let cat = ["Technical", "Technical", "Technical", "HR", "HR"];
  const string = await rstringe();
  const requesteddata = await RoomModel.create({
    user: user_id,
    recuiter: slot.recuiter._id,
    recuiter_name: slot.recuiter.Name,
    user_name: username,
    recuiter_photo: slot.recuiter.photo,
    roomid: string,
    course_index: 0,
    Course_cat: cat[0],
    time: slot.time,
    date: slot.date,
    course: course,
    price: price,
    status: status,
  });
  const url = `https://skillkart.app/room/${requesteddata.roomid}`;
  // await new RoomEmail(username, email, slot.time, slot.date, url).send();
  // await new RoomEmail(
  //   slot.recuiter.Name,
  //   slot.recuiter.Email,
  //   slot.time,
  //   slot.date,
  //   url
  // ).send();
  res.status(200).json({
    status: "success",
    data: requesteddata,
  });
};

// exports.bookaslot = async (req, res) => {
//   let index = 0;
//   const recuiter = await Recuirtment.find();
//   const { user_id, course, price, username, email, date, status } = req.body;

//   const d = new Date();
//   let dnow = d.getDate();
//   let mnow = d.getMonth();
//   let ynow = d.getFullYear();

//   const slot = await searching(
//     d,
//     dnow,
//     mnow,
//     ynow,
//     recuiter,
//     user_id,
//     course,
//     price,
//     username,
//     email,
//     date,
//     index
//   );
//   if (slot) {
//     await Creatingroom(
//       slot,
//       user_id,
//       username,
//       email,
//       course,
//       price,
//       status,
//       res
//     );
//   } else {
//     res.status(400).json({
//       status: "Failed",
//       message: "No slot available",
//     });
//   }
// };

exports.demo = async (req, res) => {
  const cr = await bcrypt.hash("itsadminnotuser", 10);
};

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  const s = await Subscribe.findOne({
    email: email,
  });
  if (s) {
    res.status(401).json({
      status: "Failed",
      message: "Already subscribed",
    });
  } else {
    const sc = await Subscribe.create({
      email: email,
    });

    res.status(200).json({
      status: "success",
      message: "Thank for your subscription",
    });
  }
};

exports.transfail = async (req, res) => {
  const { user_id, course, price, username, r_id, email, date, status } =
    req.body;

  const requesteddata = await Transcation.create({
    user: user_id,
    user_name: username,
    course: course,
    price: price,
    status: status,
    razarpay_order_id: r_id,
  });
  res.status(400).json({
    status: "failed",
    message: "Transcation failed",
  });
};

exports.purchase = async (req, res) => {
  const { user_id, course, price, username, email, date, status } = req.body;
  let cat = ["Technical", "Technical", "Technical", "HR", "HR"];

  const refer = await Referal.findOne({
    referedEmail: email,
  });
  if (status == "Failed") {
    const requesteddata = await RoomModel.create({
      user: user_id,
      user_name: username,
      course: course,
      price: price,
      status: status,
    });
    res.status(400).json({
      status: "failed",
      message: "Transcation failed",
    });
  }
  if (status == "success") {
    const requesteddata = await RoomModel.create({
      user: user_id,
      user_name: username,
      course: course,
      course_index: 1,
      Course_cat: "Technical",
      price: price,
      status: status,
      roomid: "",
      time: "",
      date: "",
    });
    // console.log(refer);
    if (refer) {
      refer.used = true;
    } else {
      refer.used = false;
    }
    await refer.save();
    res.status(200).json({
      status: "Success",
      message: "successful",
    });
  }
};

const getindex = (t, time) => {
  const i = t.indexOf(time);
  t.splice(i, 1);
  return true;
};

const searchingslot = async (date, time, recuiter, index) => {
  if (index < recuiter.length) {
    const filter = recuiter[index].busydate.filter(
      (state) => state.date == date
    );
    if (filter.length) {
      const i = filter[0].time.includes(time);
      if (i) {
        const timef = getindex(
          recuiter[index].busydate[filter[0].index].time,
          time
        );
        await recuiter[index].save();
        return {
          time: time,
          date: date,
          recuiter: recuiter[index],
        };
      } else {
        return searchingslot(date, time, recuiter, index + 1);
      }
    } else {
      return searchingslot(date, time, recuiter, index + 1);
    }
  } else {
    return false;
  }
};
exports.bookaslot = async (req, res) => {
  let index = 0;
  const { time, user_id, date, email } = req.body;

  const recuiter = await Recuirtment.find();
  const slot = await searchingslot(date, time, recuiter, index);
  if (slot) {
    const string = await rstringe();
    const request = await RoomModel.findOne({
      user: user_id,
      status: "success",
    });
    request.time = slot.time;
    request.date = slot.date;
    request.recuiter = slot.recuiter._id;
    request.recuiter_name = slot.recuiter.Name;
    request.roomid = string;

    await request.save();
    const url = `https://skillkart.app/room/${string}`;

    await new RoomEmail(
      url,
      request.user_name,
      email,
      slot.time,
      slot.date
    ).send();
    await new RoomEmail(
      url,
      slot.recuiter.Name,
      slot.recuiter.Email,
      slot.time,
      slot.date
    ).send();
    res.status(200).json({
      status: "success",
      data: request,
    });
  } else {
    res.status(400).json({
      message: "something went wrong",
    });
  }
};

const refercode = async () => {
  const sng = await rstring();
  if (sng) {
    const s = await Referal.findOne({
      refercode: sng,
    });
    if (s) {
      return rstring();
    } else {
      return sng;
    }
  } else {
    return rstring();
  }
};
exports.refer = async (req, res) => {
  const { name, email, referedby, referid, phone, referername } = req.body;
  const exist = await Referal.findOne({
    referedEmail: email,
  });
  if (!exist) {
    const rcode = await refercode();
    let d = new Date();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    const request = await Referal.create({
      refererid: referid,
      referedEmail: email,
      refererusername: referername,
      referedusername: name,
      referedbyEmail: referedby,
      refererphonenumber: phone,
      refercode: rcode,
      referedon: `${date} ${month} ${year}`,
    });
    const url = `https://skillkart.app/refer?id=${rcode}`;
    await new Email("", name, email, "", "", referername, url).referalprogram();
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(400).json({
      status: "failed",
      message: "already refered",
    });
  }
};

exports.referals = async (req, res) => {
  const { email } = req.body;
  const request = await Referal.find({
    referedbyEmail: email,
  });
  // console.log(email);
  res.status(200).json({
    status: "success",
    data: request,
  });
};

exports.mentor = async (req, res) => {
  const mentor = await Recuirtment.find({
    pendingfeedback: false,
  });
  let date = new Date();

  let month = date.getMonth();
  let day = date.getDate();
  let array = [];
  for (let m of mentor) {
    const f = m.busydate.filter(
      (state) =>
        state.date.split(" ")[0] >= day &&
        state.date.split(" ")[1] >= month + 1 &&
        state.time.length > 0
    );
    if (f.length) {
      array.push(m);
    } else {
      continue;
    }
  }
  // console.log(array);
  res.status(200).json({
    status: "success",
    data: array,
  });
};

exports.submitdate = async (req, res) => {
  const {
    recuiterid,
    userid,
    username,
    date,
    time,
    recuiter_name,
    round,
    user_email,
    recuiter_email,
    transid,
  } = req.body;
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let tago = 1832454;
  // console.log(recuiterid, userid, username, date, time, recuiter_name, round);
  const re = await Recuirtment.findOne({
    _id: recuiterid,
  });
  if (re) {
    const filter = re.busydate.filter((state) => state.date == date);
    if (filter.length) {
      const i = filter[0].time.includes(time);
      if (i) {
        const timef = getindex(re.busydate[filter[0].index].time, time);
        await re.save();
        const string = await rstringe();
        const roomcreation = await RoomModel.create({
          user: userid,
          recuiter: recuiterid,
          user_name: username,
          recuiter_name: recuiter_name,
          round: round,
          transcationid: transid,
          time: time,
          date: date,
          roomid: string,
        });
        const url = `https://skillkart.app/room/${string}`;

        await new RoomEmail(url, username, user_email, time, date).send();
        await new RoomEmail(
          url,
          recuiter_name,
          recuiter_email,
          time,
          date
        ).send();

        if (time.split(" ")[1] == "AM") {
          let dates = `${months[parseInt(date.split(" ")[1]) - 1]} ${
            date.split(" ")[0]
          } , ${date.split(" ")[2]} ${time.split(" ")[0].split(":")[0]}:${
            time.split(" ")[0].split(":")[1]
          }:00`;
          const a = new Date().getTime();
          const d = new Date(dates);
          let ans = d - a;

          if (ans - tago > 0) {
            setTimeout(async () => {
              await new RoomEmail(url, username, user_email, time, date).send();
              await new RoomEmail(
                url,
                recuiter_name,
                recuiter_email,
                time,
                date
              ).send();
            }, ans - tago);
          }
        }
        if (time.split(" ")[1] == "PM") {
          let dates = `${months[parseInt(date.split(" ")[1]) - 1]} ${
            date.split(" ")[0]
          } , ${date.split(" ")[2]} ${
            parseInt(time.split(" ")[0].split(":")[0]) + 12
          }:${time.split(" ")[0].split(":")[1]}:00`;
          const d = new Date(dates);
          const a = new Date().getTime();
          let ans = d - a;
          if (ans - tago > 0) {
            setTimeout(async () => {
              await new RoomEmail(url, username, user_email, time, date).send();
              await new RoomEmail(
                url,
                recuiter_name,
                recuiter_email,
                time,
                date
              ).send();
            }, ans - tago);
          }
          // console.log(new Date().getTime() - tago);
        }

        res.status(200).json({
          status: "success",
          data: roomcreation,
        });
      } else {
        console.log("time already taken");
      }
    }
  }
};

exports.transcation = async (req, res) => {
  const {
    user_id,
    username,
    r_p_id,
    course_id,
    course,
    status,
    email,
    price,
    r_id,
    Purchasedate,
  } = req.body;

  const request = await Transcation.create({
    user: user_id,
    user_name: username,
    course: course,
    price,
    course_id: course_id,
    status,
    razarpay_order_id: r_id,
    razarpay_payment_id: r_p_id,
    Purchasedate,
  });
  const refer = await Referal.findOne({
    referedEmail: email,
    used: false,
  });
  if (refer) {
    refer.used = true;
    await refer.save();
    await new Email("", username, email, "", request._id).purchase();
    res.status(200).json({
      status: "success",
      request,
    });
  } else {
    await new Email("", username, email, "", request._id).purchase();
    res.status(200).json({
      status: "success",
      request,
    });
  }
};

exports.usertranscation = async (req, res) => {
  const { user_id } = req.body;
  const request = await Transcation.find({
    user: user_id,
  });

  res.status(200).json({
    status: "success",
    data: request,
  });
};

exports.selectmentor = async (req, res) => {
  let date = new Date();

  let month = date.getMonth();
  let day = date.getDate();
  const { recuit } = req.body;
  console.log(recuit);
  const f = await Recuirtment.findOne({
    _id: recuit,
  });
  if (f) {
    const fil = f.busydate.filter(
      (state) =>
        state.date.split(" ")[0] >= day &&
        state.date.split(" ")[1] >= month + 1 &&
        state.time.length > 0
    );

    if (fil.length) {
      res.status(200).json({
        status: "success",
        mentor: f,
        data: fil,
        slotfind: true,
      });
    } else {
      res.status(200).json({
        status: "success",
        mentor: f,
        data: fil,
        slotfind: false,
      });
    }
  } else {
    res.status(400).json({
      status: "Fail",
    });
  }
};

exports.handlefeedback = async (req, res) => {
  const { roomid } = req.body;
  const request = await Feedback.findOne({
    roomid,
  });
  res.status(200).json({
    status: "sucess",
    data: request,
  });
};

exports.avargefeedback = async (req, res) => {
  const { userid } = req.body;
  // console.log(userid);
  const request = await Feedback.find({
    userid,
  });
  // console.log(request);
  if (request.length) {
    sum = 0;
    for (let c of request) {
      s = 0;
      for (let a of c) {
        console.log(c[a], a);
      }
    }
  } else {
    return;
  }
};

exports.handleresume = async (req, res) => {
  const { userid, round, username, transid } = req.body;
  const DIR = "../public/resume/";
  const r = await RoomModel.create({
    user: userid,
    compeleted: true,
    user_name: username,
    round: round,
    transcationid: transid,
    resume: `${userid}`,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.getresume = async (req, res) => {
  const { userid, transid } = req.body;
  console.log(userid, transid);
  const r = await RoomModel.findOne({
    user: userid,
    transcationid: transid,
    round: "Introduction",
  });
  if (r) {
    res.status(200).json({
      status: "success",
      data: r,
    });
  } else {
    res.status(400).json({
      status: "Failed",
    });
  }
};

const paswordrstring = (size) => {
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < size; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const passwordresettoken = async () => {
  const string = await paswordrstring(20);

  let usersearch = await User.find({
    passwordResetToken: string,
  });
  let recsearch = await Recuirtment.find({
    passwordResetToken: string,
  });
  console.log(string);
  console.log(usersearch, recsearch);
  if (!usersearch.length && !recsearch.length) {
    return string;
  } else {
    return passwordresettoken();
  }
};

exports.emailverification = async (req, res) => {
  const { email } = req.body;
  const rec = await Recuirtment.findOne({
    Email: email,
  });

  if (rec) {
    const verifytoken = await passwordresettoken();
    console.log(verifytoken);
    rec.passwordResetToken = verifytoken;
    await new Email(verifytoken, rec.Name, email).send();
    await rec.save();
    setTimeout(async () => {
      rec.passwordResetToken = "";
      await rec.save();
    }, 1000 * 600);
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(401).json({
      status: "Failed",
      messsage: "Didnt find any Accound associate with this Email.",
    });
  }
};

exports.emailverified = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  const user = await User.findOne({
    passwordResetToken: id,
  });
  const rec = await Recuirtment.findOne({
    passwordResetToken: id,
  });
  if (user || rec) {
    if (user) {
      user.Emailverified = true;
      user.passwordResetToken = "";
      await user.save();
      res.status(200).json({
        status: "success",
      });
    }
    if (res) {
      rec.Emailverified = true;
      rec.passwordResetToken = "";
      await rec.save();
      res.status(200).json({
        status: "success",
      });
    }
  } else {
    res.status(400).json({
      status: "Fail",
    });
  }
};
exports.uemail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    Email: email,
  });

  if (user) {
    const verifytoken = await passwordresettoken();
    console.log(verifytoken);
    user.passwordResetToken = verifytoken;
    await new Email(verifytoken, user.Name, email).passwordreset();
    await user.save();
    setTimeout(async () => {
      user.passwordResetToken = "";
      await user.save();
    }, 1000 * 600);
    res.status(200).json({
      status: "success",
    });
  } else {
    const rec = await Recuirtment.findOne({
      Email: email,
    });

    if (rec) {
      const verifytoken = await passwordresettoken();
      console.log(verifytoken);
      rec.passwordResetToken = verifytoken;
      await new Email(verifytoken, rec.Name, email).passwordreset();
      await rec.save();
      setTimeout(async () => {
        rec.passwordResetToken = "";
        await rec.save();
      }, 1000 * 600);
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(401).json({
        status: "Failed",
        messsage: "Didnt find any Accound associate with this Email.",
      });
    }
  }
};

exports.pverify = async (req, res) => {
  const { email, password, code } = req.body;
  const user = await User.findOne({
    Email: email,
  });
  if (user) {
    if (user.passwordResetToken == code) {
      const ecrpt = await bcrypt.hash(password, 15);
      user.password = ecrpt;
      user.passwordResetToken = "";
      await user.save();
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "Failed",
        messsage: "Incorrect Code",
      });
    }
  } else {
    const rec = await Recuirtment.findOne({
      Email: email,
    });
    if (rec) {
      if (rec.passwordResetToken == code) {
        const ecrpt = await bcrypt.hash(password, 15);
        rec.Password = ecrpt;
        rec.passwordResetToken = "";
        await rec.save();
        res.status(200).json({
          status: "success",
        });
      } else {
        res.status(400).json({
          status: "Failed",
          messsage: "Incorrect Code",
        });
      }
    } else {
      res.status(401).json({
        status: "Failed",
        messsage: "Didnt find any Accound associate with this Email.",
      });
    }
  }
};

exports.getfeedbacks = async (req, res) => {
  const { user } = req.body;
  const request = await Feedback.find({
    userid: user,
  });
  res.status(200).json({
    status: "success",
    data: request,
  });
};

exports.getrevenue = async (req, res) => {
  const { user } = req.body;
  const request = await RoomModel.find({
    recuiter: user,
  });
  const feedback = await Feedback.find({
    userid: user,
  });
  let i = 0;
  for (let c of request) {
    const filter = feedback.filter((state) => state.roomid == c.roomid);
    if (filter.length) {
      i++;
    } else {
      continue;
    }
  }
  res.status(200).json({
    status: "success",
    data: i * 500,
  });
};

exports.isfeedback = async (req, res) => {
  const { roomid } = req.body;

  const request = await Feedback.findOne({
    roomid,
  });
  if (request) {
    res.status(200).json({
      status: "success",
      data: true,
    });
  } else {
    res.status(400).json({
      status: "success",
      data: false,
    });
  }
};

exports.isuserhasresume = async (req, res) => {
  const { userid } = req.body;

  const resume = await RoomModel.find({
    user: userid,
    round: "Introduction",
  }).sort({
    createdAt: -1,
  });

  const userdetail = await User.findOne({
    _id: userid,
  });
  res.status(200).json({
    status: "success",
    resume,
    data: userdetail,
  });
};

exports.changeprofilepic = async (req, res) => {
  const { userid, image } = req.body;
  console.log(userid, image);
  const urequest = await User.findOne({
    _id: userid,
  });
  if (urequest) {
    urequest.photo = `${image}`;
    await urequest.save();
    res.status(200).json({
      status: "success",
    });
  } else {
    const rrequst = await Recuirtment.findOne({ _id: userid });
    if (rrequst) {
      rrequst.photo = `${image}`;
      await rrequst.save();
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "success",
      });
    }
  }
};

exports.removeprofilepic = async (req, res) => {
  const { userid } = req.body;
  const urequest = await User.findOne({
    _id: userid,
  });

  if (urequest) {
    urequest.photo = "";
    await urequest.save();
    res.status(200).json({
      status: "success",
    });
  } else {
    const rrequst = await Recuirtment.findOne({ _id: userid });
    if (rrequst) {
      rrequst.photo = "";
      await rrequst.save();
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "success",
      });
    }
  }
};

exports.deactive = async (req, res) => {
  const { userid } = req.body;

  const request = await Recuirtment.findByIdAndDelete({
    _id: userid,
  });

  res.status(200).json({
    status: "sucess",
  });
};

exports.change = async (req, res) => {
  const { changeable, content, userid } = req.body;

  console.log(changeable);
  const user = await User.findOne({
    _id: userid,
  });
  if (user) {
    res.status(200).json({
      sttaus: "success",
    });
  } else {
    const request = await Recuirtment.findOne({
      _id: userid,
    });
    // request.Name=name,
    // request.Email =email,
    // request.bio=bio,
    // request.phone=phone,
    // request.Linkendin =linkedin,
    // request.workat = workat
    if (request) {
      if (changeable == "Name") {
        request.Name = content;
        await request.save();
        res.status(200).json({
          status: "success",
        });
      }
      if (changeable == "workat") {
        request.workat = content;
        await request.save();
        res.status(200).json({
          status: "success",
        });
      }
      if (changeable == "currentrole") {
        request.currentrole = content;
        await request.save();
        res.status(200).json({
          status: "success",
        });
      }
      if (changeable == "AOE") {
        request.AOE = content;
        await request.save();
        res.status(200).json({
          status: "success",
        });
      }
      if (changeable == "AOE") {
        request.AOE = content;
        await request.save();
        res.status(200).json({
          status: "success",
        });
      }
      if (changeable == "Linkendin") {
        request.Linkendin = content;
        await request.save();
        res.status(200).json({
          status: "success",
        });
      }
      if (changeable == "bio") {
        request.bio = content;
        await request.save();
        res.status(200).json({
          status: "success",
        });
      }
    }
  }
};

exports.getreferer = async (req, res) => {
  const { id } = req.query;
  // console.log(id);
  const user = await Referal.findOne({
    refercode: id,
  });
  if (user) {
    res.status(200).json({
      status: "success",
      data: user,
    });
  } else {
    res.status(400).json({
      status: "Failed",
    });
  }
};

exports.addrefer = async (req, res) => {
  const { name, email, phone, password, refererid, referername, refereremail } =
    req.body;

  const r = await Referal.findOne({
    referedEmail: email,
  });
  const user = await User.findOne({
    Email: email,
  });

  if (!user) {
    if (r) {
      r.used = true;
      const ecrpt = await bcrypt.hash(password, 15);
      const verifytoken = getRandomArbitrary(100000, 999999);
      const newUser = await User.create({
        Name: name,
        Email: email,
        password: ecrpt,
        phone: phone,
        passwordResetToken: verifytoken,
      });

      createtoken(newUser, 201, res, req);
      await new Email("", name, email, "", "", referername).referalprogram();
      // await new Email(verifytoken, username, email, "VerifyEmail").send();
      await new Email(verifytoken, name, email, "VerifyEmail").welcomesend();
      await r.save();
      setTimeout(() => {
        newUser.passwordResetToken = "";
        newUser.save();
      }, 1000 * 300);
    } else {
      const ecrpt = await bcrypt.hash(password, 15);
      const verifytoken = getRandomArbitrary(100000, 999999);
      const newUser = await User.create({
        Name: name,
        Email: email,
        password: ecrpt,
        phone: phone,
        passwordResetToken: verifytoken,
      });

      createtoken(newUser, 201, res, req);
      await new Email("", name, email, "", "", referername).referalprogram();
      // await new Email(verifytoken, username, email, "VerifyEmail").send();
      await new Email(verifytoken, name, email, "VerifyEmail").welcomesend();
      await r.save();
      setTimeout(() => {
        newUser.passwordResetToken = "";
        newUser.save();
      }, 1000 * 300);
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: "Already Have an account.",
    });
  }
};

exports.addloginrefer = async (req, res, next) => {
  const { name, email, phone, password, refererid, referername, refereremail } =
    req.body;
  const user = await User.findOne({
    Email: email,
  });
  const rec = await Recuirtment.findOne({
    Email: email,
  });
  if (!user && !rec) {
    return next(
      new AppError("Didn't find associate with this EmailId.", 401, res)
    );
  }
  if (rec) {
    const dcrpt = await bcrypt.compare(password, rec.Password);
    if (!dcrpt) {
      return next(new AppError("Incorrect Email or password.", 401, res));
    } else {
      createtoken(rec, 201, res, req, true);
    }
  } else {
    const dcrpt = await bcrypt.compare(password, user.password);
    if (!dcrpt) {
      return next(new AppError("Incorrect Email or password.", 401, res));
    } else {
      const refer = await Referal.findOne({
        referedEmail: email.toLowerCase(),
        used: true,
      });
      if (refer) {
        new AppError("Already refered.", 401, res);
      } else {
        const r = await Referal.findOne({
          referedEmail: email.toLowerCase(),
        });
        if (r) {
          const trans = await Transcation.find({
            user: user._id,
            status: "success",
          });
          const transfilter = trans.filter(
            (state) =>
              Math.floor(
                (new Date().getTime() - new Date(state.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) < 60
          );
          if (transfilter.length) {
            if (!dcrpt) {
              return next(new AppError("Incorrect password.", 401, res));
            } else {
              createtoken(user, 201, res, req, true);
            }
          } else {
            createtoken(user, 201, res, req, false);
          }
        } else {
          const trans = await Transcation.find({
            user: user._id,
            status: "success",
          });
          const transfilter = trans.filter(
            (state) =>
              Math.floor(
                (new Date().getTime() - new Date(state.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) < 60
          );
          if (transfilter.length) {
            if (!dcrpt) {
              return next(new AppError("Incorrect password.", 401, res));
            } else {
              createtoken(user, 201, res, req, true);
            }
          } else {
            createtoken(user, 201, res, req, false);
          }
        }
      }
    }
  }
};

exports.emailtest = async (req, res) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const { date, time } = req.body;
  let tago = 1832454;
  if (time.split(" ")[1] == "AM") {
    let dates = `${months[parseInt(date.split(" ")[1]) - 1]} ${
      date.split(" ")[0]
    } , ${date.split(" ")[2]} ${time.split(" ")[0].split(":")[0]}:${
      time.split(" ")[0].split(":")[1]
    }:00`;
    const a = new Date().getTime();
    const d = new Date(dates);
    let ans = d - a;

    if (ans - tago > 0) {
      setTimeout(async () => {
        console.log("yeah");
        await new Email(
          "",
          "jagdeep",
          "jagdeepsnh57@gmail.com",
          "",
          "",
          "me"
        ).referalprogram();
      }, ans - tago);
    } else {
      setTimeout(async () => {
        await new Email(
          "",
          "jagdeep",
          "jagdeepsnh57@gmail.com",
          "",
          "",
          "me"
        ).referalprogram();
      }, ans - tago);
    }
  }
  if (time.split(" ")[1] == "PM") {
    let dates = `${months[parseInt(date.split(" ")[1]) - 1]} ${
      date.split(" ")[0]
    } , ${date.split(" ")[2]} ${
      parseInt(time.split(" ")[0].split(":")[0]) + 12
    }:${time.split(" ")[0].split(":")[1]}:00`;
    const d = new Date(dates);
    const a = new Date().getTime();
    let ans = d - a;
    console.log(ans - tago, tago, ans);
    console.log(d);
    if (ans - tago > 0) {
      setTimeout(async () => {
        console.log("yeah");
        await new Email(
          "",
          "jagdeep",
          "jagdeepsnh57@gmail.com",
          "",
          "",
          "me"
        ).referalprogram();
      }, ans - tago);
    } else {
      setTimeout(async () => {
        await new Email(
          "",
          "jagdeep",
          "jagdeepsnh57@gmail.com",
          "",
          "",
          "me"
        ).referalprogram();
      }, ans - tago);
    }
    // console.log(new Date().getTime() - tago);
  }
};

exports.mentoraccountcr = async (req, res) => {
  const { step } = req.query;
  const {
    name,
    email,
    phone,
    password,
    bio,
    linkedin,
    sAREA,
    specialization,
    qualification,
    gender,
    workat,
    currentrole,
    experience,
    mentorshiptype,
    joboffer,
    avatime,
    photo,
  } = req.body;

  const student = await User.findOne({
    Email: email,
  });
  if (student) {
    res.status(400).json({
      status: "Failed",
      message: "Already have an account as Student.",
    });
  } else {
    const user = await Recuirtment.findOne({ Email: email });
    if (user) {
      if (parseInt(step) === 2) {
        user.Gender = gender;
        user.photo = photo;
        user.bio = bio;
        user.Linkendin = linkedin;
        user.step = step;
        await user.save();
        res.status(200).json({
          status: "success",
          message: "Updated",
        });
      }
      if (parseInt(step) === 3) {
        user.AOE = sAREA;
        user.qualification = qualification;
        user.specilization = specialization;
        user.step = step;
        await user.save();
        res.status(200).json({
          status: "success",
        });
      }
      if (parseInt(step) === 4) {
        user.Experience = experience;
        user.workat = workat;
        user.currentrole = currentrole;
        user.step = step;
        await user.save();
        res.status(200).json({
          status: "success",
        });
      }
      if (parseInt(step) === 5) {
        user.mentortype = mentorshiptype;
        user.NERE = joboffer;
        user.Rsparetime = avatime;
        user.compeleted = true;
        user.step = step;

        await user.save();

        // await new Email("", user.Name, user.Email).welcomementor();

        setTimeout(async () => {
          await new Email("", user.Name, user.Email).welcome();
        }, 1000 * 15 * 60);

        res.status(200).json({
          status: "success",
        });
      }
    } else {
      const ecrpt = await bcrypt.hash(password, 15);
      const request = await Recuirtment.create({
        Name: name,
        Email: email,
        phone: phone,
        Password: ecrpt,
        photo: photo,
        step,
      });
      await new Email("", name, email).welcomementor();
      await new Email("", "", "").newmentorasyn();
      createtoken(request, 201, res, req);
    }
  }
};

exports.getmformdetail = async (req, res) => {
  const { token } = req.query;
  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.tokn_crypt);
      const currentUser = await Recuirtment.findById(decoded.data);
      if (currentUser) {
        const meeting = await RoomModel.find({
          recuiter: currentUser._id,
        });
        res.status(200).json({
          status: "success",
          data: currentUser,
          meeting: meeting,
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "user not found",
        });
      }
    } catch {
      res.status(400).json({
        status: "Fail",
        message: "Token expire",
      });
    }
  }
};

exports.changeuserprofile = async (req, res) => {
  const { name, phone, usermail } = req.body;

  const rec = await Recuirtment.findOne({ Email: usermail });

  if (rec) {
    res.status(400).json({
      status: "Fail",
      message: "Email already registered.",
    });
  } else {
    const user = await User.findOne({
      Email: usermail,
    });
    if (user) {
      user.Name = name;
      user.phone = phone;
      await user.save();
      res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        message: "User not Found",
      });
    }
  }
};

exports.changeuserpassword = async (req, res) => {
  const { email, currentpass, newpass } = req.body;

  const user = await User.findOne({
    Email: email,
  });
  if (user) {
    const dcrpt = await bcrypt.compare(currentpass, user.password);
    if (dcrpt) {
      const ecrpt = await bcrypt.hash(currentpass, 10);
      user.password = ecrpt;
      await user.save();
      res.status(200).json({
        status: "success",
        message: "Password changes successfully",
      });
    } else {
      res.status(400).json({
        status: "Fail",
        message: "Wrong password",
      });
    }
  } else {
    res.status(401).json({
      status: "Fail",
      message: "Wrong user",
    });
  }
};

exports.deleteslots = async (req, res) => {
  const { userid, date, time } = req.body;
  console.log(userid, date, time);
  const re = await Recuirtment.findById(userid);
  const filter = re.busydate.filter((state) => state.date == date);
  if (filter.length) {
    const i = filter[0].time.includes(time);
    if (i) {
      const timef = getindex(re.busydate[filter[0].index].time, time);
      console.log(timef);
      await re.save();
      res.status(200).json({
        status: "success",
        data: re,
      });
    }
  }
};

exports.getpendingfeedback = async (req, res) => {
  const { userid } = req.body;
  console.log(userid);
  const room = await PendingModel.find({
    recuiter: userid,
  });

  let arr = [];
  if (room) {
    for (let user of room) {
      const request = await User.findOne({
        _id: user.userid,
      });
      arr.push({
        room: user,
        user: {
          name: request.Name,
          photo: request.photo,
          email: request.Email,
        },
      });
    }
    res.status(200).json({
      status: "success",
      data: arr,
    });
  } else {
    res.status(400).json({
      status: "Fail",
      message: "Feedbacks not found",
    });
  }
};

exports.roomvideo = async (req, res) => {
  const { userid, recuiter, roomid, video } = req.body;

  // console.log(userid, recuiter, roomid, video);
  await RoomVideos.create({
    user: userid,
    recuiter: recuiter,
    roomid,
    video,
  }).then(() => {
    res.status(200).json({
      status: "sucess",
    });
  });
};

exports.getroomvideo = async (req, res) => {
  // const { userid, recuiter, roomid, video } = req.body;

  const video = await RoomVideos.find();
  res.status(200).json({
    status: "success",
    data: video,
  });
};

exports.callrequest = async (req, res) => {
  const { phonenumber } = req.body;
  await Callrequest.create({
    phonenumber: phonenumber,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.profilechangepassword = async (req, res) => {
  const { role, email, password } = req.body;
  console.log(role, email, password);

  const user = await User.findOne({
    Email: email,
  });
  console.log(user);
  if (user) {
    const ecrpyt = await bcrypt.hash(password, 15);
    user.password = ecrpyt;
    await user.save();
    res.status(200).json({
      status: "success",
    });
  } else {
    const rec = await Recuirtment.findOne({
      Email: email,
    });
    console.log(rec);
    const ecrpyt = await bcrypt.hash(password, 15);
    console.log(ecrpyt);
    rec.Password = ecrpyt;
    await rec.save();
    res.status(200).json({
      status: "success",
    });
  }
};
