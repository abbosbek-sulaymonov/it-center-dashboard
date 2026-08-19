import { apiClient } from './client.js';

export const tutorApi = {
  list: (params) => apiClient.get('/tutors', { params }),
  detail: (id) => apiClient.get(`/tutors/${id}`),
  create: (payload) => apiClient.post('/tutors', payload),
  update: (id, payload) => apiClient.patch(`/tutors/${id}`, payload),
  remove: (id) => apiClient.delete(`/tutors/${id}`),

  myCourses: (params) => apiClient.get('/tutors/me/courses', { params }),
  myStudents: () => apiClient.get('/tutors/me/students'),
  myStats: () => apiClient.get('/tutors/me/stats'),
};
