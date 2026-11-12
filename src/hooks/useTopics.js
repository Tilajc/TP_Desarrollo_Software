import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  getDeletedTopics,
  restoreTopic,
} from '../services/topics';

export const useTopics = (subjectId, enabled = true) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['topics', subjectId],
    queryFn: () => getTopics(subjectId),
    enabled: !!token && enabled,
    retry: false,
  });
};

export const useTopic = (id) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['topics', 'detail', id],
    queryFn: () => getTopicById(id),
    enabled: !!token,
    retry: false,
  });
};

export const useCreateTopic = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTopic,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateTopic = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateTopic(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeleteTopic = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeletedTopics = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['topics', 'deleted'],
    queryFn: getDeletedTopics,
    enabled: !!token,
    retry: false,
  });
};

export const useRestoreTopic = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTopic,
    onSuccess: () => queryClient.invalidateQueries(),
    enabled: !!token,
    retry: false,
  });
};
