import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHints,
  createHint,
  updateHint,
  deleteHint,
} from '../services/hints';

export const useHints = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['hints'],
    queryFn: getHints,
    enabled: !!token,
    retry: false,
  });
};

export const useCreateHint = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHint,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hints'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateHint = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateHint(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hints'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeleteHint = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHint,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hints'] }),
    enabled: !!token,
    retry: false,
  });
};
