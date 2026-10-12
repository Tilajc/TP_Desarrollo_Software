import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from '../services/cards';

export const useCards = (topicId) => {
  return useQuery({
    queryKey: ['cards', topicId],
    queryFn: () => getCards(topicId),
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCard(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });
};
