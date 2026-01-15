import { getTokenToCall } from '@/api/deviceCall';

/**
 * Initiate a device call (ensures valid token before opening popup)
 * @param {string} id - Unique device ID
 * @param {function} onPopupClosed - Callback triggered when popup is closed
 */
export const initiateCall = async (id, onPopupClosed) => {
  if (!id) return console.error('Device ID missing');

  try {
    const tokenData = getValidStoredToken();
    let accessToken = null;

    if (!accessToken) {
      accessToken = await fetchTokenWithRetry();
      if (!accessToken) throw new Error('Failed to retrieve token');
      storeToken(accessToken);
    }

    makeCall(id, accessToken, onPopupClosed);
  } catch (error) {
    console.error('Failed to initiate call:', error);
  }
};

const fetchTokenWithRetry = async (retries = 2, delay = 1000) => {
  for (let i = 0; i <= retries; i++) {
    const token = await fetchNewToken();
    if (token) return token;
    console.warn(`Retrying token fetch... attempt ${i + 1}`);
    await wait(delay);
  }
  return null;
};

const fetchNewToken = async () => {
  try {
    const response = await getTokenToCall();
    const accessToken = response?.data?.token;
    if (!accessToken) throw new Error('Invalid token response');
    return accessToken;
  } catch (error) {
    console.error('Error fetching new token:', error);
    return null;
  }
};

const getValidStoredToken = () => {
  try {
    const tokenStr = localStorage.getItem('tokenData');
    if (!tokenStr) return null;

    const token = JSON.parse(tokenStr);
    if (token?.expiry && token?.accessToken && Date.now() < token.expiry - 30000) {
      return token;
    }

    localStorage.removeItem('tokenData');
    return null;
  } catch (error) {
    console.error('Error reading token from storage:', error);
    return null;
  }
};

const storeToken = (accessToken) => {
  const expiryTime = Date.now() + 3600 * 1000;
  const tokenData = { accessToken, expiry: expiryTime };
  localStorage.setItem('tokenData', JSON.stringify(tokenData));
};

const makeCall = (uid, accessToken, onPopupClosed) => {
  if (!accessToken) return console.error('No valid token available for call');

  const params = new URLSearchParams({
    uid,
    token: accessToken,
    lang: 'en_US',
  });

  const popupUrl = `https://console.elderlycareplatform.com/metting?${params.toString()}`;
  const windowFeatures =
    'width=500,height=600,scrollbars=no,resizable=no,location=no,toolbar=no,status=no,menubar=no';

  const popup = window.open(popupUrl, 'Device Calling', windowFeatures);

  if (popup) {
    popup.focus();

    const popupCheck = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupCheck);
        if (typeof onPopupClosed === 'function') {
          onPopupClosed(uid);
        }
      }
    }, 500);
  } else {
    console.error('Popup window could not be opened');
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
