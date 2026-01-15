// request.js
import * as Sentry from '@sentry/react';
import axios from 'axios';
import toast from 'react-hot-toast';

import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';

import { getToken, removeToken } from './auth';
// Create an Axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_V1 + '/api/v1',
  timeout: 60000,
  // headers: {
  //   "Content-Type": "application/json;charset=utf-8",
  // },
});

// Request interceptor to add the token
service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Network speed check
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        toast.custom(
          (t) => (
            <CustomErrorToast
              t={t}
              title='Network Warning'
              text='Your connection is very slow, try a different network'
            />
          ),
          {
            id: 'slow-network-toast', // Prevent duplicates
          }
        );
      }
    }

    return config;
  },
  (error) => {
    Sentry.addBreadcrumb({
      category: 'xhr',
      message: `API Failed: ${error.message}`,
      level: 'error',
      data: {
        url: error.config?.url,
        timeout: error.config?.timeout, // Will show 20000 or 60000
        code: error.code, // ECONNABORTED
      },
    });
    return Promise.reject(error);
  }
);

// // Response interceptor to handle responses and errors
// service.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     console.error(
//       "API Request failed:",
//       error.response?.data?.message || error.message
//     );
//     return Promise.reject(error);
//   }
// Response interceptor to handle responses and errors
// Response interceptor to handle responses and errors
service.interceptors.response.use(
  (res) => {
    // Check for forced logout condition in success response (if status is 200 but body contains error code)
    if (res.data.status === 440 && res.data.forceLoggedOut === true) {
      removeToken();
      return Promise.reject('Session expired. Please log in again.');
    }
    return res.data;
  },
  (error) => {
    // Check for forced logout condition in error response (if status is non-2xx)
    if (error.response?.data?.status === 440 && error.response?.data?.forceLoggedOut === true) {
      removeToken();
      return Promise.reject(error);
    }

    // Handle other types of errors (e.g., API errors)
    console.error('API Request failed:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);
export default service;
