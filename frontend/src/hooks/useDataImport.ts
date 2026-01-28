import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DataImport, ImportResult, ApiResponse } from '../types';
import { api } from '../lib/api';

// Fetch import history
export function useImportHistory() {
  return useQuery<DataImport[]>({
    queryKey: ['importHistory'],
    queryFn: async () => {
      const response = await api.get<{ history: DataImport[] }>('/data/import-history');
      return response.history || [];
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
      return api.postFormData<ImportResult>('/data/import', formData);
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
    mutationFn: () => api.post<ImportResult>('/scheduler/trigger'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importHistory'] });
    },
  });
}
