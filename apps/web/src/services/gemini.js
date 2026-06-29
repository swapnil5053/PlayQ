import { api } from './api';

/**
 * Talks to the Express backend's Gemini-backed concierge route
 * (apps/api/src/routes/concierge.routes.js -> POST /api/concierge/chat).
 * The backend already has a smart mock fallback baked in, so this resolves
 * even when no GEMINI_API_KEY / Firebase session is configured locally.
 */
export async function sendConciergeMessage(message, history = []) {
  try {
    const res = await api.post('/api/concierge/chat', { message, history });
    return res?.data?.text || "Ask me about queues, games, or your stats.";
  } catch {
    return mockConciergeReply(message);
  }
}

function mockConciergeReply(message) {
  const msg = message.toLowerCase();
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hey! What do you feel like playing today?";
  }
  if (msg.includes('game') || msg.includes('play')) {
    return 'Dragon Strike VR and Rhythm Beat are the most popular right now.';
  }
  if (msg.includes('wait') || msg.includes('queue') || msg.includes('time')) {
    return "Pretty chill right now -- Basketball Pro's wide open, Zombie Survival's about 20 minutes.";
  }
  if (msg.includes('map') || msg.includes('where')) {
    return 'Check the Map tab -- Dragon Strike VR is in Zone A, Zombie Survival is in Zone C.';
  }
  return "I'm Glitch -- ask me about queues, games, or your stats.";
}
