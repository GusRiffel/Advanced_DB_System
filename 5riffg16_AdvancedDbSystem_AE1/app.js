require("dotenv").config();
const path = require("path");

const moment = require("moment");

const express = require("express");
const expressSession = require("express-session");

const mongoose = require("mongoose");
const { PORT, MONGODB_URI } = process.env;

const User = require("./models/User");
const Park = require("./models/Park");

const userRoutes = require("./routes/user");
const parkRoutes = require("./routes/park");

const app = express();
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.set("useCreateIndex", true);
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});

app.use(
  expressSession({
    secret: "foo barr",
    cookie: { expires: new Date(253402300000000) },
    resave: true,
    saveUninitialized: true,
  })
);

global.loggedUser = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.loggedUser) {
    global.loggedUser = await User.findById(req.session.userID);
  }
  next();
});

app.get("/", async (req, res) => {
  const message = req.query.message;
  const parks = await Park.find({});
  res.render("index", { parks: parks, moment: moment, message: message });
});

app.use(userRoutes);
app.use(parkRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
