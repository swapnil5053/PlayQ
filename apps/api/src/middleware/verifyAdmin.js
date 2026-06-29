const verifyAdmin = (req, res, next) => {
  // req.user is set by verifyToken middleware
  if (!req.user || req.user.admin !== true) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

module.exports = verifyAdmin;
