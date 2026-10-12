import apiFetch from '../lib/api';

export const getCards = async (topicId) => {
  const query = topicId ? `?topicId=${topicId}` : '';
  return apiFetch(`/cards${query}`);
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
