import { apiClient } from './client.js';

export const courseApi = {
  list: (params) => apiClient.get('/courses', { params }),
  categories: () => apiClient.get('/courses/categories'),
  detail: (id) => apiClient.get(`/courses/${id}`),
  create: (payload) => apiClient.post('/courses', payload),
  update: (id, payload) => apiClient.patch(`/courses/${id}`, payload),
  remove: (id) => apiClient.delete(`/courses/${id}`),
};
