import apiFetch from '../lib/api';

export const getCourses = async (courseId) => {
  const query = courseId ? `?courseId=${courseId}` : '';
  return apiFetch(`/courses${query}`);
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
