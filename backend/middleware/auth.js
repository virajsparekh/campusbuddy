const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Try to get token from x-auth-token header first, then from Authorization header
  let token = req.header('x-auth-token');
  
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }
  
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: 'User not found' });
    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 