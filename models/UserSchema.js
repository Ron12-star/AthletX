const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//this function is used for create schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    // Add the role field
    type: String,
    enum: ["user", "vendor"], // Restrict roles to 'user' or 'vendor'
    required: true,
  },
  name: { type: String },
  phone: { type: String },
  location: { type: String },
  image: { type: String },
});

//export user model
const User = mongoose.model("User", UserSchema);
module.exports = User;
