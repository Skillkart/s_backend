const mongoose = require("mongoose");

const rpschema = new mongoose.Schema({
  userid: String,
  roomid: String,
  report: String,
  bordedRecuiter: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Raproblem = mongoose.model("Roomreport" , rpschema)

module.exports = Raproblem