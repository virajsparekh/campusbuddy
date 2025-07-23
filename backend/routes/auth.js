const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

function generateId(prefix) {
  return prefix + Math.floor(1000 + Math.random() * 9000);
}

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
  const { email, password, name, role, college } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateId('U');
    const studentId = role === 'student' ? generateId('S') : undefined;
    user = new User({
      userId,
      studentId,
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      isPremium: false,
      isBlocked: false,
      createdAt: new Date(),
      college: college || null
    });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshTokens = [refreshToken];
    await user.save();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ token: accessToken, user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (user.isBlocked) return res.status(403).json({ msg: 'User is blocked' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshTokens.push(refreshToken);
    await user.save();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ token: accessToken, user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ msg: 'No refresh token' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ msg: 'Invalid refresh token' });
    }
    const accessToken = generateAccessToken(user);
    res.json({ token: accessToken });
  } catch (err) {
    res.status(401).json({ msg: 'Invalid or expired refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return res.json({ msg: 'Logged out' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save();
    }
    res.clearCookie('refreshToken');
    res.json({ msg: 'Logged out' });
  } catch (err) {
    res.clearCookie('refreshToken');
    res.json({ msg: 'Logged out' });
  }
});

module.exports = router; 