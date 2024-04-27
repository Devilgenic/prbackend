const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
