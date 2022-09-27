const RoomModel = require("../Model/Roomcreation");
const Email = require("../Other/roomhandler");
const Recuirtment = require("../Model/recuirter");
const User = require("../Model/Usermodel");
const Crypto = require("crypto");

function randomString(size = 8) {
  return Crypto.createHash("sha256").digest("hex").slice(0, size);
}

const randomstringge = async () => {
  const rstring = await randomString();
  const s = await RoomModel.findOne({
    roomid: rstring,
  });
  if (s) {
    randomstringge();
  } else {
    if (rstring) {
      return rstring;
    } else {
      randomString();
    }
  }
};
const Creatingroom = async (
  slot,
  user_id,
  username,
  email,
  course,
  price,
  res
) => {
  let cat = ["GD", "Technical", "Technical", "HR", "HR"];
  const string = await randomstringge();
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
  });
  const url = `https://skillkart.app/room/${requesteddata.roomid}`;
  await new Email(username, email, slot.time, slot.date, url).send();
  await new Email(
    slot.recuiter.Name,
    slot.recuiter.Email,
    slot.time,
    slot.date,
    url
  ).send();
  res.status(200).json({
    status: "success",
    data: requesteddata,
  });
};

const searching = async (day, months, month, user_data, index) => {
  if (index < user_data.length) {
    let current_date = `${day} ${months[month]} 2022`;

    const find = user_data[index].busydate.filter(
      (state) => state.date === current_date
    );
    if (find.length) {
      if (find[0].time.length) {
        if (find[0].time.length == 1) {
          const shift = user_data[index].busydate[find[0].index].time.shift();
          user_data[index]?.busydate?.splice(find[0].index, 1);
          await user_data[index].save();
          return {
            time: shift,
            date: current_date,
            recuiter: user_data[index],
          };
        } else {
          const shift =
            user_data[index]?.busydate[find[0]?.index]?.time.shift();
          await user_data[index].save();
          return {
            time: shift,
            date: current_date,
            recuiter: user_data[index],
          };
        }
      } else {
        return searching(day, months, month, user_data, index + 1);
      }
    } else {
      return searching(day, months, month, user_data, index + 1);
    }
  } else {
    return false;
  }
};

exports.roomrequest = async (req, res) => {
  let index = 0;
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
  const { course, price, user_id, username, email } = req.body;
  const d = new Date();
  let day = d.getDate();
  let month = d.getMonth();
  const user_data = await Recuirtment.find();
  const slot = await searching(day, months, month, user_data, index);
  if (slot) {
    await Creatingroom(slot, user_id, username, email, course, price, res);
  } else {
    res.status(400).json({
      status: "Failed",
      message: "No slot available",
    });
  }
};

exports.meetingdata = async (req, res) => {
  const { recuit } = req.body;
  const meeting = await RoomModel.find({
    recuiter: recuit,
  });

  res.status(200).json({
    status: "success",
    data: meeting,
  });
};

exports.gettranscation = async (req, res) => {
  const { userid } = req.body;
  const transcations = await RoomModel.find({
    user: userid,
  });
  res.status(200).json({
    status: "success",
    data: transcations,
  });
};
