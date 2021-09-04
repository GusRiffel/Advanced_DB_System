require("dotenv").config(); // setting up enviroment to work with the DB. (Db name, Db URL)
const express = require("express"); // requiring express to help us work with http requests
const path = require("path"); // module used for handling and transforming file paths.
const mongoose = require("mongoose"); // importing mongoose
const chalk = require("chalk"); // used to give a dynamic feed back about the api status. Example red X, green ticks
const User = require("./models/User");
const expressSession = require("express-session");

/**
 * Controllers (route handlers).
 */
const tasterController = require("./controllers/taster");
const tastingController = require("./controllers/tasting");
const userController = require("./controllers/user");

const app = express();
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { WEB_PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressSession({
    secret: "foo barr",
    cookie: { expires: new Date(253402300000000) },
  })
);

global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
});

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect("/");
  }
  next();
};

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/join", (req, res) => {
  res.render("create-user"), { errors: {} };
});
app.get("/login", (req, res) => {
  res.render("login-user");
});

app.get("/create-taster", authMiddleware, (req, res) => {
  res.render("create-taster", { errors: {} });
});

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect("/");
});

app.get("/tasters", tasterController.list);
app.get("/tasters/delete/:id", tasterController.delete);
app.get("/tasters/update/:id", tasterController.edit);

app.get("/tastings", tastingController.list);
app.get("/tastings/delete/:id", tastingController.delete);

app.post("/tasters/update/:id", tasterController.update);

app.post("/create-user", userController.create);

app.post("/create-taster", tasterController.create);

app.post("/login-user", userController.login);

app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
  );
});
