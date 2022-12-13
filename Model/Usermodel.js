const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  Name: String,
  Email: {
    type: String,
    unique: true,
  },
  Emailverified: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "recuirter", "admin"],
    default: "user",
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  Linkedinprofile: String,
  passwordResetToken: {
    type: String,
  },
  stream: String,
  degree: String,
  graduateyear: String,
  step: Number,
  college: String,
  completed: {
    type: Boolean,
    defautl: false,
  },
  ipaddress: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", UserModel);
module.exports = User;
