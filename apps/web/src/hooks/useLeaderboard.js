import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { MOCK_LEADERBOARD } from '../data/mockGames';

export function useLeaderboard(gameId) {
  return useQuery({
    queryKey: ['leaderboard', gameId],
    enabled: Boolean(gameId),
    queryFn: async () => {
      try {
        const res = await api.get('/api/scores/leaderboard', { gameId });
        if (res?.data?.length) {
          return res.data.map((s) => ({ userId: s.userId, name: s.playerName, score: s.score }));
        }
        return MOCK_LEADERBOARD[gameId] || [];
      } catch {
        return MOCK_LEADERBOARD[gameId] || [];
      }
    },
  });
}
