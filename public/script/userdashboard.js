let user_profile = document.getElementsByClassName("user-profile")[0];
let logo = `<div class="userlogo">${user
  .slice(0, 1)
  .toUpperCase()}</div><div class="user_name">${
  user.slice(0, 1).toUpperCase() + user.slice(1, user.length).split(" ")[0]
}</div>`;
user_profile.innerHTML = html;
