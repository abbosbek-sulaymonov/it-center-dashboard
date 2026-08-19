import { apiClient } from './client.js';

export const studentApi = {
  list: (params) => apiClient.get('/students', { params }),
  groups: () => apiClient.get('/students/groups'),
  detail: (id) => apiClient.get(`/students/${id}`),
  create: (payload) => apiClient.post('/students', payload),
  update: (id, payload) => apiClient.patch(`/students/${id}`, payload),
  remove: (id) => apiClient.delete(`/students/${id}`),

  myEnrollments: (params) => apiClient.get('/students/me/enrollments', { params }),
  myStats: () => apiClient.get('/students/me/stats'),
};
