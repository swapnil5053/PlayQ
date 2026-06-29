const express = require('express');
const router = express.Router();
const { db, admin } = require('../services/firebaseAdmin');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const { queues } = require('../socket/queueHandler');

// Helper to calculate wait time
const getWaitTime = async (gameId, queueLength) => {
  const gameDoc = await db.collection('games').doc(gameId).get();
  if (!gameDoc.exists) return 0;
  const game = gameDoc.data();
  if (game.manualWaitOverride !== null && game.manualWaitOverride !== undefined) {
    return game.manualWaitOverride;
  }
  return Math.round((game.baseWaitMinutes || 5) * (queueLength * 0.7));
};

// POST /api/queue/join
// Reads the real in-memory queue (shared with the Socket.IO queueHandler) to
// estimate this user's position. The actual queue membership is established
// moments later when the frontend's useQueueSocket hook mounts and emits
// `join_queue_room` -- that's what authoritatively pushes the entry and
// drives all subsequent real-time `queue_updated` broadcasts.
router.post('/join', verifyToken, async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user.uid;

    if (!queues[gameId]) queues[gameId] = [];
    const queue = queues[gameId];

    const existingIndex = queue.findIndex((e) => e.userId === userId);
    const position = existingIndex !== -1 ? existingIndex + 1 : queue.length + 1;
    const queueLength = existingIndex !== -1 ? queue.length : queue.length + 1;
    const estimatedWaitMinutes = Math.max(1, (position - 1) * 4);

    res.json({ success: true, data: { position, queueLength, estimatedWaitMinutes } });
  } catch (error) {
    console.error('Error joining queue:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/queue/:gameId
router.get('/:gameId', verifyToken, async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.uid;

    const queue = queues[gameId] || [];
    const index = queue.findIndex((e) => e.userId === userId);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'User not in queue' });
    }

    const position = index + 1;
    const queueLength = queue.length;
    const estimatedWaitMinutes = Math.max(1, (position - 1) * 4);

    res.json({
      success: true,
      data: { position, queueLength, estimatedWaitMinutes, status: 'waiting' }
    });
  } catch (error) {
    console.error('Error getting queue status:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/queue/leave
router.post('/leave', verifyToken, async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user.uid;

    const queue = queues[gameId] || [];
    const idx = queue.findIndex((e) => e.userId === userId);
    if (idx !== -1) queue.splice(idx, 1);

    res.json({ success: true });
  } catch (error) {
    console.error('Error leaving queue:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/queue/all-status (ADMIN)
router.get('/all-status/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const gamesSnapshot = await db.collection('games').get();
    
    const queuesPromises = gamesSnapshot.docs.map(async (gameDoc) => {
      const gameId = gameDoc.id;
      const gameData = gameDoc.data();
      const entries = await db.collection('queues').doc(gameId).collection('entries').get();
      const queueLength = entries.size;
      const estimatedWait = await getWaitTime(gameId, queueLength);
      
      return {
        gameId,
        gameName: gameData.name,
        queueLength,
        estimatedWait
      };
    });

    const result = await Promise.all(queuesPromises);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting all queue statuses:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/queue/:gameId (ADMIN)
router.delete('/:gameId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    const entries = await db.collection('queues').doc(gameId).collection('entries').get();
    
    const batch = db.batch();
    entries.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    res.json({ success: true, message: 'Queue cleared' });
  } catch (error) {
    console.error('Error clearing queue:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/queue/:gameId/wait-time (ADMIN)
router.put('/:gameId/wait-time', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { overrideMinutes } = req.body;
    
    await db.collection('games').doc(gameId).update({
      manualWaitOverride: overrideMinutes === null ? null : Number(overrideMinutes)
    });
    
    res.json({ success: true, message: 'Wait time overridden' });
  } catch (error) {
    console.error('Error overriding wait time:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
