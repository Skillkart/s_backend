exports.home = (req, res) => {
  res.render("Home/Home");
};
exports.sample=(req , res)=>{
  res.render("samplemain/index")
}

exports.welcome =(req , res)=>{
  res.render("Popup/WelcomUser")
}

exports.email = (req, res) => {
  res.render("Popup/purchase");
};

exports.room = (req, res) => {
  res.render("roomheader/room", { roomId: req.params.room });
};


exports.userprofile=(req , res)=>{
  res.render("userprofile/Userprofile")
}

exports.blog=(req , res)=>{
  res.render("Home/Blog/Blog")
}


exports.login = (req, res) => {
  res.render("Auth/Login");
};
exports.signup = (req, res) => {
  res.render("Auth/Signup");
};

exports.Tou = (req, res) => {
  res.render("termsofuse/termsofuse");
};

exports.mentorlogin = (req, res) => {
  res.render("mentor/mentorlogin");
};


exports.forget = (req, res) => {
  res.render("auth/forgetpass");
};

exports.feedback= (req, res) => {
  res.render("feedback/feedback" ,{ roomId: req.params.id });
};
exports.transcation =(req, res)=>{
  res.render("userprofile/Trancation")
}

exports.profiledetail =(req, res)=>{
  res.render("userprofile/Profile")
}