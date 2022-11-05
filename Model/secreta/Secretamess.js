const mongoose = require("mongoose");

const Secretaschema = new mongoose.Schema({
  userid: String,
  message: String,
  seen: {
    type: Boolean,
    default: false,
  },
});

module.exports = SecretaMessage = mongoose.model("SecretaMessage", Secretaschema);
