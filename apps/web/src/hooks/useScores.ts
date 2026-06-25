import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface Score {
  id: string;
  userId: string;
  gameId: string;
  value: number;
  rank?: number;
  isPersonalBest: boolean;
  playedAt: string;
}

export function useScores(gameId?: string) {
  return useQuery({
    queryKey: ['scores', gameId],
    queryFn: async () => {
      const { data } = await api.get<{ data: Score[] }>('/scores', {
        params: { gameId },
      });
      return data;
    },
    refetchInterval: 15000, // refresh every 15s
  });
}

export function useSubmitScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameId, value }: { gameId: string; value: number }) => {
      const { data } = await api.post<{ data: Score & { previousBest?: number } }>('/scores', { gameId, value });
      return data;
    },
    onSuccess: (_, { gameId }) => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', gameId] });
    },
  });
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  userId: string;
}

export function useLeaderboard(gameId: string) {
  return useQuery({
    queryKey: ['leaderboard', gameId],
    queryFn: async () => {
      const { data } = await api.get<{ data: LeaderboardEntry[] }>(`/scores/leaderboard/${gameId}`);
      return data;
    },
    enabled: !!gameId,
    refetchInterval: 8000, // refresh every 8s for live leaderboard
  });
}
