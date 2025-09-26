import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', userData),
};

// Sweets API calls
export const sweetsAPI = {
  getAll: () => api.get('/sweets'),
  
  search: (params: { query?: string; category?: string; minPrice?: number; maxPrice?: number }) =>
    api.get('/sweets/search', { params }),
  
  getById: (id: string) => api.get(`/sweets/${id}`),
  
  create: (sweetData: FormData) => api.post('/sweets', sweetData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  update: (id: string, sweetData: FormData) => api.put(`/sweets/${id}`, sweetData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  delete: (id: string) => api.delete(`/sweets/${id}`),
  
  purchase: (id: string, quantity: number = 1) =>
    api.post(`/sweets/${id}/purchase`, { quantity }),
  
  restock: (id: string, quantity: number) =>
    api.post(`/sweets/${id}/restock`, { quantity }),
};

export default api;