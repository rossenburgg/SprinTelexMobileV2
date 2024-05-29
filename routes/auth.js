const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
const twilio = require('twilio');
dotenv.config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Existing send-otp route for signup
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log('Twilio response:', message);

    // Save OTP to the database (in a real app, you'd use a more secure method)
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber, otp });
    } else {
      user.otp = otp;
    }
    await user.save();

    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: err.message });
  }
});

// Route to send OTP for login
router.post('/send-login-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(`Received phone number for OTP: ${phoneNumber}`);
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log('Twilio response:', message);

    user.otp = otp;
    await user.save();

    res.status(200).json({ message: 'OTP sent for login' });
  } catch (err) {
    console.error('Error sending login OTP:', err);
    res.status(500).json({ message: err.message });
  }
});

// Existing verify-otp route for signup
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (user && user.otp === otp) {
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header('auth-token', token).json({ token, user });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: err.message });
  }
});

// Route to verify login OTP
router.post('/verify-login-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  console.log(`Received phone number: ${phoneNumber}, OTP: ${otp}`);
  try {
    const user = await User.findOne({ phoneNumber });
    console.log('User found:', user);
    if (user && user.otp === otp) {
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

router.put('/update-profile', async (req, res) => {
  const { userId, username, phoneNumber, bio, dob } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username || user.username;
    user.phoneNumber = phoneNumber || user.phoneNumber;
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
