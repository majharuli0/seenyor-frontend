import FingerprintJS from '@fingerprintjs/fingerprintjs';

const DEVICE_ID_KEY = 'device_id';

export const getDeviceId = async () => {
  // 1. Check cached ID
  const cached = localStorage.getItem(DEVICE_ID_KEY);
  if (cached) return cached;

  // 2. Generate fingerprint
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  // 3. visitorId is stable per device + browser
  const deviceId = result.visitorId;

  // 4. Store it
  localStorage.setItem(DEVICE_ID_KEY, deviceId);

  return deviceId;
};
