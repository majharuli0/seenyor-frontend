import service from '../utils/axiosRequest';

//get alert list
export function getAlertList(data) {
  return service({
    url: '/alarms',
    method: 'get',
    params: { ...data },
  });
}
export function getAlertLogs(id) {
  return service({
    url: `/alarms/${id}`,
    method: 'get',
  });
}

//mark as resolved alert
export function markAsResolved(data) {
  return service({
    url: `/alarms/${data.id}/resolve`,
    method: 'patch',
    data: data.data,
  });
}

//add event

export function addEvent(data) {
  return service({
    url: '/events',
    method: 'post',
    data: data,
  });
}
//get event list

export function getEventList(data) {
  return service({
    url: '/events',
    method: 'get',
    params: { ...data },
  });
}

//update event
export function updateEvent(data) {
  return service({
    url: `/events/${data.id}`,
    method: 'patch',
    data: data.data,
  });
}

//add emergency contact number

export function addEmergencyContactNumber(data) {
  return service({
    url: `/elderly/${data?.id}/emergency-contacts`,
    method: 'patch',
    data: data.data,
  });
}
export function sendPushNotification(data) {
  return service({
    url: `/alarms/send-push-notifications/${data?.id}`,
    // url: `/alarms/push-notifications/${data?.id}`,
    method: 'patch',
    data: data.data,
  });
}
export function sendSMS(data) {
  return service({
    url: `/alarms/sms/${data?.id}`,
    method: 'patch',
    data: data.data,
  });
}
export function chnagePickedStatus(id) {
  return service({
    url: `/alarms/${id}/picked_by`,
    method: 'patch',
  });
}
export function setAlertLog(data) {
  return service({
    url: `/alarms/${data.id}/action-log`,
    method: 'patch',
    data: data.data,
  });
}

//delete emergency contact number

export function deleteEmergencyContactNumber(data) {
  return service({
    url: `/elderly/${data?.id}/emergency-contacts/${data.emergencyContactId}`,
    method: 'delete',
  });
}

//get alerts overview graph

export function getAlertsOverviewGraph(data) {
  return service({
    url: '/alarms/overview',
    method: 'get',
    params: { ...data },
  });
}
export function getPerformance(data) {
  return service({
    url: '/alarms/performance',
    method: 'get',
    params: { ...data },
  });
}

//get chat list
export function getChatList(data) {
  return service({
    url: '/chats',
    method: 'get',
    params: { ...data },
  });
}

//get trends report
export function getTrendsReport(data) {
  return service({
    url: '/sleep/trends-report',
    method: 'get',
    params: { ...data },
  });
}
