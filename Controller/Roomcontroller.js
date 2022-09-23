const RoomModel = require("../Model/Roomcreation");
const RoomEmail = require("../Other/roomhandler");

exports.mailer = async (req, res) => {
  const { username, url, email } = req.body;
  await new RoomEmail(username, email).send();
};

exports.getrounds = async (req, res) => {
  const { user_id , transid } = req.body;

  const request = await RoomModel.find({
    user: user_id,
    transcationid: transid,
  });
  res.status(200).json({
    status: "success",
    data: request,
  });
};
