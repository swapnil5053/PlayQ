const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// GET /api/auth/verify-admin
router.get('/verify-admin', verifyToken, (req, res) => {
  // Check req.user.admin custom claim
  const isAdmin = req.user.admin === true;
  res.json({ success: true, data: { isAdmin } });
});

module.exports = router;
