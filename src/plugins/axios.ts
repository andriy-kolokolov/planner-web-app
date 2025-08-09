import axios from 'axios';
import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtPlugin((_nuxtApp) => {
  const cfg = useRuntimeConfig();
  const baseURL = import.meta.client ? '' : cfg.public.apiUrl || 'http://127.0.0.1:8000';

  const axiosInstance = axios.create({
    baseURL,
    timeout: 5000, // Request timeout in milliseconds
    headers: {
      [cfg.public.apiSecretHeaderName || 'X-API-Secret']: cfg.public.apiSecretKey || '',
    },
    withCredentials: false, // you're using Bearer, not cookies
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const auth = useAuthStore().getAuthData();
      if (auth) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      return config;
    },
    (error) => {
      console.error('Axios request error: ', error);
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      // Process successful responses
      return response;
    },
    (error) => {
      // Handle response errors (e.g., authentication errors, network issues)
      return Promise.reject(error);
    },
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
