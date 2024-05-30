const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
const twilio = require('twilio');
dotenv.config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Middleware to verify token and get user ID
const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified; // Add the user ID to the request object
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};


// Route to get the current user
router.get('/me', verifyToken, async (req, res) => {
  console.log('Fetching user with ID:', req.user._id);
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }
    console.log('User found:', user);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(400).send('Invalid Token');
  }
});




// Route to send OTP for signup and login
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOTP();

  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log('Twilio response:', message);

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber, otp });
    } else {
      user.otp = otp;
    }
    await user.save();

    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Route to verify OTP for login
router.post('/verify-login-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  console.log(`Received phone number: ${phoneNumber}, OTP: ${otp}`);
  try {
    const user = await User.findOne({ phoneNumber });
    console.log('User found:', user);
    if (user && user.otp === otp) {
      user.otp = undefined; // Clear the OTP field
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header('auth-token', token).json({ token, user });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('Error verifying login OTP:', err);
    res.status(500).json({ message: err.message });
  }
});

// Route to update profile
router.put('/update-profile', verifyToken, async (req, res) => {
  const { username, bio, dob } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.dob = dob || user.dob;
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Failed to update profile', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
