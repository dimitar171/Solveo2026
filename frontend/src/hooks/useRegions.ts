import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import type {
  RegionalBreakdown,
  CountryBreakdown,
  CityBreakdown,
} from '../types';

export function useRegionsList() {
  return useQuery<string[]>({
    queryKey: ['regions', 'list'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/regions/list`);
      if (!res.ok) throw new Error('Failed to fetch regions list');
      const json: any = await res.json();
      return json.data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCountriesList(region?: string) {
  return useQuery<string[]>({
    queryKey: ['regions', 'countries-list', region ?? 'all'],
    queryFn: async () => {
      const params = region ? `?region=${encodeURIComponent(region)}` : '';
      const res = await fetch(`${API_BASE_URL}/regions/countries-list${params}`);
      if (!res.ok) throw new Error('Failed to fetch countries list');
      const json: any = await res.json();
      return json.data ?? [];
    },
    enabled: true,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRegionalBreakdown() {
  return useQuery<RegionalBreakdown[]>({
    queryKey: ['regions', 'breakdown'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/regions/breakdown`);
      if (!res.ok) throw new Error('Failed to fetch regional breakdown');
      const json: any = await res.json();
      return json.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCountryBreakdown(region: string | undefined) {
  return useQuery<CountryBreakdown[]>({
    queryKey: ['regions', 'countries-breakdown', region ?? 'none'],
    queryFn: async () => {
      if (!region) return [];
      const res = await fetch(
        `${API_BASE_URL}/regions/countries?region=${encodeURIComponent(region)}`
      );
      if (!res.ok) throw new Error('Failed to fetch country breakdown');
      const json: any = await res.json();
      return json.data ?? [];
    },
    enabled: !!region,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCityBreakdown(country: string | undefined) {
  return useQuery<CityBreakdown[]>({
    queryKey: ['regions', 'cities-breakdown', country ?? 'none'],
    queryFn: async () => {
      if (!country) return [];
      const res = await fetch(
        `${API_BASE_URL}/regions/cities?country=${encodeURIComponent(country)}`
      );
      if (!res.ok) throw new Error('Failed to fetch city breakdown');
      const json: any = await res.json();
      return json.data ?? [];
    },
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  });
}

