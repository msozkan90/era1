import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3001/api',
});

const eventApi = axios.create({
  baseURL: import.meta.env.VITE_EVENT_API_URL || 'http://localhost:3002/api',
});

authApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

eventApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { authApi, eventApi };