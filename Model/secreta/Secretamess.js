const mongoose = require("mongoose");

const Secretaschema = new mongoose.Schema({
  userid: String,
  message: String,
  seen: {
    type: Boolean,
    default: false,
  },
  messageindex: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = SecretaMessage = mongoose.model(
  "SecretaMessage",
  Secretaschema
);
