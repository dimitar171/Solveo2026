import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SchedulerStatus, SchedulerConfig } from '../types';
import { API_BASE_URL } from '../config';

// Fetch scheduler status
export function useSchedulerStatus() {
  return useQuery<SchedulerStatus>({
    queryKey: ['schedulerStatus'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/scheduler/status`);
      if (!response.ok) throw new Error('Failed to fetch scheduler status');
      const data: any = await response.json();
      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// Start scheduler
export function useStartScheduler() {
  const queryClient = useQueryClient();

  return useMutation<any, Error>({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/scheduler/start`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to start scheduler');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulerStatus'] });
    },
  });
}

// Stop scheduler
export function useStopScheduler() {
  const queryClient = useQueryClient();

  return useMutation<any, Error>({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/scheduler/stop`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to stop scheduler');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulerStatus'] });
    },
  });
}

// Update scheduler configuration
export function useUpdateSchedulerConfig() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, SchedulerConfig>({
    mutationFn: async (config: SchedulerConfig) => {
      const response = await fetch(`${API_BASE_URL}/scheduler/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Failed to update configuration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulerStatus'] });
    },
  });
}
