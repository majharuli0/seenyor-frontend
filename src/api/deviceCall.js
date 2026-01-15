import service from '../utils/axiosRequest';

//get refresh and access token
export function getTokenToCall() {
  return service({
    url: '/qinglan-token',
    method: 'get',
  });
}

export async function makeCallToDevice(data) {
  const url = 'https://console.elderlycareplatform.com/metting';

  const params = new URLSearchParams(data).toString();

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = response.text();
    return result;
  } catch (error) {
    console.error('Error making the request:', error);
    throw error;
  }
}
