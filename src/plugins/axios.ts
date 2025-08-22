import axios from 'axios';
import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtPlugin((_nuxtApp) => {
  const cfg = useRuntimeConfig();
  // uncomment for private tunnel on mobile phone
  // const baseURL = import.meta.client ? '' : cfg.public.apiUrl || 'http://127.0.0.1:8000';

  const axiosInstance = axios.create({
    baseURL: cfg.public.apiUrl,
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
      const respErr = error.response.data?.error;

      if (respErr?.status === 401) {
        useNuxtApp().$toast.error(respErr?.message || 'Authentication failed. Please log in again.');
      }
      else if (respErr?.status === 403) {
        useNuxtApp().$toast.error(respErr?.message || 'You do not have permission to perform this action.');
      }
      else if (respErr?.status === 404) {
        useNuxtApp().$toast.error(respErr?.message || 'Resource not found.');
      }
      else if (respErr?.status === 409) {
        useNuxtApp().$toast.error(respErr?.message || 'Resource conflict.');
      }
      else if (respErr?.status.toString().startsWith('5')) {
        useNuxtApp().$toast.error(respErr?.message || 'Server error. Please try again later.');
      }

      return Promise.reject(error);
    },
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
