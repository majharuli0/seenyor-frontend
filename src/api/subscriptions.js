import service from '../utils/axiosRequest';

export function getSubscriptionDetails(data) {
  return service({
    url: `/stripe/subscription-status/${data?.id}`,
    method: 'get',
    cancelToken: data.cancelToken,
  });
}
export function cancelSubscription(data) {
  return service({
    url: `/stripe/cancel-subscription`,
    method: 'post',
    cancelToken: data.cancelToken,
    data,
  });
}
export function getSubscriptions(data) {
  return service({
    url: `/subscriptions`,
    method: 'get',
    params: {
      ...data,
      soft_deleted: false,
    },
  });
}
export function getPaymentHistory(data) {
  return service({
    url: `/payments-history`,
    method: 'get',
    params: {
      ...data,
      soft_deleted: false,
    },
  });
}
