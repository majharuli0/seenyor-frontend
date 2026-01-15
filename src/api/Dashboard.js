import request from '../utils/axiosRequest';

export function getUsersCount(data) {
  return request({
    url: '/users/counts',
    method: 'get',
    params: data,
  });
}

export function getSalesReports(data) {
  //Supported Params ===>
  //role , from_date , to_date ,sort_by_sales
  return request({
    url: '/orders/sales-report',
    method: 'get',
    params: data,
  });
}
export function getSalesData(data) {
  return request({
    url: `/orders/agent-sales-report`,
    method: 'get',
    params: data,
  });
}
export function getSalesOverview(data) {
  //Supported Params ===>
  //agent_id , from_date , to_date ,payment_status
  return request({
    url: `/orders/sales-overview`,
    method: 'get',
    params: data,
  });
}
export function getDealDetails(data) {
  //Supported Params ===>
  //agent_id , office_id, from_date , to_date ,payment_status,
  return request({
    url: `/orders`,
    method: 'get',
    params: data,
  });
}
export function getChartByGender() {
  return request({
    url: `/elderly/report/age-range`,
    method: 'get',
  });
}
export function getChartByAge() {
  return request({
    url: `/elderly/report/gender`,
    method: 'get',
  });
}
export function getDiseasesCountByGender() {
  return request({
    url: `/elderly/report/dissess`,
    method: 'get',
  });
}

export function getDeviceSalesCount() {
  return request({
    url: `/orders/report/device`,
    method: 'get',
  });
}

export function getAlertsCountByElderly() {
  return request({
    url: `/alarms/most-alarms`,
    method: 'get',
  });
}
export function getAlertsCountByName() {
  return request({
    url: `/alarms/counts-by-events`,
    method: 'get',
  });
}

export function getElderlyAndDeviceCount(data) {
  return request({
    url: `elderly/report/elderly-device`,
    method: 'get',
    params: data,
  });
}
export function getAlarmCount(data) {
  return request({
    url: `alarms/alarms-count-by-agency`,
    method: 'get',
    params: data,
  });
}
export function getCountStatistics(data) {
  return request({
    url: `alarms/monitoring-statistics`,
    method: 'get',
    params: data,
  });
}
export function getAgentCountStatistics(data) {
  return request({
    url: `alarms/agent-statistics`,
    method: 'get',
    params: data,
  });
}
export function getTotalAlertCounts(data) {
  return request({
    url: `alarms/fall-offline-count`,
    method: 'get',
    params: data,
  });
}
export function getTotalAlertTrends(data) {
  return request({
    url: `alarms/trends`,
    method: 'get',
    params: data,
  });
}

export function getSLAReport(data) {
  return request({
    url: `alarms/sla-compliance`,
    method: 'get',
    params: data,
  });
}
export function getTrueFalseAlertCountByAgent(data) {
  return request({
    url: `alarms/agent-truth-stats`,
    method: 'get',
    params: data,
  });
}

export function getAgentPerformance(data) {
  return request({
    url: `alarms/agent-performance`,
    method: 'get',
    params: data,
  });
}
