import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCourseSubscriptions,
  createCourseSubscription,
  updateCourseSubscription,
  deleteCourseSubscription,
} from '../services/courseSubscriptions';

export const useCourseSubscriptions = (courseId) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['courseSubscriptions', courseId],
    queryFn: () => getCourseSubscriptions(courseId),
    enabled: !!token,
    retry: false,
  });
};

export const useCreateCourseSubscription = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseSubscription,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['courseSubscriptions'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateCourseSubscription = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCourseSubscription(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['courseSubscriptions'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeleteCourseSubscription = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseSubscription,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['courseSubscriptions'] }),
    enabled: !!token,
    retry: false,
  });
};
