const mongoose = require("mongoose");

const Secretaschema = new mongoose.Schema({
  username: { type: String },
  Email: String,
  phone: String,
});

module.exports = Secretauser = mongoose.model("SecretaUser", Secretaschema);
