import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface Recommendation {
  gameId: string;
  reason: string;
}

export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Recommendation[] }>('/ai/recommendations');
      return data;
    },
  });
}

export function useGenerateSummary() {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await api.post<{ data: { summary: string } }>('/ai/summary', { sessionId });
      return data.summary;
    },
  });
}
