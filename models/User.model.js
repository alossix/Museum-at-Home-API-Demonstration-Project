const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  favArtist: {
    type: String,
    required: false,
    unique: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;