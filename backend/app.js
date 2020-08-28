const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

mongoose
  .connect(
    "mongodb+srv://nenad:"+MONGO_PASS+"@nenaddb-mrl5d.mongodb.net/mean-stack?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Connected to database !");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;
