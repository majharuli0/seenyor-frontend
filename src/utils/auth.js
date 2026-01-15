import axios from 'axios';

import { getDeviceId } from './deviceId';
import { clearLocalStorageKeys } from './helper';

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  return localStorage.setItem('token', token);
};

let isLogoutInProgress = false;

export const removeToken = async () => {
  if (isLogoutInProgress) return;
  isLogoutInProgress = true;

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    let deviceId = user?.device_id;

    try {
      const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 2000));
      const devicePoints = await Promise.race([getDeviceId(), timeout]);

      if (devicePoints) deviceId = devicePoints;
    } catch (error) {
      console.error('Device ID fetch failed or timed out:', error);
    }

    try {
      // Use direct axios call to avoid circular dependency with api/login-v1 -> utils/axiosRequest
      const baseURL = import.meta.env.VITE_APP_BASE_API_V1 || '';
      await axios.delete(`${baseURL}/api/v1/auth/logout`, {
        data: { deviceId },
        headers: {
             'Authorization': `Bearer ${getToken()}`
        }
      });
    } catch (apiError) {
      console.error('Logout API failed:', apiError);
    }
  } catch (err) {
    console.error('Unexpected error during logout:', err);
  } finally {
    clearLocalStorageKeys([
      'token',
      'mainRole',
      'role',
      'rootToken',
      'user',
      'elderly_details',
      'sleepData',
    ]);

    isLogoutInProgress = false;

    window.location.href = '/#/';
  }
};
