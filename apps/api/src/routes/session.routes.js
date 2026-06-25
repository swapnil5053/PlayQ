const express = require('express');
const router = express.Router();
const { db } = require('../services/firebaseAdmin');
const verifyToken = require('../middleware/verifyToken');

// GET /api/session/summary
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const summaryId = `${userId}_${dateStr}`;
    
    const summaryDoc = await db.collection('sessionSummaries').doc(summaryId).get();
    
    if (!summaryDoc.exists) {
      return res.json({ 
        success: true, 
        data: { gamesPlayed: 0, bestScore: 0, totalTimeMinutes: 0 } 
      });
    }

    res.json({ success: true, data: summaryDoc.data() });
  } catch (error) {
    console.error('Error fetching session summary:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
