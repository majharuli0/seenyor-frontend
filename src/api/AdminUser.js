import ls from 'store2';

import request from '../utils/request';

export function getUserPage(data) {
  return request({
    url: '/admin/user/page',
    method: 'post',
    data,
  });
}

export function addUser(data) {
  data = {
    parentId: ls.get('user')['id'],
    ...data,
  };
  return request({
    url: '/admin/user/insert',
    method: 'post',
    data,
  });
}
export function addUsers(data) {
  return request({
    url: '/boot/elder/profile/web/batchInsert',
    method: 'post',
    data,
  });
}

export function updateUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data,
  });
}

export function updateenldUser(data) {
  return request({
    url: '/boot/elder/profile/web/update',
    method: 'post',
    data,
  });
}

export function resetPassword(data) {
  return request({
    url: '/admin/user/reset-password',
    method: 'post',
    data,
  });
}

export function deletUser(data) {
  return request({
    url: `/admin/user/delete?id=${data.id}`,
    method: 'post',
    data,
  });
}

export function deletElderly(data) {
  return request({
    url: `/boot/elder/profile/del?elderId=${data.id}`,
    method: 'post',
  });
}
