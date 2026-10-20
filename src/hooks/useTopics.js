import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from '../services/topics';

export const useTopics = (subjectId) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['topics', subjectId],
    queryFn: () => getTopics(subjectId),
    enabled: !!token,
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
