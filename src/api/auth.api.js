import { apiClient } from './client.js';

export const authApi = {
  signup: (payload) => apiClient.post('/auth/signup', payload),
  login: (payload) => apiClient.post('/auth/login', payload),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
  updateProfile: (payload) => apiClient.patch('/auth/me', payload),
  changePassword: (payload) => apiClient.post('/auth/me/password', payload),
};
