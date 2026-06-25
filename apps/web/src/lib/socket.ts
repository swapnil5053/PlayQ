import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

let socket: Socket | null = null;

export const initSocket = () => {
  if (socket) return socket;

  const token = useAuthStore.getState().accessToken;
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

  socket = io(socketUrl, {
    auth: token ? { token } : {},
    autoConnect: true, // auto-connect so queue watching works immediately
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connect error:', err.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) return initSocket();
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { token: useAuthStore.getState().accessToken };
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
