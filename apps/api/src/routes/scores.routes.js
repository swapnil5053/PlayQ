const express = require('express');
const router = express.Router();
const { db, admin } = require('../services/firebaseAdmin');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// POST /api/scores (ADMIN)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { gameId, gameName, playerName, userId, score } = req.body;
    let rank = req.body.rank;

    // Auto calculate rank if not provided
    if (!rank) {
      const higherScores = await db.collection('scores')
        .where('gameId', '==', gameId)
        .where('score', '>', Number(score))
        .get();
      rank = higherScores.size + 1;
    }

    const newScore = {
      gameId,
      gameName,
      playerName,
      userId,
      score: Number(score),
      rank: Number(rank),
      playedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('scores').add(newScore);

    // Update sessionSummaries for today
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const summaryId = `${userId}_${dateStr}`;
    const summaryRef = db.collection('sessionSummaries').doc(summaryId);

    const doc = await summaryRef.get();
    if (doc.exists) {
      const data = doc.data();
      await summaryRef.update({
        gamesPlayed: (data.gamesPlayed || 0) + 1,
        bestScore: Math.max(data.bestScore || 0, Number(score))
      });
    } else {
      await summaryRef.set({
        userId,
        date: dateStr,
        gamesPlayed: 1,
        bestScore: Number(score),
        totalTimeMinutes: 5 // Default per game for now
      });
    }

    res.status(201).json({ success: true, data: newScore });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/scores/history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { gameId } = req.query;
    const userId = req.user.uid;

    if (!gameId) {
      return res.status(400).json({ success: false, error: 'gameId query parameter is required' });
    }

    const historySnapshot = await db.collection('scores')
      .where('userId', '==', userId)
      .where('gameId', '==', gameId)
      .orderBy('playedAt', 'asc')
      .get();

    const scores = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: scores });
  } catch (error) {
    console.error('Error getting score history:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/scores/leaderboard
router.get('/leaderboard', verifyToken, async (req, res) => {
  try {
    const { gameId } = req.query;
    
    if (!gameId) {
      return res.status(400).json({ success: false, error: 'gameId query parameter is required' });
    }

    const leaderboardSnapshot = await db.collection('scores')
      .where('gameId', '==', gameId)
      .orderBy('score', 'desc')
      .limit(10)
      .get();

    const scores = leaderboardSnapshot.docs.map((doc, index) => ({ 
      id: doc.id, 
      computedRank: index + 1,
      ...doc.data() 
    }));
    
    res.json({ success: true, data: scores });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
