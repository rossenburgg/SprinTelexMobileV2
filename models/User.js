const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String
  },
  username: {
    type: String
  },
  bio: {
    type: String
  },
  dob: {
    type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);
