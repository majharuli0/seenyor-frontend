import request from '../utils/request';

export function useroverViewCount(data) {
  return request({
    url: `/admin/user/overViewCount?id=${data.id}`,
    method: 'post',
    data,
  });
}

export function userGetById(data) {
  return request({
    url: `/admin/user/getById?userId=${data.id}`,
    method: 'post',
    data,
  });
}

export function billCount(data) {
  return request({
    url: `/admin/bill/billCount`,
    method: 'post',
    data,
  });
}

export function billPage(data) {
  return request({
    url: `/admin/bill/page`,
    method: 'post',
    data,
  });
}
