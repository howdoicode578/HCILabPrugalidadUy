const mongoose = require("mongoose");

// 🔍 DEBUG LINE (temporary)
console.log("User model loaded");

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true
  },
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
  mongoose.models.User || mongoose.model("User", userSchema);