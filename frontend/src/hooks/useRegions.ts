import { useQuery } from '@tanstack/react-query';
import type {
  RegionalBreakdown,
  CountryBreakdown,
  CityBreakdown,
} from '../types';
import { api } from '../lib/api';

// Fetch list of regions
export function useRegionsList() {
  return useQuery<string[]>({
    queryKey: ['regions', 'list'],
    queryFn: () => api.get<string[]>('/regions/list'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch list of countries (optionally filtered by region)
export function useCountriesList(region?: string) {
  return useQuery<string[]>({
    queryKey: ['regions', 'countries-list', region],
    queryFn: () => {
      const endpoint = region 
        ? `/regions/countries-list?region=${encodeURIComponent(region)}`
        : '/regions/countries-list';
      return api.get<string[]>(endpoint);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch regional breakdown data
export function useRegionalBreakdown() {
  return useQuery<RegionalBreakdown[]>({
    queryKey: ['regions', 'breakdown'],
    queryFn: () => api.get<RegionalBreakdown[]>('/regions/breakdown'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch country breakdown data
export function useCountryBreakdown(region?: string) {
  return useQuery<CountryBreakdown[]>({
    queryKey: ['regions', 'country-breakdown', region],
    queryFn: () => {
      if (!region) return Promise.resolve([]);
      return api.get<CountryBreakdown[]>(`/regions/countries?region=${encodeURIComponent(region)}`);
    },
    enabled: !!region,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch city breakdown data
export function useCityBreakdown(country?: string) {
  return useQuery<CityBreakdown[]>({
    queryKey: ['regions', 'city-breakdown', country],
    queryFn: () => {
      if (!country) return Promise.resolve([]);
      return api.get<CityBreakdown[]>(`/regions/cities?country=${encodeURIComponent(country)}`);
    },
    enabled: !!country,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

