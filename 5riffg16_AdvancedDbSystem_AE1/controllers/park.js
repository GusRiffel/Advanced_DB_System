const Park = require("../models/Park");
const User = require("../models/User");

const moment = require("moment");

const handleErrors = require("../utils/handleErrors");

exports.list = async (req, res) => {
  try {
    const message = req.query.message;
    const parks = await Park.find({});
    res.render("parks", { parks: parks, message: message, moment: moment });
  } catch (e) {
    res.status(404).send({ message: "could not list parks" });
  }
};

exports.listParkSelected = async (req, res) => {
  const session = req.session.userID;
  const id = req.params.id;
  const parks = await Park.findById(id);
  res.render("join-meeting", {
    parks: parks,
    id: id,
    sessionId: session,
    moment: moment,
  });
};

exports.create = async (req, res) => {
  try {
    const newPark = new Park({
      name: req.body.name,
      postcode: req.body.postcode,
      date: req.body.date,
      time: req.body.time,
      participants: [],
    });

    // Validating if postcode is already registered

    const parkList = await Park.find({});
    const postcode = newPark.postcode; // Getting the postcode from the new park to validate
    const parkName = await Park.findOne({ postcode: postcode }); // checking if there is park already registered with the postcode

    if (!newPark.name.trim()) {
      res.render("create-park", { errors: "Park name is required" });
      return;
    } else if (!newPark.postcode.trim()) {
      res.render("create-park", { errors: "Postcode is required" });
      return;
    }

    if (
      parkList.some(
        (park) =>
          park.postcode === newPark.postcode &&
          park.name.trim().toUpperCase() !== newPark.name.trim().toUpperCase()
      )
    ) {
      res.render("create-park", {
        errors: `Wrong park name. The postcode ${parkName.postcode} is registered to ${parkName.name}`,
      });
      return;
    }
    if (
      parkList.some(
        (park) =>
          park.postcode === newPark.postcode &&
          moment(park.date).isSame(newPark.date, "day")
      )
    ) {
      res.render("create-park", {
        errors: "This meeting already exits for this date.",
      });
      return;
    }
    if (moment(newPark.date).isBefore(moment(), "day")) {
      res.render("create-park", {
        errors: "New meeting needs to be after today's date.",
      });
      return;
    }

    // End of the validation

    await newPark.save();
    res.redirect("/parks/?message=new meeting has been created");
  } catch (e) {
    // Formatting error messages coming from the Model
    const errors = handleErrors(e);
    if (errors.name) {
      res.render("create-park", { errors: errors.name });
      return;
    } else if (errors.postcode) {
      res.render("create-park", { errors: errors.postcode });
      return;
    } else if (errors.date) {
      res.render("create-park", { errors: errors.date });
      return;
    } else if (errors.time) {
      res.render("create-park", { errors: errors.time });
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Park.findByIdAndRemove(id);
    res.redirect("/parks");
  } catch (e) {
    res.status(404).send({
      message: `could not delete park ${id}.`,
    });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const parks = await Park.findById(id);
    res.render("update-park", {
      parks: parks,
      id: id,
      moment: moment,
      errors: "",
    });
  } catch (e) {
    res.status(404).send({
      message: `could find park ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const url = req.originalUrl;
  try {
    const parkUpdatedInfo = {
      name: req.body.name,
      postcode: req.body.postcode,
      date: req.body.date,
      time: req.body.time,
    };
    if (!parkUpdatedInfo.name.trim()) {
      res.render("update-park", {
        errors: "Park name is required",
        parks: parkUpdatedInfo,
        moment: moment,
      });
      return;
    } else if (!parkUpdatedInfo.postcode.trim()) {
      res.render("update-park", {
        errors: "Postcode is required",
        parks: parkUpdatedInfo,
        moment: moment,
      });
      return;
    }
    if (moment(parkUpdatedInfo.date).isBefore(moment(), "day")) {
      res.render("update-park", {
        errors: "New meeting needs to be after today's date.",
        parks: parkUpdatedInfo,
        moment: moment,
      });
      return;
    }
    await Park.updateOne({ _id: id }, req.body);
    res.redirect("/parks/?message=park has been updated");
  } catch (e) {
    res.status(404).send({
      message: `could not update park ${id}.`,
    });
  }
};

exports.updateParkParticipants = async (req, res) => {
  const id = req.params.id;
  try {
    const session = req.params.session;
    const parkList = await Park.find({});
    const user = await User.findById(session);
    const park = await Park.findById(id);
    let duplicateJoinVal = false;
    park.participants.forEach((participant) => {
      if (participant.username.toUpperCase() === user.username.toUpperCase()) {
        duplicateJoinVal = true;
      }
    });
    if (duplicateJoinVal) {
      res.render("parks", {
        message: "You have already joined this meeting.",
        parks: parkList,
        moment: moment,
      });
      return;
    }

    await Park.updateOne(
      { _id: id },
      {
        $set: {
          participants: [
            ...park.participants,
            { userId: user._id, username: user.username },
          ],
        },
      }
    );
    res.redirect("/parks/?message=You have joined the meeting");
  } catch (e) {
    res.status(404).send({
      message: `could not update park ${id}.`,
    });
  }
};
