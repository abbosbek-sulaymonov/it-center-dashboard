import { apiClient } from './client.js';

export const statsApi = {
  adminOverview: () => apiClient.get('/stats/overview'),
};
