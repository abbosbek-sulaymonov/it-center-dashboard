import { apiClient } from './client.js';

export const bookApi = {
  list: (params) => apiClient.get('/books', { params }),
  categories: () => apiClient.get('/books/categories'),
  detail: (id) => apiClient.get(`/books/${id}`),
  create: (payload) => apiClient.post('/books', payload),
  update: (id, payload) => apiClient.patch(`/books/${id}`, payload),
  remove: (id) => apiClient.delete(`/books/${id}`),
};
