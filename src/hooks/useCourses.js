import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../services/courses';

export const useCourses = (filters = {}, enabled = true) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getCourses(filters),
    enabled: !!token && enabled,
    retry: false,
  });
};

export const useCourse = (id) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['courses', 'detail', id],
    queryFn: () => getCourseById(id),
    enabled: !!token && !!id,
    retry: false,
  });
};

export const useCreateCourse = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateCourse = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCourse(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeleteCourse = () => {
  const token = localStorage.getItem('token');

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
    enabled: !!token,
    retry: false,
  });
};
