const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/postcontroller");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/", upload.single("image"), postController.createPost);
router.put("/:id", upload.single("image"), postController.updatePost);

module.exports = router;
