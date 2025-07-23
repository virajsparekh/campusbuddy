const express = require('express');
const auth = require('../middleware/auth');
const { requirePremium } = require('../middleware/authorization');
const router = express.Router();

router.get('/', auth, requirePremium, (req, res) => {
  res.json({ msg: 'Welcome to premium events!' });
});

module.exports = router; 