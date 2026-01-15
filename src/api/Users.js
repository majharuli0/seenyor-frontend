import { demoAgentsList } from '../MonitoringService/data/demoData';
import service from '../utils/axiosRequest';

export function getUser(data) {
  // Mock for Demo: Return demo agents if filtering for them and isDemoMode is true
  if (data?.role === 'monitoring_agent' && data?.isDemoMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: demoAgentsList,
          total: demoAgentsList.length,
          current_page: 1,
          last_page: 1,
          per_page: 15,
        });
      }, 500);
    });
  }

  // Remove isDemoMode from params before sending to API
  const { isDemoMode, ...params } = data || {};

  return service({
    url: '/users',
    method: 'get',
    params: { soft_deleted: false, ...params },
    cancelToken: data.cancelToken,
  });
}

export function getUserDetails(data) {
  return service({
    url: `/users/${data.id}`,
    method: 'get',
    params: data.params,
  });
}
export function getDeletedUser(data) {
  return service({
    url: '/users',
    method: 'get',
    params: { ...data, soft_deleted: true },
  });
}
export function getUserToken(data) {
  return service({
    url: `/auth/token/${data.id}`,
    method: 'get',
    params: data.params,
  });
}
export function getLogins(data) {
  return service({
    url: `/user-sessions`,
    method: 'get',
    params: data,
  });
}

export function getAgent(data) {
  return service({
    url: '/users/agents',
    method: 'get',
    params: { ...data, soft_deleted: false },
  });
}

export function assignUsers(data) {
  return service({
    url: '/users/assign',
    method: 'patch',
    data,
  });
}
export function dismissAssignedUsers(id) {
  return service({
    url: `/users/dismiss/${id}`,
    method: 'patch',
  });
}
export function getAssignedUser(id, data) {
  return service({
    url: `/users/${id}`,
    method: 'get',
    params: { ...data, soft_deleted: false },
  });
}
export function getNurseList(data) {
  return service({
    url: `/users/nurse`,
    method: 'get',
    params: data,
  });
}

export function makeDefaultSalesAgent(data) {
  return service({
    url: `/users/default-sales-agent`,
    method: 'post',
    data,
  });
}
export function addNewUser(data) {
  return service({
    url: '/users',
    method: 'post',
    data,
  });
}

export function sendBugReport(data) {
  return service({
    url: '/emails/slack-bot',
    method: 'post',
    data,
  });
}
export function changeAlertStatus(data) {
  return service({
    url: '/users/active-nurse',
    method: 'patch',
    data,
  });
}
export function addNewEndUser(data) {
  return service({
    url: '/users/end-users',
    method: 'post',
    data,
  });
}

export function uploadImage(data) {
  return service({
    url: '/users/image',
    method: 'post',
    data,
  });
}
// export function uploadVideo(data) {
//   return service({
//     url: "/users/video",
//     method: "post",
//     data,
//   });
// }

export function updateUserDetails(id, data) {
  console.log(id, data);

  return service({
    url: `/users/${id}`,
    method: 'patch',
    data,
  });
}

export function resetUserPasswordByAdmin(id, data) {
  return service({
    url: `/users/update-users-password/${id}`,
    method: 'patch',
    data,
  });
}
export function updateUserPasswordByOwn(data) {
  return service({
    url: `/auth/update-password`,
    method: 'patch',
    data,
  });
}

export function deleteUser(id) {
  return service({
    url: `/users/soft-delete/${id}`,
    method: 'delete',
  });
}
export function deactivatedUser(data) {
  return service({
    url: `/elderly/soft-deleted/${data.id}`,
    method: 'patch',
    data: data.data,
  });
}
export function permanentDeleteUser(id) {
  return service({
    url: `/users/${id}`,
    method: 'delete',
  });
}
export function restoreUser(id) {
  return service({
    url: `/users/re-store/${id}`,
    method: 'patch',
  });
}
export function getByParentId(id) {
  return service({
    url: `users/by-parent/${id}`,
    method: 'get',
  });
}
export function setConfigurationForMonitoringStation(data) {
  return service({
    url: `users/assign-monitoring-agency/${data.id}`,
    method: 'patch',
    data: data.data,
  });
}
export function getMonitoringCompanyConf(id) {
  return service({
    url: `monitoring-station/${id}`,
    method: 'get',
  });
}
export function updateMonitoringCompanyConf(data) {
  return service({
    url: `monitoring-station/${data.id}`,
    method: 'patch',
    data: data.data,
  });
}
