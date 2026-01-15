import service from '../utils/axiosRequest';

//health score
export function getHealthScore(data) {
  return service({
    url: '/sleep/health-score',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//sleep events
export function getSleepEvents(data) {
  return service({
    url: '/sleep/events',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//sleep summary
export function getSleepSummary(data) {
  return service({
    url: '/sleep/summary',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//breath rate
export function getBreathRate(data) {
  return service({
    url: '/sleep/respiratory-rate',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//heart rate
export function getHeartRate(data) {
  return service({
    url: '/sleep/heart-rate',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//day time activity
export function getDayTimeActivity(data) {
  return service({
    url: '/sleep/daytime-activity-merged',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
// all event graph

//sleep duration statistics
export function getSleepDurationStatistics(data) {
  return service({
    url: '/sleep/duration',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}

//sleep duration distribution
export function getSleepDurationDistribution(data) {
  return service({
    url: '/sleep/duration-distribution',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//sleep efficiency statistics
export function getSleepEfficiencyStatistics(data) {
  return service({
    url: '/sleep/efficiency',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}

//sleep efficiency distribution
export function getSleepEfficiencyDistribution(data) {
  return service({
    url: '/sleep/efficiency',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}

//deep sleed percentage statistics
export function getDeepSleedPercentageStatistics(data) {
  return service({
    url: '/sleep/duration-distribution',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//daily routine
export function getDailyRoutine(data) {
  return service({
    url: '/sleep/daily-routine-statistics',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//bed exit duration statistic
export function getBedExitDurationStatistic(data) {
  return service({
    url: '/sleep/statistics',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//heart rate distribution
export function getHeartRateDistribution(data) {
  return service({
    url: '/sleep/heart-rate-distribution',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//breath rate distribution
export function getBreathRateDistribution(data) {
  return service({
    url: '/sleep/respiratory-rate-distribution',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}

//walk speed statistics
export function getWalkSpeedStatistics(data) {
  return service({
    url: '/sleep/walk-speeds',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//walk speed statistics
export function getWalkStepsStatistics(data) {
  return service({
    url: '/sleep/daytime-activity',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//get sleep data
export function getSleepData(data) {
  return service({
    url: '/sleep/details',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//apnea index statistic
export function getApneaIndexStatistic(data) {
  return service({
    url: '/sleep/ahi',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//number of bed exit statistics
export function getNumberOfBedExist(data) {
  return service({
    url: '/sleep/bed-exit-statistics',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}
//number of room entries exit statistics

export function getNumberOfRoomEntriesExitTimes(data) {
  return service({
    url: '/sleep/entries-exit',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}

//get fall asleep statistics

export function getFallAsleepStatistics(data) {
  return service({
    url: '/sleep/statistics',
    method: 'get',
    params: { ...data },
    cancelToken: data.cancelToken,
  });
}

//subcribe to mqtt service
export function subscribeToMqtt(data) {
  return service({
    url: '/devices/subscribe-to-mqtt',
    method: 'post',
    data: { ...data },
  });
}
//unscribe from mqtt service
export function unsubscribeFromMqtt(data) {
  return service({
    url: 'devices/unsubscribe-to-mqtt',
    method: 'post',
    data: { ...data },
  });
}
//fall play back
export function fallPlayback(data) {
  return service({
    url: '/devices/fallingplayback',
    method: 'post',
    data: { ...data },
  });
}
export function elderlyFallPlayback(data) {
  return service({
    url: `/fall-events/${data.id}`,
    method: 'get',
    // params: { id: data.id, ...data.data },
  });
}
export function getDeviceInfo(uid) {
  return service({
    url: `/devices/properties/${uid}`,
    method: 'get',
  });
}
export function getResolvedByMe(data) {
  return service({
    url: `alarms/resolved-by-me`,
    method: 'get',
    params: data,
  });
}
