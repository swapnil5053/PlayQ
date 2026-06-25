const express = require('express');
const router = express.Router();
const { db, admin } = require('../services/firebaseAdmin');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

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
router.post('/join', verifyToken, async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user.uid;
    const displayName = req.user.name || 'Player';

    const queueRef = db.collection('queues').doc(gameId).collection('entries');
    
    // Check if already in queue
    const existing = await queueRef.where('userId', '==', userId).get();
    if (!existing.empty) {
      return res.status(409).json({ success: false, error: 'Already in queue' });
    }

    // Get current queue length
    const allEntries = await queueRef.get();
    const queueLength = allEntries.size + 1; // including new user
    const position = queueLength; // newly joined goes to end

    await queueRef.add({
      userId,
      displayName,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'waiting',
      position
    });

    const estimatedWaitMinutes = await getWaitTime(gameId, queueLength);

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

    const queueRef = db.collection('queues').doc(gameId).collection('entries');
    const existing = await queueRef.where('userId', '==', userId).get();
    
    if (existing.empty) {
      return res.status(404).json({ success: false, error: 'User not in queue' });
    }

    const userEntry = existing.docs[0].data();
    
    const allEntries = await queueRef.get();
    const queueLength = allEntries.size;
    const estimatedWaitMinutes = await getWaitTime(gameId, userEntry.position);

    res.json({ 
      success: true, 
      data: { 
        position: userEntry.position, 
        queueLength, 
        estimatedWaitMinutes, 
        status: userEntry.status 
      } 
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

    const queueRef = db.collection('queues').doc(gameId).collection('entries');
    const existing = await queueRef.where('userId', '==', userId).get();

    if (existing.empty) {
      return res.json({ success: true, message: 'Not in queue' });
    }

    const docToDelete = existing.docs[0];
    const leftPosition = docToDelete.data().position;

    // Batch to delete and update positions
    const batch = db.batch();
    batch.delete(docToDelete.ref);

    // Get all others to recalculate
    const others = await queueRef.where('position', '>', leftPosition).get();
    others.docs.forEach(doc => {
      batch.update(doc.ref, { position: doc.data().position - 1 });
    });

    await batch.commit();

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
