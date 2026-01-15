import service from '../utils/axiosRequest';

//get Elderlies
export function getElderlies(data) {
  return service({
    url: '/elderly',
    method: 'get',
    params: { soft_deleted: false, ...data },
  });
}
export function updateElderlies(id, data) {
  return service({
    url: `/elderly/${id}`,
    method: 'patch',
    data: data,
  });
}
export function getElderliesPriority(data) {
  return service({
    url: '/elderly/alarms-priority',
    method: 'get',
    params: { ...data },
  });
}
export function getElderliesPriorityList(data) {
  return service({
    url: '/elderly/elderly-priority-list',
    method: 'get',
    params: { ...data },
  });
}
//get details
export function getDetails(data) {
  return service({
    url: `/elderly/${data.id}`,
    method: 'get',
    params: { ...data },
  });
}
//update Diseases
export function updateDiseases(data) {
  return service({
    url: `/elderly/${data.id}`,
    method: 'patch',
    data: data.data,
  });
}
//add comments
export function addComments(data) {
  return service({
    url: `/elderly/${data.id}/comments`,
    method: 'patch',
    data: data?.data,
  });
}
//delete Comments
export function deleteComments(data) {
  return service({
    url: `/elderly/${data.id}/comments/${data.commentId}`,
    method: 'delete',
  });
}

//add medication
export function addMedication(data) {
  return service({
    url: `elderly/${data.id}/medications`,
    method: 'patch',
    data: data?.data[0],
  });
}
//delete medication
export function deleteMedication(data) {
  return service({
    url: `elderly/${data.id}/medications/${data.medicationId}`,
    method: 'delete',
  });
}

export function getEnvironmentImages(data) {
  return service({
    url: `/elderly/file-info/${data.elderly_id}/${data.room_id}`,
    method: 'get',
  });
}
export function getDeviceReports(data) {
  return service({
    url: `elderly/report/device-report`,
    method: 'get',
    params: data,
  });
}
export function getAllUIDs(data) {
  return service({
    url: `devices/user`,
    method: 'get',
    params: data,
  });
}
export function getaAlarmLogs(data) {
  return service({
    url: `alarms/logs`,
    method: 'get',
    params: data,
  });
}
export function readAlarm(id) {
  return service({
    url: `/alarms/${id}/read`,
    method: 'patch',
  });
}
export function deleteElderly(id) {
  return service({
    url: `/elderly/${id}`,
    method: 'delete',
  });
}
export function getaAlarmsState(data) {
  return service({
    url: `alarms/counts`,
    method: 'get',
    params: data,
  });
}
export function getCriticalAlarmCount(data) {
  return service({
    url: `/alarms/risk-score`,
    method: 'get',
    params: data,
  });
}
export function getShiftSummary(data) {
  return service({
    url: `/alarms/shift-summary`,
    method: 'get',
    params: data,
  });
}
export function getResponseTimeAnalysis(data) {
  return service({
    url: `/alarms/shift-analytics`,
    method: 'get',
    params: data,
  });
}
export function getVisitLogs(data) {
  return service({
    url: `alarms/visit-logs`,
    method: 'get',
    params: data,
  });
}
export function getaAlarmsLogsDetails(id, data) {
  return service({
    url: `/alarms/logs-before-resolve/${id}`,
    method: 'get',
    params: data,
  });
}
export function getReviews(data) {
  return service({
    url: `/elderly/rooms-review`,
    method: 'get',
    params: data,
  });
}
export function chnageReviewStatus(data, elderly_id, room_id) {
  return service({
    url: `/elderly/${elderly_id}/rooms/${room_id}`,
    method: 'patch',
    data,
  });
}
export function requestChnage(data, elderly_id, room_id) {
  return service({
    url: `/elderly/${elderly_id}/rooms-review/${room_id}`,
    method: 'patch',
    data,
  });
}
export function addEnvironmentImages(data) {
  return service({
    url: `/elderly/upload-object/${data.elderly_id}/${data.room_id}`,
    method: 'post',
    data: data.file,
  });
}
export function getElderlyList(data) {
  return service({
    url: `/elderly/list`,
    method: 'get',
    params: data,
  });
}
