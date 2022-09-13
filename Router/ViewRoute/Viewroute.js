const express = require("express");
const {
  room,
  home,
  signup,
  email,
  login,
  userprofile,
  blog,
  Tou,
  mentorlogin,
  forget,
  feedback,
  transcation,
  profiledetail,
  sample,
  welcome
} = require("../../Controller/Viewcontroller");

const auth = require("../../Controller/Authcontroller");

const viewrouter = express.Router();

viewrouter.get("/", auth.isLoggedIn , home);
viewrouter.get("/login",  auth.isLoggedIn ,  login);
viewrouter.get("/Signup",  auth.isLoggedIn , signup);
viewrouter.get("/room/:room", auth.isLoggedIn , room);
viewrouter.get("/Email",  auth.isLoggedIn , sample);
viewrouter.get("/dashboard",  auth.isLoggedIn , userprofile);
viewrouter.get("/PrivacyPolicy",  auth.isLoggedIn , Tou);
viewrouter.get("/mentor",  auth.isLoggedIn , mentorlogin);
viewrouter.get("/Forgetpassword",  auth.isLoggedIn , forget);
viewrouter.get("/room/Feedback/:id",  auth.isLoggedIn , feedback);
viewrouter.get("/profile/transcation",  auth.isLoggedIn , transcation);
viewrouter.get("/profile/profile",  auth.isLoggedIn , profiledetail);
viewrouter.get("/welcome",  auth.isLoggedIn , welcome);

viewrouter.get("/blog/Important%20Tips%20to%20prepare%20campus%20placement",  auth.isLoggedIn , blog);


module.exports = viewrouter;
