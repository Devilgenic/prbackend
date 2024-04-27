const Post = require("../models/Postmodel");
const path = require("path");
const fs = require("fs");

const createPost = async (req, res) => {
  const { title, description } = req.body;
  const image = req.file.filename;

  try {
    const newPost = new Post({
      title,
      description,
      image,
    });

    await newPost.save();
    res.status(201).send("Post created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred while saving post");
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, description } = req.body;
  let image = "";

  if (req.file) {
    image = req.file.filename;
    // Delete old image
    try {
      const post = await Post.findById(postId);
      const imagePath = path.join(__dirname, "uploads", post.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  try {
    await Post.findByIdAndUpdate(
      postId,
      { title, description, image },
      { new: true }
    );
    res.status(200).send("Post updated successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred while updating post");
  }
};

module.exports = { createPost, updatePost };
