/**
 * Socket.IO room logic for live queue updates, backed by a real in-memory
 * ordered queue per game (gameId -> [{ socketId, userId, joinedAt }]).
 * Kept fully separate from the REST queue routes (queue.routes.js) so that
 * the HTTP API keeps working even if no client is connected over sockets --
 * but both now read/write the same shared `queues` store, so position
 * estimates returned by REST stay consistent with what sockets broadcast.
 *
 * Events:
 *  - join_queue_room  { gameId, userId }  -> socket joins room `queue:<gameId>`,
 *                                            entry pushed into the in-memory queue
 *  - leave_queue_room { gameId, userId }  -> socket leaves the room,
 *                                            entry removed from the in-memory queue
 *  - queue_updated     (broadcast)         -> { gameId, position, queueLength, estimatedWaitMinutes }
 *    sent individually to each member of the queue with their own real position.
 */

const queues = {};

function getQueue(gameId) {
  if (!queues[gameId]) queues[gameId] = [];
  return queues[gameId];
}

function broadcastQueueState(io, gameId) {
  const queue = getQueue(gameId);
  queue.forEach((entry, index) => {
    const position = index + 1;
    const queueLength = queue.length;
    const estimatedWaitMinutes = Math.max(1, (position - 1) * 4);
    io.to(entry.socketId).emit('queue_updated', { gameId, position, queueLength, estimatedWaitMinutes });
  });
}

function registerQueueHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join_queue_room', ({ gameId, userId }) => {
      if (!gameId) return;
      const queue = getQueue(gameId);
      const existingIndex = queue.findIndex((e) => e.userId === userId);
      if (existingIndex !== -1) queue.splice(existingIndex, 1);
      queue.push({ socketId: socket.id, userId, joinedAt: Date.now() });

      socket.join(`queue:${gameId}`);
      socket.data.gameId = gameId;
      socket.data.userId = userId;

      broadcastQueueState(io, gameId);
    });

    socket.on('leave_queue_room', ({ gameId, userId }) => {
      if (!gameId) return;
      const queue = getQueue(gameId);
      const idx = queue.findIndex((e) => e.userId === userId || e.socketId === socket.id);
      if (idx !== -1) queue.splice(idx, 1);
      socket.leave(`queue:${gameId}`);
      broadcastQueueState(io, gameId);
    });

    socket.on('disconnect', () => {
      const { gameId } = socket.data || {};
      if (!gameId) return;
      const queue = getQueue(gameId);
      const idx = queue.findIndex((e) => e.socketId === socket.id);
      if (idx !== -1) queue.splice(idx, 1);
      broadcastQueueState(io, gameId);
    });
  });
}

module.exports = { registerQueueHandlers, queues };
