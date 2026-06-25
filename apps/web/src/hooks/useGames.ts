import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  rating: number;
  avgScore: number;
  currentPlayers: number;
  estimatedWaitMin: number;
  crowdLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  queueCapacity: number;
  category: { id: string; name: string; slug: string; icon: string };
}

export function useGames(crowdLevel?: string) {
  return useQuery({
    queryKey: ['games', crowdLevel],
    queryFn: async () => {
      const { data } = await api.get<{ data: Game[] }>('/games', {
        params: { crowdLevel },
      });
      return data;
    },
  });
}

export function useGame(id: string) {
  return useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Game }>(`/games/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
