import apiFetch from '../lib/api';

export const getCourses = async ({ authorId, subjectId } = {}) => {
  const params = new URLSearchParams();
  if (authorId) params.set('authorId', authorId);
  if (subjectId) params.set('subjectId', subjectId);
  const query = params.toString();
  return apiFetch(`/courses${query ? `?${query}` : ''}`);
};

export const getCourseById = async (id) => {
  return apiFetch(`/courses/${id}`);
};

export const createCourse = async (courseData) => {
  return apiFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
};

export const updateCourse = async (id, courseData) => {
  return apiFetch(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
};

export const deleteCourse = async (id) => {
  return apiFetch(`/courses/${id}`, {
    method: 'DELETE',
  });
};
