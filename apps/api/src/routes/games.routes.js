const express = require('express');
const router = express.Router();
const { db, admin } = require('../services/firebaseAdmin');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Helper to compute wait time
const getComputedWaitTime = (game, queueLength) => {
  if (game.manualWaitOverride !== null && game.manualWaitOverride !== undefined) {
    return game.manualWaitOverride;
  }
  return Math.round(game.baseWaitMinutes * (queueLength * 0.7));
};

// GET /api/games
router.get('/', verifyToken, async (req, res) => {
  try {
    const gamesSnapshot = await db.collection('games').where('isAvailable', '==', true).get();
    
    const gamesPromises = gamesSnapshot.docs.map(async (doc) => {
      const gameData = doc.data();
      const gameId = doc.id;
      
      // Fetch queue length
      const queueEntries = await db.collection('queues').doc(gameId).collection('entries').get();
      const queueLength = queueEntries.size;
      
      return {
        id: gameId,
        ...gameData,
        queueLength,
        computedWaitMinutes: getComputedWaitTime(gameData, queueLength)
      };
    });
    
    const games = await Promise.all(gamesPromises);
    res.json({ success: true, data: games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/games/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const gameDoc = await db.collection('games').doc(req.params.id).get();
    if (!gameDoc.exists) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }
    
    const gameData = gameDoc.data();
    const queueEntries = await db.collection('queues').doc(gameDoc.id).collection('entries').get();
    const queueLength = queueEntries.size;
    
    res.json({
      success: true,
      data: {
        id: gameDoc.id,
        ...gameData,
        queueLength,
        computedWaitMinutes: getComputedWaitTime(gameData, queueLength)
      }
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/games (ADMIN)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl, difficulty, genre, baseWaitMinutes, rating } = req.body;
    
    const newGame = {
      name,
      description,
      imageUrl,
      difficulty,
      genre,
      baseWaitMinutes: Number(baseWaitMinutes) || 5,
      rating: Number(rating) || 0,
      isFeatured: false,
      isAvailable: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      manualWaitOverride: null
    };
    
    const docRef = await db.collection('games').add(newGame);
    res.status(201).json({ success: true, data: { id: docRef.id, ...newGame } });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/games/:id (ADMIN)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updates = req.body;
    await db.collection('games').doc(req.params.id).update(updates);
    res.json({ success: true, message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/games/:id (ADMIN)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const gameId = req.params.id;
    // Delete game
    await db.collection('games').doc(gameId).delete();
    
    // Delete queue entries for this game
    const queueEntries = await db.collection('queues').doc(gameId).collection('entries').get();
    const batch = db.batch();
    queueEntries.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    // Delete queue doc itself
    batch.delete(db.collection('queues').doc(gameId));
    await batch.commit();
    
    res.json({ success: true, message: 'Game and its queues deleted' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
