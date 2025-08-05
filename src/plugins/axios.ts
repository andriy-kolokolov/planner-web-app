import axios from 'axios';
import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtPlugin((_nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: useRuntimeConfig().public.apiUrl,
    timeout: 2000, // Request timeout in milliseconds
    headers: {
      'X-API-Secret': useRuntimeConfig().public.apiSecretKey,
    },
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
