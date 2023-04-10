const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    index: true,
    min: [2, "Minmum 2 Character"],
    max: [25, "Maximum 25 Character"],
  },
  lastname: {
    type: String,
    required: true,
    index: true,
    min: [2, "Too few eggs"],
    max: [25, "Maximum 25 Character"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    min: [7, "Minimum 7 digit"],
    max: [15, "Minimum 15 digit"],
  },
  password: {
    type: String,
    required: true,
    min: [6, "Minmum 6 Character"],
    max: [25, "Maximum 25 Character"],
  },
});

//Export the model
module.exports = mongoose.model("user", userSchema);
