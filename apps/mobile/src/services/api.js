import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:4000/api';

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };
  
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const api = {
  get: async (endpoint) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'API Error');
    return data.data;
  },
  
  post: async (endpoint, body) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'API Error');
    return data.data;
  },
  
  put: async (endpoint, body) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'API Error');
    return data.data;
  },
  
  delete: async (endpoint) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'API Error');
    return data.data;
  }
};
