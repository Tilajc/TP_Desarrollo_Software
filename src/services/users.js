import apiFetch from '../lib/api';

export const getUsers = async () => {
  return apiFetch('/users');
};

export const getUserById = async (id) => {
  return apiFetch(`/users/${id}`);
};

export const createUser = async (userData) => {
  return apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (id, userData) => {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (id) => {
  return apiFetch(`/users/${id}`, {
    method: 'DELETE',
  });
};
