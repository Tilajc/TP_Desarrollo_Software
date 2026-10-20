import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../services/subjects';

export const useSubjects = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
    enabled: !!token,
    retry: false,
  });
};

export const useSubject = (id) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['subjects', id],
    queryFn: () => getSubjectById(id),
    enabled: !!token,
    retry: false,
  });
};

export const useCreateSubject = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateSubject = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSubject(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeleteSubject = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
    enabled: !!token,
    retry: false,
  });
};
