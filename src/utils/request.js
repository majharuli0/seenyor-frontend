import axios from 'axios';
import toast from 'react-hot-toast';

import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';

import { getToken, removeToken } from './auth';
import cache from './cache';
import { tansParams } from './comFunction';

// Control whether to show re-login prompt
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// Create an axios instance
const service = axios.create({
  // Base URL for requests
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // Request timeout
  timeout: 10000,
});

// Request interceptor
service.interceptors.request.use(
  (config) => {
    // Check if token is needed
    const isToken = (config.headers || {}).isToken === false;
    // Check if repeat submission prevention is needed
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;

    if (getToken() && !isToken && !config.url.includes('screen')) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // Attach token to request
    }

    // Map GET request parameters
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }

    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime(),
      };
      const sessionObj = cache.session.getJSON('sessionObj');
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj);
      } else {
        const s_url = sessionObj.url; // Previous request URL
        const s_data = sessionObj.data; // Previous request data
        const s_time = sessionObj.time; // Previous request time
        const interval = 1000; // Interval time (ms), requests within this time are considered duplicates
        if (
          s_data === requestObj.data &&
          requestObj.time - s_time < interval &&
          s_url === requestObj.url
        ) {
          const message = 'Data is being processed, please do not submit again';
          console.warn(`[${s_url}]: ` + message);
          // return Promise.reject(new Error(message));
        } else {
          cache.session.setJSON('sessionObj', requestObj);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  (res) => {
    // Check for forced logout condition in success response (if status is 200 but body contains error code)
    if (res.data.status === 440 && res.data.forceLoggedOut === true) {
      removeToken();
      return Promise.reject('Session expired. Please log in again.');
    }

    // Default success status if not set
    const code = res.data.code || '00000';
    // Get error message
    const msg = res.data.msg || '';

    // Directly return binary data
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data;
    }

    if (code === 401) {
      // Prompt user to re-login if session is invalid
      return Promise.reject('Invalid session or session has expired, please re-login.');
    } else if (code === '00000') {
      return res.data;
    } else {
      // Show custom error toast
      return res.data;
    }
  },
  (error) => {
    // Check for forced logout condition in error response (if status is non-2xx)
    if (error.response?.data?.status === 440 && error.response?.data?.forceLoggedOut === true) {
      removeToken();
      return Promise.reject(error);
    }

    // Display custom error toast for response errors
    let msg = error.response?.data?.msg;
    toast.custom((t) => <CustomErrorToast t={t} text={msg} title={'Error'} />);
    return Promise.reject(error);
  }
);

export default service;
