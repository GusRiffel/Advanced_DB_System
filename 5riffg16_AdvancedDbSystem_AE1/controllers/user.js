const User = require("../models/User");
const Park = require("../models/Park");

const bcrypt = require("bcrypt");
const moment = require("moment");

const handleErrors = require("../utils/handleErrors");

exports.create = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    if (!user.username.trim()) {
      res.render("create-user", { errors: "Username is required" });
      return;
    } else if (!user.password.trim()) {
      res.render("create-user", { errors: "Password is required" });
      return;
    }
    await user.save();
    res.redirect("/?message=Register successful. Log in now!");
  } catch (e) {
    // Formatting error messages coming from the Model
    const errors = handleErrors(e);
    if (errors.username) {
      res.render("create-user", { errors: errors.username });
      return;
    } else if (errors.email) {
      res.render("create-user", { errors: errors.email });
      return;
    } else if (errors.password) {
      res.render("create-user", { errors: errors.password });
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.render("login-user", {
        message: "Email not found",
      });
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      req.session.userID = user._id;
      res.redirect("/");
      return;
    }

    res.render("login-user", {
      message: "Password does not match",
    });
  } catch (e) {
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
};

exports.list = async (req, res) => {
  try {
    const session = req.session.userID;
    const user = await User.findById(session);
    const parks = await Park.find({
      participants: { $elemMatch: { username: user.username } },
    });
    const message = req.query.message;

    res.render("hero-schedule", {
      parks: parks,
      message: message,
      moment: moment,
    });
  } catch (e) {
    res.status(404).send({ message: "could not list hero-schedule" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const session = req.session.userID;
    const user = await User.findById(session);
    const park = await Park.findById(id);
    await park.updateOne({
      $pull: { participants: { username: user.username } },
    });
    res.redirect("/hero-schedule/?message=Hero Appointment cancelled");
  } catch (e) {
    res.status(404).send({
      message: `could not delete hero appointment ${id}.`,
    });
  }
};
