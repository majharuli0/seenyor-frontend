import request from '../utils/axiosRequest';

// Example: Get Countries
export function getAllCountry() {
  return request({
    url: '/countries',
    method: 'get',
  });
}
