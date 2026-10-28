import apiFetch from '../lib/api';

export const getCards = async (topicId, { authorId, subjectId } = {}) => {
  const params = new URLSearchParams();
  if (topicId) params.set('topicId', topicId);
  if (authorId) params.set('authorId', authorId);
  if (subjectId) params.set('subjectId', subjectId);
  const query = params.toString();
  return apiFetch(`/cards${query ? `?${query}` : ''}`);
};

export const createCard = async (cardData) => {
  return apiFetch('/cards', {
    method: 'POST',
    body: JSON.stringify(cardData),
  });
};

export const updateCard = async (id, cardData) => {
  return apiFetch(`/cards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cardData),
  });
};

export const deleteCard = async (id) => {
  return apiFetch(`/cards/${id}`, {
    method: 'DELETE',
  });
};
