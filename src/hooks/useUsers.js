import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  register,
  updateProfile,
} from '../services/users';

export const useUsers = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: !!token,
    retry: false,
  });
};

export const useCreateUser = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateUser = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useDeleteUser = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    enabled: !!token,
    retry: false,
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useUpdateProfile = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }) => updateProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    enabled: !!token,
    retry: false,
  });
};
