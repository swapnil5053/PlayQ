import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';

export interface QueuePosition {
  id: string;
  userId: string;
  position: number;
  status: string;
  user: { displayName: string; avatarUrl: string | null };
}

export interface Queue {
  id: string;
  gameId: string;
  maxCapacity: number;
  currentLength: number;
  avgTurnMinutes: number;
  positions: QueuePosition[];
}

export function useQueue(gameId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!gameId) return;

    const socket = getSocket();
    socket.emit('queue:subscribe', { gameId });

    const handleUpdate = (data: { gameId: string; currentLength: number; maxCapacity: number }) => {
      if (data.gameId === gameId) {
        queryClient.invalidateQueries({ queryKey: ['queue', gameId] });
      }
    };

    socket.on('queue:update', handleUpdate);

    return () => {
      socket.off('queue:update', handleUpdate);
      socket.emit('queue:unsubscribe', { gameId });
    };
  }, [gameId, queryClient]);

  return useQuery({
    queryKey: ['queue', gameId],
    queryFn: async () => {
      const { data } = await api.get<{ data: Queue }>(`/queues/${gameId}`);
      return data;
    },
    enabled: !!gameId,
    refetchInterval: 3000, // Poll every 3 seconds as fallback to socket
  });
}

export function useLeaderboard(gameId: string) {
  return useQuery({
    queryKey: ['leaderboard', gameId],
    queryFn: async () => {
      const { data } = await api.get<{ data: any[] }>(`/scores/leaderboard/${gameId}`);
      return data;
    },
    enabled: !!gameId,
    refetchInterval: 10000, // refresh every 10s
  });
}

export function useJoinQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      const { data } = await api.post<{ data: QueuePosition }>(`/queues/${gameId}/join`);
      return data;
    },
    onSuccess: (_, gameId) => {
      queryClient.invalidateQueries({ queryKey: ['queue', gameId] });
    },
  });
}

export function useLeaveQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      await api.post(`/queues/${gameId}/leave`);
    },
    onSuccess: (_, gameId) => {
      queryClient.invalidateQueries({ queryKey: ['queue', gameId] });
    },
  });
}
