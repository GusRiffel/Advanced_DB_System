const Taster = require("../models/Taster"); // importing model Taster

exports.list = async (req, res) => {
  // method to list taster
  try {
    // using try and catch to handle exceptions
    console.log(req.query); // logging query to find out what is the value of it
    const message = req.query.message; // storing the message available on our query into a variable
    const tasters = await Taster.find({}); // locating all tasters inside our DB, * using async await
    res.render("tasters", { tasters: tasters, message: message }); // rendering view tasters.ejs and passing tasters and message by parameter
  } catch (e) {
    // using catch if errors
    res.status(404).send({ message: "could not list tasters" }); // populating error with some message to the user
  }
};

exports.create = async (req, res) => {
  // method to create a new taster in our DB
  try {
    const taster = new Taster({
      name: req.body.name,
      twitter: req.body.twitter,
    }); // creating new Taster object providing the required information in  Model schema
    await taster.save(); // saving it in our DB
    res.redirect("/tasters/?message=taster has been created"); // redirecting to tasters and appending a message with some feedback
  } catch (e) {
    if (e.errors) {
      // checking if the error comes from the input
      console.log(e.errors);
      res.render("create-taster", { errors: e.errors }); // re-rendering page and displaying the error on the respective input
      return;
    }
    return res.status(400).send({
      // returning feed that something went wrong with the server
      message: JSON.parse(e), // using parse to interpretate JSON file with the error coming from the server and storing it in message.
    });
  }
};

exports.delete = async (req, res) => {
  // method to delete a specific taster in our DB
  const id = req.params.id; // requesting the ID from our parameters
  try {
    await Taster.findByIdAndRemove(id); // using built in function to find the user with the corresponding id and delete it
    res.redirect("/tasters"); // redirecting the website back to the tasters controller which will execute .list method and show us all the tasters again
  } catch (e) {
    res.status(404).send({ // status 404 to inform that the connection was successful, but couldnt find the register
      message: `could not delete  record ${id}.`, // In case of error, returning a messa to the user with the provided ID
    });
  }
};

exports.edit = async (req, res) => { // fetching the inputs which the user wants to update
  const id = req.params.id;
  try {
    const taster = await Taster.findById(id); // using the built in function (findById) from our model to find the taster with the corresponding ID.
    res.render("update-taster", { taster: taster, id: id }); // rendering the found result, with taster object and id
  } catch (e) {
    res.status(404).send({
      message: `could find taster ${id}.`, // sending message in case the taster is not found
    });
  }
};

exports.update = async (req, res) => { // updating the taster in our DB witht the new infomation providaded by the user on edit
  const id = req.params.id;
  try {
    await Taster.updateOne({ _id: id }, req.body);  // updating the information saved in our db with the built in function ( updateOne ) with the id and the NEW body
    res.redirect("/tasters/?message=taster has been updated"); // render the tasters list again, with a successful message
  } catch (e) {
    res.status(404).send({
      message: `could find taster ${id}.`,
    });
  }
};
