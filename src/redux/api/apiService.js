import axiosInstance from './request';

/**
 * Generic API handler
 * @param {string} url
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {object} options - { params, data, headers, signal }
 */
export const apiRequest = ({
  url,
  method = 'GET',
  params = {},
  data = {},
  headers = {},
  signal,
}) => {
  return axiosInstance({
    url,
    method,
    params: method === 'GET' ? params : undefined,
    data: method !== 'GET' ? data : undefined,
    headers,
    signal,
  });
};
