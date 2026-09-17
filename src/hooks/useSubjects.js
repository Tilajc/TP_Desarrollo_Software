import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../services/subjects';

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSubject(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
  });
};
