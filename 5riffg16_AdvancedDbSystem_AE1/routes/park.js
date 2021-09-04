const express = require("express");

const parkController = require("../controllers/park");

const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.get("/create-park", (req, res) => {
  res.render("create-park", { errors: "" });
});
router.get("/parks", authMiddleware, parkController.list);
router.get("/parks/delete/:id", parkController.delete);
router.get("/parks/update/:id", parkController.edit);
router.get("/parks/join/:id", parkController.listParkSelected);

router.post("/create-park", parkController.create);
router.post("/parks/join/:id/:session", parkController.updateParkParticipants);
router.post("/parks/update/:id", parkController.update);

module.exports = router;
