import service from '../utils/axiosRequest';

export function getDeals(data) {
  return service({
    url: '/deals',
    method: 'get',
    params: { ...data },
  });
}
export function getDealById(data) {
  return service({
    url: `/deals/${data.id}`,
    method: 'get',
  });
}
export function deleteDeal(data) {
  return service({
    url: `/deals/${data.id}`,
    method: 'delete',
  });
}
export function deleteDevices(data) {
  return service({
    url: `/deals/${data.id}/devices`,
    method: 'patch',
    data: data.data,
  });
}
export function validateDevices(data) {
  return service({
    url: `/deals/validate-uids`,
    method: 'post',
    data: data,
  });
}
export function addNewDeal(data) {
  return service({
    url: `/deals`,
    method: 'post',
    data: data,
  });
}
export function updateDealStatus(data) {
  return service({
    url: `/deals/update-device-status`,
    method: 'patch',
    data: data,
  });
}
