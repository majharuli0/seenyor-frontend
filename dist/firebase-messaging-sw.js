importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyBdUCJMpJN0vSMynMrJePNxHQyqfm-GF98',
  authDomain: 'seenyor-4c3e7.firebaseapp.com',
  projectId: 'seenyor-4c3e7',
  storageBucket: 'seenyor-4c3e7.firebasestorage.app',
  messagingSenderId: '73834842323',
  appId: '1:73834842323:web:12b71290ad820764c2ac26',
});
// firebase.initializeApp({
//   apiKey: "AIzaSyBp3LgzrD1Mj34b4goEwNKwkWwTB3gpg-o",
//   authDomain: "push-e0dde.firebaseapp.com",
//   projectId: "push-e0dde",
//   storageBucket: "push-e0dde.firebasestorage.app",
//   messagingSenderId: "1062375359306",
//   appId: "1:1062375359306:web:72bc85e9ac72de480977b3",
// });

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
