import service from '../utils/axiosRequest';
// import request from "../utils/request";

// Login With username and password
export function loginWithPass(data) {
  return service({
    url: '/auth/login',
    method: 'post',
    data,
  });
}
export function sendOTP(data) {
  return service({
    url: '/auth/send-otp',
    method: 'post',
    data,
  });
}
export function verifyOTP(data) {
  return service({
    url: '/auth/verify-otp',
    method: 'post',
    data,
  });
}
export function resetPassword(data) {
  return service({
    url: '/auth/reset-password',
    method: 'patch',
    data,
  });
}
export function logout(data) {
  return service({
    url: '/auth/logout',
    method: 'delete',
    data,
  });
}
export function logoutSessionUser(data) {
  return service({
    url: `/user-sessions/${data?.id}/logout`,
    method: 'patch',
  });
}
