const express = require('express');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorization');
const router = express.Router();

router.get('/dashboard', auth, requireAdmin, (req, res) => {
  res.json({ msg: `Welcome, admin ${req.user.name}!` });
});

module.exports = router; 