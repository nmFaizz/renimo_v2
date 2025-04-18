
import axios, { AxiosResponse, AxiosError } from 'axios';
import { getToken } from '@/lib/cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RENIMO_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken("renimo_token"); 
    if (token) {
        if (config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized. Maybe token expired.');
          break;
        case 403:
          console.warn('Forbidden.');
          break;
        default:
          console.error(`API error: ${error.message}`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
