module.exports = {
  requireAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only.' });
    }
    next();
  },
  requireNotBlocked: (req, res, next) => {
    if (req.user.isBlocked) {
      return res.status(403).json({ msg: 'You are blocked. Please contact the team.' });
    }
    next();
  },
  requirePremium: (req, res, next) => {
    if (!req.user.isPremium) {
      return res.status(403).json({ msg: 'Buy a subscription to access this feature.' });
    }
    next();
  }
}; 