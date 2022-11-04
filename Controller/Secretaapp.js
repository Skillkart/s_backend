const Secretaac = require("../Model/secreta/Secretaac");

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
  console.log(username , email , phone)
  const findlength = await Secretaac.find();
  const rstring = await checkusername(username, findlength);
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
