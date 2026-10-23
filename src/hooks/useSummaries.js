import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSummaries,
  createSummary,
  updateSummary,
  deleteSummary,
} from '../services/summaries';

export const useSummaries = (topicId) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['summaries', topicId],
    queryFn: () => getSummaries(topicId),
    enabled: !!token,
    retry: false,
  });
};

export const useCreateSummary = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSummary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['summaries'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateSummary = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSummary(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['summaries'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeleteSummary = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSummary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['summaries'] }),
    enabled: !!token,
    retry: false,
  });
};
