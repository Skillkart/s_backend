roomverication();
const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer();
let m = document.getElementsByClassName("m")[0];
let chatbutton = document.getElementsByClassName("chat-room")[0];
let user1 = document.getElementsByClassName("user1")[0];
let user2 = document.getElementsByClassName("user2")[0];
let user2container = document.getElementsByClassName("user2-container")[0];
const peers = {};

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/room/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/room/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/room/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/room/models"),
]).then(nav);

let not = document.getElementsByClassName("notification")[0];
const timer = document.getElementsByClassName("timer")[0];

let second = 00;
let min = 00;

async function roomverication() {
  const room = await axios
    .post("/api/v1/roomverifiactio", { room_id: ROOM_ID })
    .catch(() => {
      window.location.assign("/");
    });
  return room;
}

if (user) {
  if (userrole != "recuirter") {
    document.getElementsByClassName(
      "videocontrols"
    )[0].innerHTML += `<div class="roomicons" onclick="roomleave()">
 <span class="material-symbols-outlined"> call_end </span>
</div>`;
  } else {
    document.getElementsByClassName(
      "videocontrols"
    )[0].innerHTML += `<div class="roomicons" onclick="roomdestroy()">
 <span class="material-symbols-outlined"> call_end </span> 
</div>`;
  }
}
async function recording() {
  const r = await navigator.mediaDevices.getDisplayMedia({ video: true });
  return r;
}

async function roomdestroy() {
  const request = await axios.put("/api/v1/deleteroom", {
    roomid: ROOM_ID,
  });
  return request;
}

let myVideoStream;

async function nav() {
  const request = await navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return request;
}

async function player() {
  const stream = await nav();
  if (!stream) {
    not.style.display = "flex";
  } else {
    user1.muted = true;
    user1.srcObject = stream;
    user1.play();
    myVideoStream = stream;
    myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        streamadder(user2, userVideoStream);
      });
    });

    socket.on("user-connected", (userId, user) => {
      connectToNewUser(userId, stream);
    });

    socket.on("got-msg", (sended) => {
      document.getElementsByClassName("gotmessage")[0].style.display = "flex";
    });

    socket.on("get-msg", (msg, username) => {
      const splitedname = username.split(" ")[0];
      const name =
        splitedname.slice(0, 1).toUpperCase() +
        splitedname.slice(1, splitedname.length);
      let html = "";
      let chatmessages = document.getElementsByClassName("chatmsgs")[0];
      html += `<div class="messages">
                <div class="chatmessageprofile">
                  <div class="chatmessage_logo">${splitedname
                    .slice(0, 1)
                    .toUpperCase()}</div>
                  <h3>${name}</h3>
                </div>
                <p>${msg}</p>
              </div>`;
      scrolltobottom();
      chatmessages.innerHTML += html;
    });

    socket.on("micoff", (micoff) => {
      if (micoff) {
        document.getElementsByClassName(
          "mic-icon"
        )[0].innerHTML = `<span class="material-symbols-outlined">
        mic_off
      </span>`;
      } else {
        document.getElementsByClassName(
          "mic-icon"
        )[0].innerHTML = ` <span class="material-symbols-outlined">
        graphic_eq
      </span>`;
      }
    });
    socket.on("user-disconnected", (userId) => {
      user2container.style.display = "none";
      user2.style.display = "none";
      m.style.display = "flex";
      if (peers[userId]) peers[userId].close();
    });
  }
}
if (user) {
  player();
}
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  call.on("stream", (userVideoStream) => {
    streamadder(user2, userVideoStream);
  });

  peers[userId] = call;
}

function streamadder(video, stream) {
  user2container.style.display = "flex";
  m.style.display = "none";
  user2.style.display = "flex";
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  user2.addEventListener("play", () => {
    // const canvas = faceapi.createCanvasFromMedia(video);
    // document.getElementsByClassName("user2-container")[0].append(canvas);
    // const displaySize = { width: 700, height: 700 };
    // faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      // const resizedDetections = faceapi.resizeResults(detections, displaySize);
      // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      // faceapi.draw.drawDetections(canvas, resizedDetections);
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      console.log(detections)
    }, 100);
  });
}

const sendmessage = (e) => {
  let value = document.getElementsByClassName("message")[0];
  socket.emit("create-message", value.value, user);
  socket.emit("messagesended", true);
  value.value = "";
};

const micon = () => {
  let html = `<div class="roomicons mic" onclick="micoff()">
  <span class="material-symbols-outlined"> mic </span>
</div>`;
  socket.emit("mic-off", false);
  myVideoStream.getAudioTracks()[0].enabled = true;
  document.getElementsByClassName("mic")[0].outerHTML = html;
};
const micoff = () => {
  let html = `<div class="roomicons mic" onclick="micon()">
  <span class="material-symbols-outlined"> mic_off </span>
</div>`;
  socket.emit("mic-off", true);

  myVideoStream.getAudioTracks()[0].enabled = false;
  document.getElementsByClassName("mic")[0].outerHTML = html;
};

const camon = () => {
  let html = `<div class="roomicons cam" onclick="camoff()">
  <span class="material-symbols-outlined"> videocam </span>
</div>`;
  myVideoStream.getVideoTracks()[0].enabled = true;
  document.getElementsByClassName("cam")[0].outerHTML = html;
};
const camoff = () => {
  let html = `<div class="roomicons cam" onclick="camon()">
  <span class="material-symbols-outlined"> videocam_off </span>
</div>`;
  myVideoStream.getVideoTracks()[0].enabled = false;

  document.getElementsByClassName("cam")[0].outerHTML = html;
};

const chatclose = () => {
  let html = `<div class="roomicons chatbutton" onclick="chatopen()">
  <span class="material-symbols-outlined"> sms </span>
  <div class="gotmessage"></div>
</div>`;
  chatbutton.style.transform = "translateX(500px)";
  document.getElementsByClassName("chatbutton")[0].outerHTML = html;
};

const chatopen = () => {
  let html = `<div class="roomicons chatbutton" onclick="chatclose()">
  <span class="material-symbols-outlined"> sms </span>
  <div class="gotmessage"></div>
</div>`;
  chatbutton.style.transform = "translateX(0px)";
  document.getElementsByClassName("chatbutton")[0].outerHTML = html;
};

if (user) {
  document
    .getElementsByClassName("chatsend")[0]
    .addEventListener("submit", (e) => {
      e.preventDefault();
      sendmessage();
    });
}

const scrolltobottom = () => {
  const d = document.getElementsByClassName("chatcontainer")[0];
  const m = document.getElementsByClassName("chatmsgs")[0];

  d.scroll({
    top: m.scrollHeight + 500,
  });
};

const roomleave = () => {
  window.location.assign(`/room/Feedback/${ROOM_ID}`);
};
