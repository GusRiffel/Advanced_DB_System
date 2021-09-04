const express = require("express");

const userController = require("../controllers/user");

const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.get("/join", (req, res) => {
  res.render("create-user", { errors: "" });
});
router.get("/login", (req, res) => {
  res.render("login-user", { message: "" });
});
router.get("/logout", async (req, res) => {
  req.session.destroy();
  global.loggedUser = false;
  res.redirect("/");
});
router.get("/hero-schedule", authMiddleware, userController.list);

router.post("/login-user", userController.login);
router.post("/create-user", userController.create);
router.post("/users/schedule/cancel/:id", userController.delete);

module.exports = router;
