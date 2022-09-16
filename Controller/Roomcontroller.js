const RoomEmail = require("../Other/roomhandler");

exports.mailer=async(req, res)=>{
    const { username , url, email}= req.body
    await new RoomEmail(username, email).send();
}