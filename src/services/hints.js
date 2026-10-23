import apiFetch from '../lib/api';

export const getHints = async (cardId) => {
  const query = cardId ? `?cardId=${cardId}` : '';
  return apiFetch(`/hints${query}`);
};

export const getHintById = async (id) => {
  return apiFetch(`/hints/${id}`);
};

export const createHint = async (hintData) => {
  return apiFetch('/hints', {
    method: 'POST',
    body: JSON.stringify(hintData),
  });
};

export const updateHint = async (id, hintData) => {
  return apiFetch(`/hints/${id}`, {
    method: 'PUT',
    body: JSON.stringify(hintData),
  });
};

export const deleteHint = async (id) => {
  return apiFetch(`/hints/${id}`, {
    method: 'DELETE',
  });
};
