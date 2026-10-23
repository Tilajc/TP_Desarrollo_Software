import useLoginStatus from '../store/useLoginStatus';
const BASE_URL = import.meta.env.VITE_API_URL;

const apiFetch = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem('token');
    useLoginStatus.getState().logout();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.message || 'Error en la petición',
      errors: errorData.errors || [],
    };
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default apiFetch;
