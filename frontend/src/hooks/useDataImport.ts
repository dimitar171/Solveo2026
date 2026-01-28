import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DataImport, ImportResult, ApiResponse } from '../types';
import { API_BASE_URL } from '../config';

// Fetch import history
export function useImportHistory() {
  return useQuery<DataImport[]>({
    queryKey: ['importHistory'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/data/import-history`);
      if (!response.ok) throw new Error('Failed to fetch import history');
      const data: any = await response.json();
      return data.history || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Upload and import Excel file
export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation<ImportResult, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/data/import`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch import history
      queryClient.invalidateQueries({ queryKey: ['importHistory'] });
    },
  });
}

// Trigger manual import from default file
export function useTriggerImport() {
  const queryClient = useQueryClient();

  return useMutation<ImportResult, Error>({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/scheduler/trigger`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Import failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importHistory'] });
    },
  });
}
