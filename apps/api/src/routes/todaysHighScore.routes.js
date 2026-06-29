const express = require('express');
const router = express.Router();
const { db } = require('../services/firebaseAdmin');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET /api/today-high-score
router.get('/', verifyToken, async (req, res) => {
  try {
    const querySnapshot = await db.collection('todaysHighScore').limit(1).get();
    
    if (querySnapshot.empty) {
      return res.json({ 
        success: true, 
        data: null 
      });
    }

    const doc = querySnapshot.docs[0];
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error('Error fetching today high score:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/today-high-score (ADMIN)
router.put('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { gameId, score } = req.body;
    
    // Fetch game details to get name and imageUrl
    const gameDoc = await db.collection('games').doc(gameId).get();
    if (!gameDoc.exists) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }
    
    const gameData = gameDoc.data();
    
    const newFeatured = {
      gameId,
      gameName: gameData.name,
      imageUrl: gameData.imageUrl,
      score: Number(score),
      updatedAt: new Date().toISOString()
    };
    
    // Check if we already have a record
    const querySnapshot = await db.collection('todaysHighScore').limit(1).get();
    
    if (querySnapshot.empty) {
      // Create new
      await db.collection('todaysHighScore').add(newFeatured);
    } else {
      // Update existing
      const docId = querySnapshot.docs[0].id;
      await db.collection('todaysHighScore').doc(docId).update(newFeatured);
    }
    
    res.json({ success: true, data: newFeatured });
  } catch (error) {
    console.error('Error setting today high score:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
