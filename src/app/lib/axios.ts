// lib/axiosClient.ts
import axios from 'axios';

const API_URL = process.env.API_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Optional: Add response interceptor to handle auth errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
