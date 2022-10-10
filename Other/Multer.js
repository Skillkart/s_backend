const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profilepic");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
// const upload = multer({ storage });
exports.upload = multer({ storage });
