require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { WEB_PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { userNewUrlPArser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
  );
  process.exit();
});

app.use(express.static(path.join(__dirname, "public")));

const tasterController = require("./controllers/taster");
app.get("/tasters", tasterController.list);
app.get("/tasters/delete/:id", tasterController.delete);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(WEB_PORT, () => {
  console.log(`Example app listening at http://localhost:${WEB_PORT}`);
});
