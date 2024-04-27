const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect("MONGO_URL", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
