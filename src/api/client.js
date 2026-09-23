
const BASE_URL = 'https://dummyjson.com';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue, réessayez.');
  }

  return data;
}
