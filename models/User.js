const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  phoneNumber: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  otp: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: '',
  },
  dob: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model('User', UserSchema);
