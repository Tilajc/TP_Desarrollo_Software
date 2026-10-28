import apiFetch from '../lib/api';

export const getSummaries = async (topicId, { authorId, subjectId } = {}) => {
  const params = new URLSearchParams();
  if (topicId) params.set('topicId', topicId);
  if (authorId) params.set('authorId', authorId);
  if (subjectId) params.set('subjectId', subjectId);
  const query = params.toString();
  return apiFetch(`/summaries${query ? `?${query}` : ''}`);
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
