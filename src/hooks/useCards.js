import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from '../services/cards';

export const useCards = (topicId) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['cards', topicId],
    queryFn: () => getCards(topicId),
    enabled: !!token,
    retry: false,
  });
};

export const useCreateCard = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateCard = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCard(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeleteCard = () => {
  const token = localStorage.getItem('token');

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
    enabled: !!token,
    retry: false,
  });
};
