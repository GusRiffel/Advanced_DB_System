const mongoose = require("mongoose");
const { Schema } = mongoose;

const parkSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Park name is required"],
    },
    postcode: {
      type: String,
      required: [true, "Post code is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    participants: [{}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Park", parkSchema);
