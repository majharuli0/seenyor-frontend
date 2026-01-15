import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MSG_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey:
          'BK8pCKbuVqqTZx9t5W2jPbug0HeK3mNCVqfiQsebNIGi3FJDNxEOTw13rcHwr3xMjJOja9SL3MD-vQ_Q0Utklzw',
      });
      console.log('Token generated:', token);
      return token;
    } else {
      console.log('permission denied');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
      console.log(payload);
    });
  });
