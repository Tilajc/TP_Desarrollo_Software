import apiFetch from '../lib/api';

export const getCourseSubscriptions = async (courseId) => {
  const query = courseId ? `?courseId=${courseId}` : '';
  return apiFetch(`/course-subscriptions${query}`);
};

export const createCourseSubscription = async (subscriptionData) => {
  return apiFetch('/course-subscriptions', {
    method: 'POST',
    body: JSON.stringify(subscriptionData),
  });
};

export const updateCourseSubscription = async (id, subscriptionData) => {
  return apiFetch(`/course-subscriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subscriptionData),
  });
};

export const deleteCourseSubscription = async (id) => {
  return apiFetch(`/course-subscriptions/${id}`, {
    method: 'DELETE',
  });
};
