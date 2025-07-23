const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/profile', auth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/dashboard', auth, (req, res) => {
  res.json({ msg: `Welcome, user ${req.user.name}!` });
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, college } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (college) user.college = college;
    await user.save();
    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'User route is working!' });
});

module.exports = router; 