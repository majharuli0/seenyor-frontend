import service from '../utils/axiosRequest';
export function getRoomInfo(data) {
  console.log(data);

  return service({
    url: `/elderly/${data.elderly_id}/room-configuration/${data.room_id}`,
    method: 'get',
    cancelToken: data.cancelToken,
  });
}

export function addRoomObject(data) {
  return service({
    url: `/devices/${data.elderly_id}/rooms/${data.room_id}/object-areas`,
    method: 'post',
    data: data.obj,
    cancelToken: data.cancelToken,
  });
}
export function updateRoomObject(data) {
  return service({
    url: `/devices/${data.elderly_id}/rooms/${data.room_id}/object-areas/${data.obj_id}`,
    method: 'patch',
    data: data.obj,
    cancelToken: data.cancelToken,
  });
}

export function deleteObject(data) {
  return service({
    url: `/devices/${data.elderly_id}/rooms/${data.room_id}/object-areas/${data.obj_id}`,
    method: 'delete',
    cancelToken: data.cancelToken,
  });
}

export function updateMountConf(data) {
  return service({
    url: `/elderly/${data.elderly_id}/mount/${data.room_id}`,
    method: 'patch',
    data: data.data,
    cancelToken: data.cancelToken,
  });
}
export function updateBoundary(data) {
  return service({
    url: `/devices/boundaries-area/${data.elderly_id}`,
    method: 'patch',
    data: data.data,
    cancelToken: data.cancelToken,
  });
}
export function updateFunctionParameters(data) {
  return service({
    url: `/elderly/${data.elderly_id}/events`,
    method: 'patch',
    data: data.data,
    cancelToken: data.cancelToken,
  });
}
export function updateFunctionStatus(data) {
  return service({
    url: `/elderly/${data.elderly_id}/events/${data.room_id}/${data.event_id}`,
    method: 'patch',
    data: data.data,
    cancelToken: data.cancelToken,
  });
}
export function getAllDeviceInfo(data) {
  return service({
    url: `/devices/info`,
    method: 'get',
  });
}
