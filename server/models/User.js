const mongoose = require("mongoose");

console.log("User model loaded");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  admin: {
    type: Boolean,
    default: false
  }
});

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);