import apiFetch from '../lib/api';

export const getSummaries = async (topicId) => {
  const query = topicId ? `?topicId=${topicId}` : '';
  return apiFetch(`/summaries${query}`);
};

export const createSummary = async (summaryData) => {
  return apiFetch('/summaries', {
    method: 'POST',
    body: JSON.stringify(summaryData),
  });
};

export const updateSummary = async (id, summaryData) => {
  return apiFetch(`/summaries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(summaryData),
  });
};

export const deleteSummary = async (id) => {
  return apiFetch(`/summaries/${id}`, {
    method: 'DELETE',
  });
};
