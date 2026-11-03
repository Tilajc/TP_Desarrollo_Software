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

  let response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (networkError) {
    throw {
      type: 'NETWORK_ERROR',
      message:
        'No se pudo establecer conexión con el servidor. Intente nuevamente mas tarde.',
    };
  }

  if (response.status === 401) {
    localStorage.removeItem('token');
    useLoginStatus.getState().logout();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      type: 'SERVER_RESPONSE_ERROR',
      status: response.status,
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
