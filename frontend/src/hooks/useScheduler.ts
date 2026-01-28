import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SchedulerStatus, SchedulerConfig } from '../types';
import { api } from '../lib/api';

// Fetch scheduler status
export function useSchedulerStatus() {
  return useQuery<SchedulerStatus>({
    queryKey: ['schedulerStatus'],
    queryFn: () => api.get<SchedulerStatus>('/scheduler/status'),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// Start scheduler
export function useStartScheduler() {
  const queryClient = useQueryClient();

  return useMutation<any, Error>({
    mutationFn: () => api.post<any>('/scheduler/start'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulerStatus'] });
    },
  });
}

// Stop scheduler
export function useStopScheduler() {
  const queryClient = useQueryClient();

  return useMutation<any, Error>({
    mutationFn: () => api.post<any>('/scheduler/stop'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulerStatus'] });
    },
  });
}

// Update scheduler configuration
export function useUpdateSchedulerConfig() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, SchedulerConfig>({
    mutationFn: (config: SchedulerConfig) => api.post<any>('/scheduler/config', config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulerStatus'] });
    },
  });
}
