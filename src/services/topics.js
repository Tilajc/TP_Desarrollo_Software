import apiFetch from '../lib/api';

export const getTopics = async (subjectId) => {
  const query = subjectId ? `?subjectId=${subjectId}` : '';
  return apiFetch(`/topics${query}`);
};

export const getTopicById = async (id) => {
  return apiFetch(`/topics/${id}`);
};

export const createTopic = async (topicData) => {
  return apiFetch('/topics', {
    method: 'POST',
    body: JSON.stringify(topicData),
  });
};

export const updateTopic = async (id, topicData) => {
  return apiFetch(`/topics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(topicData),
  });
};

export const deleteTopic = async (id) => {
  return apiFetch(`/topics/${id}`, {
    method: 'DELETE',
  });
};
