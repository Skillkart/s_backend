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
const cors = require("cors");
const dotenv = require("dotenv");
const { room } = require("./Router/ViewRoute/Viewroute");
const viewrouter = require("./Router/ViewRoute/Viewroute");
const pathrouter = require("./Router/Routes/Router");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


dotenv.config({ path: "./config.env" });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST" , "OPTIONS"],
  })
);
app.options("*", cors());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies.jwt);
  next();
});

app.use("/", viewrouter);
app.use("/api/v1", pathrouter);

mongoose
  .connect(process.env.uri, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("db connected");
  })
  .catch((error) => {
    console.log(error, "its a error");
  });

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, user) => {
    socket.join(roomId);
    console.log(roomId);
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

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });
const port = process.env.PORT;
server.listen(port, () => {
  console.log(port);
});
