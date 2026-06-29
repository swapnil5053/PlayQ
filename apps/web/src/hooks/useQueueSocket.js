import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAppStore } from '../store/useAppStore';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Joins the Socket.IO room for a given game's queue and keeps Zustand's
 * queueState in sync with `queue_updated` broadcasts from the backend
 * (apps/api/src/socket/queueHandler.js). If no socket server is reachable
 * (e.g. local demo without the API running), the hook fails silently and
 * the screen continues to work off the position set at join time.
 */
export function useQueueSocket(gameId, userId) {
  const setQueueState = useAppStore((s) => s.setQueueState);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!gameId) return undefined;

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], reconnectionAttempts: 3 });
    socketRef.current = socket;

    socket.emit('join_queue_room', { gameId, userId });

    socket.on('queue_updated', (payload) => {
      // payload: { gameId, position, queueLength, estimatedWaitMinutes }
      if (payload.gameId && payload.gameId !== gameId) return;
      setQueueState({
        position: payload.position,
        queueLength: payload.queueLength,
        estimatedWaitMinutes: payload.estimatedWaitMinutes,
      });
    });

    return () => {
      socket.emit('leave_queue_room', { gameId, userId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [gameId, userId, setQueueState]);

  return socketRef;
}
