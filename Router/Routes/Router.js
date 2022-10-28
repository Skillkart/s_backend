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
const { upload } = require("../../Other/Multer");

router.route("/roomcreation").post(roomrequest);
router.route("/isLoggedIn").post(auth.loggedin);
router.route("/mentorsignup").post(auth.mentosignup);
router.route("/mentoraccount").post(auth.mentoraccountcr).get(auth.getmformdetail);
router.route("/signup").post(auth.signup);
router.route("/Login").post(auth.login);
router.route("/tknvrfy").post(auth.tknvrfy);
router.route("/mentortknvrfy").post(auth.mentortknvrfy);
router.route("/userdata").post(userdata);
router.route("/dateadder").post(auth.busydate);
router.route("/deleteroom").put(auth.deleteroom);
router.route("/roomverifiactio").post(auth.verifyroom);
router.route("/userforgeztpassword").post(auth.userforgetpass);
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
router.post("/getmentors", auth.getmentors);
router.post("/purchase", auth.purchase);
router.post("/Mailer", roomcrt.mailer);
router.post("/subscribe", auth.subscribe);
router.post("/refer", auth.refer);
router.post("/experiment", auth.demo);
router.post("/handletranctionfail", auth.transfail);
router.post("/bookaslot", auth.bookaslot);
router.get("/adminmentor", mentor);
router.post("/refer", auth.refer);
router.post("/referal", auth.referals);
router.get("/mentor", auth.mentor);
router.post("/usertranscation", auth.usertranscation);
router.post("/submitdate", auth.submitdate);
router.post("/getrounds", roomcrt.getrounds);
router.post("/handletranscation", auth.transcation);
router.post("/handleselectedmentor", auth.selectmentor);
router.post("/handlefeedback", auth.handlefeedback);
router.post("/resumehandle", auth.handleresume);
router.post("/getavafee", auth.avargefeedback);
router.post("/getresume", auth.getresume);
router.post("/verifyuemail", auth.uemail);
router.post("/passwordverify", auth.pverify);
router.post("/getfeedbacks", auth.getfeedbacks);
router.post("/getrevenue", auth.getrevenue);
router.get("/adminuserrecuirter", roomcrt.getuandr);
router.post("/isfeedbackdone", auth.isfeedback);
// router.get("/:filename", auth.pp);

router.post("/changeprofile", auth.changeprofilepic);
router.post("/removeprofilepic", auth.removeprofilepic);
router.post("/deactiveaccount", auth.deactive);
router.post("/changefronuserprofile", auth.change);
router.route("/refered").get(auth.getreferer).post(auth.addrefer);
router.route("/loginrefered").post(auth.addloginrefer);
router.route("/emailtest").post(auth.emailtest);
router.route("/changeuserprofiledetail").post(auth.changeuserprofile);
router.route("/changeuserpassword").post(auth.changeuserpassword);
router.route("/deletslots").post(auth.deleteslots)
router.route("/getpendingfeedback").post(auth.getpendingfeedback)

module.exports = router;
