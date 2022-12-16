const mongoose = require("mongoose");

const CallrequestModel = new mongoose.Schema({
  phonenumber: String,
});

module.exports.Callrequest = mongoose.model("Callrequest", CallrequestModel);
