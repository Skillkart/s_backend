const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.origins("*:*");
const { v4: uuidV4 } = require("uuid");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const dotenv = require("dotenv");
const { room } = require("./Router/ViewRoute/Viewroute");
const viewrouter = require("./Router/ViewRoute/Viewroute");
const pathrouter = require("./Router/Routes/Router");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");

dotenv.config({ path: "./config.env" });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/resume", express.static(path.join("resume")));
app.use("/profilepic", express.static(path.join("profilepic")));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(
//   fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
//   })
// );
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies.jwt);
  next();
});

let gfs;

app.use("/", viewrouter);
app.use("/api/v1", pathrouter);

mongoose
  .connect(process.env.uri, {
    useNewUrlParser: true,
  })
  .then((con) => {
   console.log("db connected")
  })
  .catch((error) => {
    console.log(error, "its a error");
  });

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, user) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId, user);
    socket.on("create-message", (msg, user) => {
      io.to(roomId).emit("get-msg", msg, user);
    });
    socket.on("messagesended", (sended) => {
      socket.to(roomId).broadcast.emit("got-msg", sended);
    });
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
    socket.on("mic-off", (micoff) => {
      socket.to(roomId).broadcast.emit("micoff", micoff);
    });
  });
});

// app.get("/api/v1/:filename", (req, res) => {
//   gfs.files.find().toArray((err, file) => {
//     // console.log(file , err)
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: "No files exist",
//       });
//     }

//     // Files exist
//     return res.json(file);
//   });
// });
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });
const port = process.env.PORT;
server.listen(port, () => {
  console.log(port);
});


