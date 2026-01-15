import service from '../utils/axiosRequest';

export function getEndUsers(data) {
  return service({
    url: '/users/end-users',
    method: 'get',
    params: { ...data, soft_deleted: false },
  });
}

export function getOrders(data) {
  return service({
    url: '/orders',
    method: 'get',
    params: { ...data, soft_deleted: false },
  });
}
export function refundRequest(id, data) {
  return service({
    url: `/orders/payment-refund/${id}`,
    method: 'patch',
    data,
  });
}

export function assignInstaller(id, data) {
  return service({
    url: `/orders/assign-installer/${id}`,
    method: 'patch',
    data,
  });
}

export function getInstallationList(data) {
  return service({
    url: '/orders/installation-list',
    method: 'get',
    params: { ...data, soft_deleted: false },
  });
}

export function updateInstallationStatus(id, data) {
  // {
  //     "installation_status": "not_started"
  //   }
  return service({
    url: `/orders/installation-status/${id}`,
    method: 'patch',
    data,
  });
}

export function updateInstallationReport(id, data) {
  // {
  //     "text": "22",
  //     "isInstaller": true,
  //     "time": "2024-10-14 10:00"
  //   }
  return service({
    url: `/orders/report/${id}`,
    method: 'patch',
    data,
  });
}

export function getAllCity(data) {
  return service({
    url: '/orders/get-city',
    method: 'get',
    params: data,
  });
}

export function getPaymentMethods(data) {
  return service({
    url: `/orders/payment-method/${data?.customer_id}`,
    method: 'get',
  });
}

export function activeSubscriptions(data) {
  return service({
    url: `/orders/extend-subscription`,
    method: 'post',
    data,
  });
}
