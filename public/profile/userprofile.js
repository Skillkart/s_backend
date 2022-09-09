let user_profile = document.getElementsByClassName("profileheadertitle")[0];
let html = `<img src=${user_photo} alt=${user} width="35px" /><div class="profilername">${
  user.slice(0, 1).toUpperCase() + user.slice(1, user.length)
}</div>`;
user_profile.innerHTML = html;


userdata();

let userarray = [];
document
  .getElementsByClassName("profiledashboardform")[0]
  .addEventListener("submit", (e) => {
    e.preventDefault();
  });

if (!user) {
  window.location.assign("/");
}
let reviewrating = document.getElementsByClassName("profilerating")[0];
const logout = async () => {
  const request = await axios.get("/api/v1/logout").then(() => {
    window.location.assign("/");
  });
  return request;
};

// {Array(4) .fill() .map((_, i) => ( <p>⭐</p> ))}



async function userdata() {
  const request = await axios
    .post("/api/v1/userdetail", {
      role: userrole,
      id: user_id,
    })
    .then((result) => {
      userarray.push(result.data.data);
      if (result.data.data.role == "user") {
          document.getElementsByClassName("profiledashboardform")[0].innerHTML = `
                <img src=${
                  result.data.data.photo
                } width="100px" style="margin:10px 0px"/>  
                <div class="pdf-clm">
              <div class="pdf-clm-row">
                <label for="Name">Id</label>
                <div class="detailcontainer">${result.data.data._id}</div>
              </div>
              <div class="pdf-clm-row">
                <label for="Name">Name</label>
                <div class="detailcontainer">${result.data.data.Name}</div>
              </div>
            </div>
            <div class="pdf-clm">
              <div class="pdf-clm-row">
                <label for="Name">Email</label>
                <div class="detailcontainer">${result.data.data.Email}</div>
              </div>
              <div class="pdf-clm-row">
                <label for="Name">Phone</label>
                <div class="detailcontainer">${result.data.data.phone.slice(
                  2,
                  result.data.data.phone.length
                )}</div>
              </div>
            </div>
            <button onclick="editprofile()">Edit profile</button>`;
      }
      if (result.data.data.role == "recuirter") {
        document.getElementsByClassName("profiledashboardform")[0].innerHTML = `
        <img src=${
          result.data.data.photo
        } width="100px" style="margin:10px 0px"/> 
        <div class="pdf-clm">
        <div class="pdf-clm-row">
          <label for="Id">Id</label>
          <div class="detailcontainer">${result.data.data._id}</div>
        </div>
        <div class="pdf-clm-row">
          <label for="Name">Name</label>
          <div class="detailcontainer">${result.data.data.Name}</div>
        </div>
      </div>
      <div class="pdf-clm">
        <div class="pdf-clm-row">
          <label for="Email">Email</label>
          <div class="detailcontainer">${result.data.data.Email}</div>
        </div>
        <div class="pdf-clm-row">
          <label for="Phone">Phone</label>
          <div class="detailcontainer">${result.data.data.phone.slice(
            2,
            result.data.data.phone.length
          )}</div>
        </div>
      </div>
      <div class="pdf-clm">
        <div class="pdf-clm-row">
          <label for="Current company role">Current role</label>
          <div class="detailcontainer">${result.data.data.currentrole}</div>
        </div>
        <div class="pdf-clm-row">
          <label for="Work At">Work At</label>
          <div class="detailcontainer">${result.data.data.workat}</div>
        </div>
      </div>
      <div class="pdf-clm">
        <div class="pdf-clm-row">
          <label for="Area of Expertise">Area of Expertise</label>
          <div class="detailcontainer">${result.data.data.AOE}</div>
        </div>
        <div class="pdf-clm-row">
          <label for="qualification">qualification</label>
          <div class="detailcontainer">${
            result.data.data.qualification
          }</div>
        </div>
      </div>
      <button onclick="editprofile()" >Edit profile</button>`;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return request;
}

const editprofile = () => {
  if (userarray[0].role == "recuirter") {
    {
      userarray.map((user) => {
        let html = `<img src=${
          user.photo
        } width="100px" style="margin:10px 0px"/> 
      <div class="pdf-clm">
      <div class="pdf-clm-row">
        <label for="Id">Id</label>
        <div class="profile_id detailcontainer">${user._id}</div>
      </div>
      <div class="pdf-clm-row">
        <label for="Name">Name</label>
        <input value=${user.Name} class="profile_name"/>
        <div class="nameerrormessage errormessage">
            <span class="material-symbols-outlined"> error </span>
            <span>Required Valid Email</span>
        </div> 
      </div>
    </div>
    <div class="pdf-clm">
      <div class="pdf-clm-row">
        <label for="Email">Email</label>
        <div class="profile_id detailcontainer">${user.Email}</div>
        <div class="emailerrormessage errormessage">
            <span class="material-symbols-outlined"> error </span>
            <span>Required Valid Email</span>
        </div>
      </div>
      <div class="pdf-clm-row">
        <label for="Phone">Phone</label>
        <input value=${user.phone.slice(
          2,
          user.phone.length
        )} class="profile_phone"/>
        <div class="phoneerrormessage errormessage">
            <span class="material-symbols-outlined"> error </span>
            <span>Required Valid Phone number</span>
        </div>
      </div>
    </div>
    <div class="pdf-clm">
      <div class="pdf-clm-row">
        <label for="Current company role">Current role</label>
        <input value=${user.currentrole} class="profile_crole"/>
        <div class="curtroleerrormessage errormessage">
        <span class="material-symbols-outlined"> error </span>
        <span>Required field</span>
      </div>
        
      </div>
      <div class="pdf-clm-row">
        <label for="Work At">Work At</label>
        <input value=${user.workat} class="profile_workat"/>
        <div class="workaterrormessage errormessage">
          <span class="material-symbols-outlined"> error </span>
          <span>Required field</span>
        </div>
      </div>
    </div>
    <div class="pdf-clm">
      <div class="pdf-clm-row">
        <label for="Area of Expertise">Area of Expertise</label>
        <input value=${user.AOE} class="profile_AOE"/>
        <div class="aoeerrormessage errormessage">
          <span class="material-symbols-outlined"> error </span>
          <span>Required field</span>
        </div>
      </div>
      <div class="pdf-clm-row">
        <label for="qualification">qualification</label>
        <input value=${user.qualification} class="profile_quali"/>
        <div class="qualierrormessage errormessage">
          <span class="material-symbols-outlined"> error </span>
          <span>Required field</span>
        </div>
      </div>
    </div>
    <button onclick="saveprofile()" >Save profile</button>`;
        document.getElementsByClassName("profiledashboardform")[0].innerHTML =
          html;
      });
    }
  }
  if (userarray[0].role == "user") {
    {
      userarray.map((user) => {
        let html = `<img src=${
          user.photo
        } width="100px" style="margin:10px 0px"/> 
      <div class="pdf-clm">
      <div class="pdf-clm-row">
        <label for="Id">Id</label>
        <div class="profile_id detailcontainer">${user._id}</div>
      </div>
      <div class="pdf-clm-row">
        <label for="Name">Name</label>
        <input value="${user.Name}" class="profile_name"/>
        <div class="nameerrormessage errormessage">
        <span class="material-symbols-outlined"> error </span>
        <span>Required Valid Email</span>
    </div> 
      </div>
    </div>
    <div class="pdf-clm">
      <div class="pdf-clm-row">
        <label for="Email">Email</label>
        <div class="profile_id detailcontainer">${user.Email}</div>
        <div class="emailerrormessage errormessage">
            <span class="material-symbols-outlined"> error </span>
            <span>Required Valid Email</span>
        </div>
      </div>
      <div class="pdf-clm-row">
        <label for="Phone">Phone</label>
        <input value=${user.phone.slice(
          2,
          user.phone.length
        )} class="profile_phone"/>
        <div class="phoneerrormessage errormessage">
            <span class="material-symbols-outlined"> error </span>
            <span>Required Valid Phone number</span>
        </div>
      </div>
    </div>
    <button onclick="saveprofile()" >Save profile</button>`;
        document.getElementsByClassName("profiledashboardform")[0].innerHTML =
          html;
      });
    }
  }
};

const toprofile = () => {
  window.location.assign("/profile/userprofile");
};

const saveprofile = () => {
  if (userarray[0].role == "user") {
    const name = document.getElementsByClassName("profile_name")[0].value;
    const phone = document.getElementsByClassName("profile_phone")[0].value;
    const phonecofm = validator.isMobilePhone(phone, ["en-IN"]);
    if(!name || !phone){
      if (!name) {
        document.getElementsByClassName("nameerrormessage")[0].style.display =
          "flex";
        setTimeout(() => {
          document.getElementsByClassName(
            "emailerrormessage"
          )[0].style.display = "none";
        }, 2000);
        return;
      }
      if (!phonecofm) {
        document.getElementsByClassName("phoneerrormessage")[0].style.display =
          "flex";
        setTimeout(() => {
          document.getElementsByClassName(
            "phoneerrormessage"
          )[0].style.display = "none";
        }, 2000);
        return;
      }
    }else{
      ueprequest(name,  phone)
    }
  }
  if (userarray[0].role == "recuirter") {
    const name = document.getElementsByClassName("profile_name")[0].value;
    const phone = document.getElementsByClassName("profile_phone")[0].value;
    const crole = document.getElementsByClassName("profile_crole")[0].value;
    const workat = document.getElementsByClassName("profile_workat")[0].value;
    const Aoe = document.getElementsByClassName("profile_AOE")[0].value;
    const quali = document.getElementsByClassName("profile_quali")[0].value;
    const phonecofm = validator.isMobilePhone(phone, ["en-IN"]);

    if (
      !name ||
      !phonecofm ||
      !crole ||
      !workat ||
      !Aoe ||
      !quali
    ) {
      if (!name) {
        document.getElementsByClassName("nameerrormessage")[0].style.display =
          "flex";
        setTimeout(() => {
          document.getElementsByClassName(
            "emailerrormessage"
          )[0].style.display = "none";
        }, 2000);
        return;
      }
      if (!phonecofm) {
        document.getElementsByClassName("phoneerrormessage")[0].style.display =
          "flex";
        setTimeout(() => {
          document.getElementsByClassName(
            "phoneerrormessage"
          )[0].style.display = "none";
        }, 2000);
        return;
      }
      if (!Aoe) {
        document.getElementsByClassName("aoeerrormessage ")[0].style.display =
          "flex";
        setTimeout(() => {
          document.getElementsByClassName("aoeerrormessage")[0].style.display =
            "none";
        }, 2000);
        return;
      }
      if (!crole) {
        document.getElementsByClassName(
          "curtroleerrormessage"
        )[0].style.display = "flex";
        setTimeout(() => {
          document.getElementsByClassName(
            "curtroleerrormessage"
          )[0].style.display = "none";
        }, 2000);
        return;
      }
      if (!workat) {
        document.getElementsByClassName("workaterrormessage")[0].style.display =
          "flex";
        setTimeout(() => {
          document.getElementsByClassName(
            "workaterrormessage"
          )[0].style.display = "none";
        }, 2000);
        return;
      }
      if (!quali) {
        document.getElementsByClassName("qualierrormessage")[0].style.display =
          "flex";
        setTimeout(() => {
          document.getElementsByClassName(
            "qualierrormessage"
          )[0].style.display = "none";
        }, 2000);
        return;
      }
    } else {
      eprequest(name, phone, crole, workat, quali, Aoe);
    }
  }
};

async function ueprequest(name,  phone) {
  const request = await axios
    .post("/api/v1/Editprofile", {
      id: userarray[0]._id,
      name: name,
      phone: "+91" + `phone`,
      role: userarray[0].role,
    })
    .then(() => {
      window.location.reload();
    }).catch(error=>{
      console.log(error)
    });
  return request;
}
async function eprequest(name, phone, crole, workat, quali, Aoe) {
  const request = await axios
    .post("/api/v1/Editprofile", {
      id: userarray[0]._id,
      name: name,
      phone: 91 + phone,
      Currentrole: crole,
      role: userarray[0].role,
      workat: workat,
      AOE: Aoe,
      qualification: quali,
    })
    .then(() => {
      window.location.reload();
    }).catch(error=>{
      console.log(error)
    });
  return request;
}
