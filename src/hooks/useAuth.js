import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, getMe } from '../services/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useGetMe = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });
};
