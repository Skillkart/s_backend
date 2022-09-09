if (user) {
  window.location.assign("/");
}
document
  .getElementsByClassName("mentorform")[0]
  .addEventListener("submit", (e) => {
    e.preventDefault();
  });

const dispatcher = async (
  name,
  email,
  password,
  phone,
  qualy,
  workat,
  currentrole,
  Linkendin,
  expertise,
  gender,
  recuirment,
  qualityrelookingfor,
  sparetime,
  experience
) => {
  document.getElementsByClassName(
    "btn-container"
  )[0].innerHTML = `<div class="loading"></div>`;
  await axios
    .post("/api/v1/mentorsignup", {
      name: name,
      email: email.toLowerCase(),
      password: password,
      phone: "+91" + phone,
      qualy: qualy,
      currentrole: currentrole,
      workat: workat,
      Linkendin: Linkendin,
      expertise: expertise,
      gender: gender,
      recuirment: recuirment,
      qualityrelookingfor: qualityrelookingfor,
      sparetime: sparetime.value,
      experience: experience,
    })
    .then(() => {
      let verification = document.getElementsByClassName("verifycode")[0];
      let verificationpanel =
        document.getElementsByClassName("verifybackground")[0];
      document.getElementsByClassName("user_email")[0].innerText = email;
      verification.style.display = "flex";
      verificationpanel.style.transition = "0.4s all ease-in";
      verificationpanel.style.transform = "translateX(0px)";
    })
    .catch((err) => {
      console.log(err);
      const m = err.response.data.message;
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText = m;
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
    });
  document.getElementsByClassName(
    "btn-container"
  )[0].innerHTML = `<div onclick="mentorform()" class="mentorformsubmitbtn">Submit</div>
  `;
};

const mentorvrfyrequest = async () => {
  const vrfycode = document.getElementById("vrfycode").value;
  let user_mail = document.getElementsByClassName("user_email")[0].innerText;
  if (vrfycode) {
    await axios
      .post("/api/v1/mentortknvrfy", {
        email: user_mail,
        tkn: vrfycode,
      })
      .then((result) => {
        window.location.assign("/");
      })
      .catch(() => {
        document.getElementsByClassName("vrfymessage")[0].style.display =
          "flex";
      });
  } else {
    document.getElementsByClassName("vrfymessage")[0].style.display = "flex";
  }
};

const mentorform = () => {
  const name = document.getElementsByClassName("name")[0].value;
  const email = document.getElementsByClassName("email")[0].value;
  const password = document.getElementsByClassName("password")[0].value;
  const passwordconfirm =
    document.getElementsByClassName("passwordconfirm")[0].value;
  const phone = document.getElementsByClassName("phone")[0].value;
  const qualy = document.getElementsByClassName("quali")[0].value;
  const workat = document.getElementsByClassName("workat")[0].value;
  const currentrole = document.getElementsByClassName("role")[0].value;
  const Linkendin = "";
  const expertise = document.getElementsByClassName("expertise")[0].value;
  const gender = document.querySelector('input[name="Gender"]:checked');
  const recuirment = document.querySelector('input[name="recuirment"]:checked');
  const qualityrelookingfor =
    document.getElementsByClassName("quality")[0].value;
  const sparetime = document.querySelector('input[name="sparetime"]:checked');
  const experience = document.getElementsByClassName("exp")[0].value;

  let valiemail = validator.isEmail(email);
  let phonecfm = validator.isMobilePhone(phone, ["en-IN"]);

  if (
    !name ||
    !email ||
    !password ||
    !phonecfm ||
    !qualy ||
    !currentrole ||
    !workat ||
    !Linkendin ||
    !expertise ||
    !gender ||
    !recuirment ||
    !qualityrelookingfor ||
    !sparetime ||
    !experience
  ) {
    if (!name) {
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "Name required";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return ;
    }
    if (!valiemail) {
      document.getElementsByClassName("emailerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "Email required";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (password.length < 6) {
      document.getElementsByClassName("passworderrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "Password must have minimum six characters";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });

      return;
    }
    if (!phonecfm) {
      document.getElementsByClassName("phoneerrormessage")[0].style.display =
        "flex";

      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "Valid Phone number required";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!qualy) {
      document.getElementsByClassName("qualierrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "qualification required";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!workat) {
      document.getElementsByClassName("workaterrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "You missed something";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!currentrole) {
      document.getElementsByClassName("curtroleerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "You missed something";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!expertise) {
      document.getElementsByClassName("aoeerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "You missed something";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!gender) {
      document.getElementsByClassName("gendererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "You missed something";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!recuirment) {
      document.getElementsByClassName(
        "recuirmenterrormessage"
      )[0].style.display = "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "You missed something";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!qualityrelookingfor) {
      document.getElementsByClassName("qualityerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "You missed something";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!sparetime) {
      document.getElementsByClassName(
        "sparetimeerrormessage"
      )[0].style.display = "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "You missed something";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    }
    if (!experience) {
      document.getElementsByClassName("experrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "You missed something";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      return;
    } else {
      console.log("her")
      if (password === passwordconfirm) {
        dispatcher(
          name,
          email,
          password,
          phone,
          qualy,
          currentrole,
          workat,
          Linkendin,
          expertise,
          gender.value,
          recuirment.value,
          qualityrelookingfor,
          sparetime,
          experience
        );
      } else {
        document.getElementsByClassName(
          "passwordconfirmerrormessage"
        )[0].style.display = "flex";
        document.getElementsByClassName("nameerrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].style.display = "flex";
      document.getElementsByClassName("servermess")[0].style.alignItems =
        "center";
      document.getElementsByClassName("servererrormessage")[0].style.display =
        "flex";
      document.getElementsByClassName("servermess")[0].innerText =
        "Passwords are not same";
      window.scroll({
        top: 100,
        behavior: "smooth",
      });
      }
    }
  }
};
