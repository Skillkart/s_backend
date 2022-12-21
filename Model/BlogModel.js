const mongoose = require("mongoose");

const Blogmodel = new mongoose.Schema({
  blogtitle: {
    type: String,
  },
  blogcontent: {
    type: String,
  },
  blogimage: {
    type: String,
  },
  blogtags: {
    type: String,
  },
  blogtype: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Blogs = mongoose.model("Blogs", Blogmodel);
module.exports = Blogs;
