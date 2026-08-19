import { apiClient } from './client.js';

export const enrollmentApi = {
  list: (params) => apiClient.get('/enrollments', { params }),
  create: (payload) => apiClient.post('/enrollments', payload),
  update: (id, payload) => apiClient.patch(`/enrollments/${id}`, payload),
  cancel: (id) => apiClient.delete(`/enrollments/${id}`),
};
