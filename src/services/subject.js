import apiFetch from '../lib/api';

export const getSubjects = async () => {
  return apiFetch('/subjects');
};
