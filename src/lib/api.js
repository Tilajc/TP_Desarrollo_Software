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
    throw new Error('Por favor, inicia sesión nuevamente.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la petición');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default apiFetch;
