userdata()
let data= []

if(!user){
  window.location.assign("/")
}
let reviewrating = document.getElementsByClassName("profilerating")[0]
const logout =async()=>{
  const request = await axios.get("/api/v1/logout").then(()=>{
    window.location.assign("/")
  })
  return request
}

// {Array(4) .fill() .map((_, i) => ( <p>⭐</p> ))}

let user_profile = document.getElementsByClassName("profileheadertitle")[0];
let html = `<img src=${user_photo} alt=${user} width="35px" /><div class="profilername">${
  user.slice(0, 1).toUpperCase() + user.slice(1, user.length)
}</div>
`;
user_profile.innerHTML = html;

async function userdata() {
  const request = await axios.post("/api/v1/userdetail", {
    role: userrole,
    id: user_id,
  }).catch(error=>{
    console.log(error)
  })
  data =request.data.parties
  return request;
}

if (userrole == "user") {
  document.getElementsByClassName("wrapper")[0].style.display = "none";
} else {
  document.getElementsByClassName("wrapper")[0].style.display = "flex";
}


const toprofile=()=>{
  window.location.assign("/profile/userprofile")
}