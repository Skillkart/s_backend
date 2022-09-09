let i = 0;
let tsn = 150;
let diff = 350;
let mobiletsn = 60;
let mobilediff = 135;

let newsleter = document.getElementsByClassName("newsletter")[0];
let loginbutton = document.getElementsByClassName("login")[0];
let body = document.querySelectorAll("body")[0];
let bodyleft = document.getElementsByClassName("banner-container-left")[0];
let newsletterclose = document.getElementsByClassName("inbox-close")[0];
let bodyright = document.getElementsByClassName("banner-container-right")[0];
let profilenavheight = document.getElementsByClassName(
  "profilecontainernav"
)[0];

let svccnt = document.getElementsByClassName("home-blog-cnt-slider");
let array = document.getElementsByClassName("controls-navi");
let nextstep = document.getElementsByClassName("next-step");
let cnt = document.getElementsByClassName("home-blog-cnt");

document.getElementsByClassName("home-blog-cnt-slider")[0];

let svcontainerimage = document.getElementsByClassName(
  "svccontaineritem-imag"
)[1];
let svctext = document.getElementsByClassName("svccontainer-text")[1];

svcontainerimage.style.height = svctext.clientHeight;

function optionhadler(event) {
  document.getElementsByClassName(
    "mainoption"
  )[0].innerHTML = ` <span class="p-course">${
    event?.target?.innerText || event?.originalTarget?.innerText
  }</span><span class="material-symbols-outlined buymenu"> arrow_drop_down </span>`;
  if (
    event?.originalTarget?.innerText == "MBA" ||
    event?.target?.innerText == "MBA"
  ) {
    document.getElementsByClassName(
      "homebanner-form-button"
    )[0].innerHTML = `<button>Coming soon</button>`;
    document.getElementsByClassName(
      "homebanner-form-price"
    )[0].innerHTML = `<span class="p-price">Rs. 8999</span> <del>14999</del>`;
  }
  if (
    event?.originalTarget?.innerText == "B.Tech" ||
    event?.target?.innerText == "B.Tech"
  ) {
    document.getElementsByClassName(
      "homebanner-form-price"
    )[0].innerHTML = `<span class="p-price">Rs. 7999</span> <del>11999</del>`;
    document.getElementsByClassName(
      "homebanner-form-button"
    )[0].innerHTML = `<button onclick="seatbooking()">Book now</button>`;
  }
  document.getElementsByClassName("mainoption-dropdown")[0].style.display =
    "none";
}

const backtotop = () => {
  window.scroll({
    top: 10,
    behavior: "smooth",
  });
};

if (cnt.length < 3) {
  for (let k = 0; k < array.length; k++) {
    array[k].style.color = "rgb(19, 11, 70 , 0.4)";
  }
}

const forword = () => {
  if (window.innerWidth < 430) {
    if (cnt.length > 3) {
      if (i < 10 || i === 0) {
        mobiletsn = mobiletsn - mobilediff;
        let sliderforword = document.getElementsByClassName("home-blog-cnt");
        for (let j = 0; j < sliderforword.length; j++) {
          sliderforword[j].style.transform = `translateX(${mobiletsn}px)`;
        }
        i++;
      } else {
        return;
      }
    } else {
      return;
    }
  }
  if (window.innerWidth < 956) {
    if (cnt.length > 3) {
      if (i < 6 || i === 0) {
        mobiletsn = mobiletsn - mobilediff;
        let sliderforword = document.getElementsByClassName("home-blog-cnt");
        for (let j = 0; j < sliderforword.length; j++) {
          sliderforword[j].style.transform = `translateX(${mobiletsn}px)`;
        }
        i++;
      } else {
        return;
      }
    } else {
      return;
    }
  } else {
    if (cnt.length > 3) {
      if (i < 4 || i === 0) {
        tsn = tsn - diff;
        let sliderforword = document.getElementsByClassName("home-blog-cnt");
        for (let j = 0; j < sliderforword.length; j++) {
          sliderforword[j].style.transform = `translateX(${tsn}px)`;
        }
        i++;
      } else {
        return;
      }
    } else {
      return;
    }
  }
};
const backword = () => {
  if (window.innerWidth < 430) {
    if (cnt.length > 3) {
      if (i > 0 || i === 2) {
        mobiletsn += mobilediff;
        let sliderforword = document.getElementsByClassName("home-blog-cnt");
        for (let j = 0; j < sliderforword.length; j++) {
          sliderforword[j].style.transform = `translateX(${mobiletsn}px)`;
        }
        i--;
      } else {
        return;
      }
    } else {
      return;
    }
  }
  if (window.innerWidth < 956) {
    if (cnt.length > 3) {
      if (i > 0 || i === 2) {
        mobiletsn = mobiletsn + mobilediff;
        let sliderforword = document.getElementsByClassName("home-blog-cnt");
        for (let j = 0; j < sliderforword.length; j++) {
          sliderforword[j].style.transform = `translateX(${mobiletsn}px)`;
        }
        i--;
      } else {
        return;
      }
    } else {
      return;
    }
  } else {
    if (cnt.length > 3) {
      if (i > 0 || i === 2) {
        tsn += diff;
        let sliderforword = document.getElementsByClassName("home-blog-cnt");
        for (let j = 0; j < sliderforword.length; j++) {
          sliderforword[j].style.transform = `translateX(${tsn}px)`;
        }
        i--;
      } else {
        return;
      }
    } else {
      return;
    }
  }
};

const blog = () => {
  window.scroll({
    top: 4800,
    behavior: "smooth",
  });
};

let h = "";
//
const loginshow = () => {
  body.style.overflowY = "hidden";
  loginbutton.style.transition = "0.7s all ease";
  loginbutton.style.transform = "translateX(0px)";
};

const expandmore = (event) => {
  let expand = document.getElementsByClassName("expand-button");
  const answer = document.getElementsByClassName("fr-a-answer");
  let cleque = document.getElementsByClassName("fr-question-container")[0];

  document
    .getElementsByClassName("fr-question-container")[0]
    .addEventListener("click", (event) => {
      console.log(event);
    });

  if (!answer.style.display || answer.style.display === "none") {
    answer.style.display = "grid";
    expand.style.transform = "rotate(0deg)";
  } else {
    answer.style.display = "none";
    expand.style.transform = "rotate(-45deg)";
  }
};

// profilenavheight.style.height = window.innerHeight - 70;

// bodyright.style.height = bodyleft.clientHeight - 50;
