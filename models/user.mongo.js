const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  dateOfBirth: Date,
});

const user = mongoose.model("User", userSchema);

module.exports = user;
