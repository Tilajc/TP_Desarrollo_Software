import apiFetch from '../lib/api';

export const getSubjects = async () => {
  return apiFetch('/subjects');
};

export const getSubjectById = async (id) => {
  return apiFetch(`/subjects/${id}`);
};

export const createSubject = async (subjectData) => {
  return apiFetch('/subjects', {
    method: 'POST',
    body: JSON.stringify(subjectData),
  });
};

export const updateSubject = async (id, subjectData) => {
  return apiFetch(`/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subjectData),
  });
};

export const deleteSubject = async (id) => {
  return apiFetch(`/subjects/${id}`, {
    method: 'DELETE',
  });
};
