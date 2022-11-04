const mongoose = require("mongoose");

const Secretaschema = new mongoose.Schema({
  userid: String,
  message: String,
});

module.exports = Secretauser = mongoose.model("SecretaUser", Secretaschema);
