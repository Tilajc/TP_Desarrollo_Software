import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from '../services/topics';

export const useTopics = (subjectId) => {
  return useQuery({
    queryKey: ['topics', subjectId],
    queryFn: () => getTopics(subjectId),
  });
};

export const useTopic = (id) => {
  return useQuery({
    queryKey: ['topics', 'detail', id],
    queryFn: () => getTopicById(id),
  });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTopic,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
  });
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateTopic(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
  });
};
