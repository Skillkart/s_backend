const express = require("express");
const {
  sessionrequest,
  roomrequest,
  meetingdata,
  gettranscation,
  bookaslotdemo,
} = require("../../Controller/Bookingcontroller");
const router = express.Router();
const auth = require("../../Controller/Authcontroller");
const roomcrt = require("../../Controller/Roomcontroller");
const { userdata, mentor } = require("../../Controller/allresponse");

router.route("/roomcreation").post(roomrequest);
router.route("/isLoggedIn").post(auth.loggedin);
router.route("/mentorsignup").post(auth.mentosignup);
router.route("/signup").post(auth.signup);
router.route("/Login").post(auth.login);
router.route("/tknvrfy").post(auth.tknvrfy);
router.route("/mentortknvrfy").post(auth.mentortknvrfy);
router.route("/userdata").post(userdata);
router.route("/dateadder").post(auth.busydate);
router.route("/deleteroom").put(auth.deleteroom);
router.route("/roomverifiactio").post(auth.verifyroom);
router.route("/userforgetpassword").post(auth.userforgetpass);
router.route("/feedbackdetail").post(auth.getfeedbackdetail);
router.route("/userdetail").post(auth.userdata);
router.get("/logout", auth.logout);
router.post("/feedback", auth.feedback);
router.post("/Editprofile", auth.Editprofile);
router.post("/meeting", meetingdata);
router.post("/gettranscation", gettranscation);
router.post("/createmsg", auth.createmsg);
router.post("/getmsg", auth.getmessage);
router.post("/deletemsg", auth.deleteroommsg);
router.post("/mentorform", auth.mentorfeedback);
router.post("/updateuserdetail", auth.updateroomdetail);
router.post("/pendingfeedbackstts", auth.pfee);
router.post("/razarpay", auth.payment);
router.post("/handlewaitinglist", auth.waitinglist);
router.get("/getmentors", auth.getmentors);
router.post("/bookaslot", auth.bookaslot);
router.post("/Mailer", roomcrt.mailer);
router.post("/subscribe", auth.subscribe);
router.post("/refer", auth.refer);
router.post("/experiment", auth.demo);
router.post("/handletranctionfail", auth.transfail);


router.get("/adminmentor", mentor);


module.exports = router;
