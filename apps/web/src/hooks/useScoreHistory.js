import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { MOCK_SCORE_HISTORY } from '../data/mockGames';

export function useScoreHistory(gameId) {
  return useQuery({
    queryKey: ['scoreHistory', gameId],
    enabled: Boolean(gameId),
    queryFn: async () => {
      try {
        const res = await api.get('/api/scores/history', { gameId });
        if (res?.data?.length) {
          return res.data.map((s) => ({ date: s.playedAt, score: s.score }));
        }
        return MOCK_SCORE_HISTORY[gameId] || [];
      } catch {
        return MOCK_SCORE_HISTORY[gameId] || [];
      }
    },
  });
}
