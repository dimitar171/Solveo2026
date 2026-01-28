import { useQuery } from '@tanstack/react-query';
import type { ExecutiveSummary, TrendData, FunnelData } from '../types';
import { API_BASE_URL } from '../config';

// Fetch executive summary
export function useExecutiveSummary() {
  return useQuery<ExecutiveSummary>({
    queryKey: ['executiveSummary'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/metrics/summary`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      const result: any = await response.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch trend data
export function useTrends(metric: string = 'mrr', period: number = 12) {
  return useQuery<TrendData[]>({
    queryKey: ['trends', metric, period],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/metrics/trends?metric=${metric}&period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch trends');
      const result: any = await response.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch funnel data
export function useFunnel(month?: string) {
  return useQuery<FunnelData>({
    queryKey: ['funnel', month],
    queryFn: async () => {
      const url = month 
        ? `${API_BASE_URL}/metrics/funnel?month=${month}`
        : `${API_BASE_URL}/metrics/funnel`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch funnel data');
      const result: any = await response.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch available months
export function useAvailableMonths() {
  return useQuery<string[]>({
    queryKey: ['availableMonths'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/metrics/months`);
     if (!response.ok) throw new Error('Failed to fetch months');
      const result: any = await response.json();
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
