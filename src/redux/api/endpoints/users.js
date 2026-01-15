import { apiRequest } from '../apiService';

export const getUsers = (params) => apiRequest({ url: '/users', method: 'GET', params });
