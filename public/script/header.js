if (user) {
  let user_profile = document.getElementsByClassName("user-profile")[0];
  let html = `<img src=${user_photo} alt=${user} width="35px" /><div class="user_name">${
    user.slice(0, 1).toUpperCase() + user.slice(1, user.length).split(" ")[0]
  }</div>`;
  user_profile.innerHTML = html;
}

let b = document.getElementsByClassName("headerburger")[0];

const nav = () => {
  window.location.assign(`/Dashboard`);
};

const burger = () => {
  document.getElementsByClassName("mobilementor")[0].style.transform =
    "translateX(0px)";
};
const burgerclose = () => {
  document.getElementsByClassName("mobilementor")[0].style.transform =
    "translateX(-400px)";
};

function mainoption() {
  if (
    document.getElementsByClassName("mainoption-dropdown")[0].style.display ===
    "none"
  ) {
    document.getElementsByClassName(
      "buymenu"
    )[0].outerHTML = `<span class="material-symbols-outlined buymenu">arrow_drop_up</span>`;
    document.getElementsByClassName("mainoption-dropdown")[0].style.display =
      "flex";
  }
  else{
    document.getElementsByClassName("mainoption-dropdown")[0].style.display =
    "none";
  }
}

// document.getElementsByClassName("mop-dropdown-option")[0].addEventListener("click" , (e)=>{
//   console.log(e)
// })
async function seatbookingrequest() {
  let price = document
    .getElementsByClassName("p-price")[0]
    .innerText.split(" ")[1];
  let course = document
    .getElementsByClassName("p-course")[0]
    .innerText.split(" ")[0];

  const request = await axios.post("/api/v1/roomcreation", {
    user_id: user_id,
    course: course,
    price: price,
    username: user,
    email: useremail,
  });
  return request;
}
async function seatbooking() {
  if (!user) {
    document.getElementsByClassName("loginrequired")[0].style.display = "flex";
  } else {
    await seatbookingrequest();
  }
}
function reloginclose() {
  let close = document.getElementsByClassName("login-required-close")[0];
  document.getElementsByClassName("loginrequired")[0].style.display = "none";
}

function technical() {
  window.scroll({
    top: 3000,
    behavior: "smooth",
  });
}

function behaviour() {
  window.scroll({
    top: 3600,
    behavior: "smooth",
  });
}
function resume() {
  window.scroll({
    top: 4100,
    behavior: "smooth",
  });
}
