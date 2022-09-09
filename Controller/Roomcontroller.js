const Email = require("../Other/Emailhandler");

exports.mailer=async(req, res)=>{
    const { username , verifytoken , email}= req.body
    await new Email(verifytoken, username, email).send();
}