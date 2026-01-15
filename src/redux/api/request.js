import axios from 'axios';
import toast from 'react-hot-toast';

import { getToken } from '../../utils/auth';

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_V1 + '/api/v1',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;

    if (status === 401) {
      toast.error('Session expired. Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default instance;
