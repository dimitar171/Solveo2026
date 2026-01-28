import { useQuery } from '@tanstack/react-query';
import type { ExecutiveSummary, TrendData, FunnelData } from '../types';
import { api } from '../lib/api';

// Fetch executive summary
export function useExecutiveSummary() {
  return useQuery<ExecutiveSummary>({
    queryKey: ['executiveSummary'],
    queryFn: () => api.get<ExecutiveSummary>('/metrics/summary'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch trend data
export function useTrends(metric: string = 'mrr', period: number = 12) {
  return useQuery<TrendData[]>({
    queryKey: ['trends', metric, period],
    queryFn: () => api.get<TrendData[]>(`/metrics/trends?metric=${metric}&period=${period}`),
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch funnel data
export function useFunnel(month?: string) {
  return useQuery<FunnelData>({
    queryKey: ['funnel', month],
    queryFn: () => {
      const endpoint = month ? `/metrics/funnel?month=${month}` : '/metrics/funnel';
      return api.get<FunnelData>(endpoint);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch available months
export function useAvailableMonths() {
  return useQuery<string[]>({
    queryKey: ['availableMonths'],
    queryFn: () => api.get<string[]>('/metrics/months'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
