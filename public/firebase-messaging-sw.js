importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAKBVALG9h6sq0FjLabvJe2PHJ0iBBIXd0",
    authDomain: "greenfield-college-system.firebaseapp.com",
    projectId: "greenfield-college-system",
    storageBucket: "greenfield-college-system.firebasestorage.app",
    messagingSenderId: "655984882657",
    appId: "1:655984882657:web:d11275e9c7b972943ad8a0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || 'Greenfield Portal Notification';
    const notificationOptions = {
        body: payload.notification?.body,
        icon: '/logo192.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});