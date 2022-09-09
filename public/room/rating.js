let u_id = "";
let r_id = "";
let ratg;
feedback();

const rating = (event) => {
  const array = document.getElementsByClassName("ratdiv");
  for (let i = 0; i < array.length; i++) {
    (array[i].style.backgroundColor = "transparent"),
      (array[i].style.color = "black");
  }
  ratg = event.originalTarget.innerText;
  event.originalTarget.style.backgroundColor = "royalblue";
  event.originalTarget.style.color = "white";
};

async function feedback() {
  const user = document.getElementsByClassName("feedback-usr-name")[0];
  const mentor = document.getElementsByClassName("feedback-usr-mentor")[0];

  const user_id = document.getElementsByClassName("u_id")[0];
  const mentor_id = document.getElementsByClassName("m_id")[0];
  const request = await axios
    .post("/api/v1/feedbackdetail", {
      roomid: roomId,
    })
    .then((result) => {
      console.log(result)
      console.log(result)
      let username = result.data.user.Name;
      let mentorname = result.data.rec.Name;
      let mentor_id = result.data.rec._id;
      let user_id = result.data.user._id;

      let userhtml = `<div class="u-avatar">${username
        .slice(0, 1)
        .toUpperCase()}</div><div class="user_name">${
        username.slice(0, 1).toUpperCase() +
        username.slice(1, username.length).split(" ")[0]
      }</div> <div class='u_id_${result.data.user.role}'>${user_id}</div>`;
      user.innerHTML = userhtml;

      let mentorhtml = `<div class="u-avatar">${mentorname
        .slice(0, 1)
        .toUpperCase()}</div><div class="user_name">${
        mentorname.slice(0, 1).toUpperCase() +
        mentorname.slice(1, mentorname.length)
      }</div><div class="m_id_${result.data.rec.role}">${mentor_id}</div>`;
      mentor.innerHTML = mentorhtml;
    })
    .catch((err) => {
      console.log(err);
      // window.location.assign("/");
    });
  return request;
}

const fd = async (feedbackfor, by, feebackinput, rating) => {
  const request = await axios.post("/api/v1/feedback", {
    feedbackfor: feedbackfor,
    by: by,
    feebackinput: feebackinput,
    rating: rating,
    roomid: roomId
  }).then(()=>{
    window.location.assign("/")
  }).catch(()=>{
    window.location.assign("/")
  });
  return request;
};
const feedbackdispatch = () => {
  const mentor_id =
    document.getElementsByClassName("m_id_recuirter")[0].innerText;
  const user_id = document.getElementsByClassName("u_id_user")[0].innerText;
  const feedbackinput = document.getElementsByClassName(
    "feedbackinputcontainer"
  )[0].value;
  if (!ratg || !feedbackinput) {
    if(!ratg){
      document.getElementsByClassName("ratingerrormessage")[0].style.display="flex"
    }if(!feedbackinput){
      document.getElementsByClassName("inputerrormessage")[0].style.display="flex"

      return;
    }

  } else {
    if (userrole == "recuirter") {
      fd(user_id, mentor_id, feedbackinput, ratg);
    } else {
      fd(mentor_id, user_id, feedbackinput, ratg);
    }
  }
};
