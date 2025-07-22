import axios from 'axios';

// Create a custom instance with default settings
const apiClient = axios.create({
  baseURL: useRuntimeConfig().public.apiUrl,
  timeout: 2000, // Request timeout in milliseconds
  headers: {
    'X-API-Secret': useRuntimeConfig().public.apiSecretKey,
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // todo adapt
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Axios request error: ', error);
    return Promise.reject(error);
  },
);

// Example of adding an interceptor for response handling
apiClient.interceptors.response.use(
  (response) => {
    // Process successful responses
    return response;
  },
  (error) => {
    // Handle response errors (e.g., authentication errors, network issues)
    return Promise.reject(error);
  },
);

export default apiClient;
