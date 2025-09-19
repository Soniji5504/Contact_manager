import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) => 
    api.post('/users/register', userData),
  login: (credentials: { email: string; password: string }) => 
    api.post('/users/login', credentials),
  getCurrentUser: () => api.get('/users/current'),
};

// Contacts API calls
export const contactsAPI = {
  getAll: () => api.get('/contacts'),
  create: (contactData: { name: string; email: string; phone: string }) => 
    api.post('/contacts', contactData),
  getById: (id: string) => api.get(`/contacts/${id}`),
  update: (id: string, contactData: { name: string; email: string; phone: string }) => 
    api.put(`/contacts/${id}`, contactData),
  delete: (id: string) => api.delete(`/contacts/${id}`),
};

export default api;