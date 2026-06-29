import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { MOCK_GAMES, getGameById } from '../data/mockGames';

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/games');
        if (res?.data?.length) return res.data;
        return MOCK_GAMES;
      } catch {
        return MOCK_GAMES;
      }
    },
  });
}

export function useGameDetails(gameId) {
  return useQuery({
    queryKey: ['game', gameId],
    enabled: Boolean(gameId),
    queryFn: async () => {
      try {
        const res = await api.get(`/api/games/${gameId}`);
        if (res?.data) return res.data;
        return getGameById(gameId);
      } catch {
        return getGameById(gameId);
      }
    },
  });
}
