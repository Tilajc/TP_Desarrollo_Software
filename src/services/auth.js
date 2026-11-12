import apiFetch from '../lib/api';

export const login = async (email, password, turnstileToken) => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, turnstileToken }),
  });
};

export const getMe = async () => {
  return apiFetch('/auth/me');
};

export const updateMe = async (userData) => {
  return apiFetch('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};
