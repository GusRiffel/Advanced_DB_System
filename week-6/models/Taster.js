const mongoose = require("mongoose"); // importing mongoose to help create a schema and also adding another layer of communication between the app and the server
const { Schema } = mongoose; // import the Schema function from mongoose.

const tasterSchema = new Schema( // denifing a new schema to make sure that the user input matches our required data format
  { // defining the properties of our tasterSchema
    twitter: String,
    tastings: { type: Number, default: 0 },
    name: { type: String, required: [true, 'Name is required'], minlength: [3, "Name must be 4 chars long"] }, // using some validation features on the fly, to make it easier to handle exceptions
  },
  { timestamps: true } // storing data and time of the operation
);

module.exports = mongoose.model("Taster", tasterSchema); // exporting the model to be used in another places in our code

