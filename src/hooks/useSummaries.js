import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from '../lib/api';

export const useSummaries = (topicId) => {
  return useQuery({
    queryKey: topicId ? ['summaries', topicId] : ['summaries'],
    queryFn: () => {
      const query = topicId ? `?topicId=${topicId}` : '';
      return apiFetch(`/summaries${query}`);
    },
  });
};

export const useCreateSummary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSummary) =>
      apiFetch('/summaries', {
        method: 'POST',
        body: JSON.stringify(newSummary),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });
};

export const useUpdateSummary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiFetch(`/summaries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });
};

export const useDeleteSummary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      apiFetch(`/summaries/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });
};
