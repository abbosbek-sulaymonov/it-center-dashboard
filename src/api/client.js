import axios from 'axios';

/**
 * All requests are same-origin: Vite proxies `/api` to the Express server in
 * development, and in production both are served by the same host.
 */
export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Unwraps the `{ success, data, meta }` envelope, and normalises failures into
 * an Error carrying `status`, `message` and field-level `details`.
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const response = error.response;
    const normalized = new Error(response?.data?.message || error.message || 'Network error');
    normalized.status = response?.status ?? 0;
    normalized.details = response?.data?.details ?? null;
    return Promise.reject(normalized);
  },
);
