import request from '../utils/request';

export function byElder(data) {
  return request({
    url: '/boot/active/web/recent/all/active?priority=' + data,
    method: 'post',
  });
}

export function alertHistory(data) {
  data;

  return request({
    url: `/boot/active/active/list/by/elder/summary`,
    method: 'post',
    data,
  });
}

export function recentMedication(data) {
  return request({
    url: `/boot/medication/web/calender/list?date=${data.dateInfo}`,
    method: 'post',
    data,
  });
}

export function userGetById(data) {
  return request({
    url: `/admin/user/getById?userId=${data.id}`,
    method: 'post',
  });
}

export function selfList(data) {
  return request({
    url: `/boot/room/web/self/list`,
    method: 'post',
    data,
  });
}

export function restPassword(data) {
  //重置密码
  return request({
    url: '/admin/user/reset-password',
    method: 'post',
    data,
  });
}

export function shortSearch(name) {
  //重置密码
  return request({
    url: `/boot/elder/web/short/search?name=${name}`,
    method: 'post',
  });
}

export function indexLati(name) {
  //重置密码
  return request({
    url: `/boot/elder/index/lati`,
    method: 'post',
  });
}

export function allElderlyList(data = {}) {
  return request({
    url: `/boot/elder/profile/list`,
    method: 'post',
    data,
  });
}

export function allElderProfile() {
  //查询数据库总老人
  return request({
    url: `/boot/elder/queryAllElderProfile`,
    method: 'get',
  });
}

export function allElderProfilePage(data) {
  //查询数据库总老人
  let url = '';
  if (data.type) {
    if (data.type === 1) url = '/boot/elder/profile/queryProfileWithAlerts';
    else if (data.type === 2) url = '/boot/elder/profile/queryProfileWithDiseases';
    else if (data.type === 3) url = '/boot/elder/profile/queryProfileWithMedications';
    else if (data.type === 4) url = '/boot/elder/profile/queryProfileWithAllergies';
    else if (data.type === 5) url = '/boot/elder/profile/queryElderProfileStatusForPage';

    return request({
      url: url,
      method: 'post',
      data,
    });
  } else {
    return request({
      url: `/boot/elder/queryAllElderProfilePage?current=${data.current}&size=10`,
      method: 'get',
    });
  }
}
