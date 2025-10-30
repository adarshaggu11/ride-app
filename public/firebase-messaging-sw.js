// Firebase Cloud Messaging Service Worker (Compat, aligned to SDK v12)
// Handles background push notifications in the PWA

importScripts('https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsCmA1UfUa5qqFzoj24urGQhBO5PwXJ4A",
  authDomain: "dropout586586.firebaseapp.com",
  projectId: "dropout586586",
  storageBucket: "dropout586586.firebasestorage.app",
  messagingSenderId: "577511318089",
  appId: "1:577511318089:android:5325e380d38a1512a05598",
  databaseURL: "https://dropout586586-default-rtdb.firebaseio.com"
};

// Initialize Firebase safely (avoid duplicate-app error on hot updates)
try {
  if (firebase.apps && firebase.apps.length) {
    firebase.app();
  } else {
    firebase.initializeApp(firebaseConfig);
  }
} catch (e) {
  // In case of race conditions, fallback to existing app
  try { firebase.app(); } catch (_) {}
}

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Dropout';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update',
    icon: payload.notification?.icon || '/icon-192.png',
    badge: '/icon-72.png',
    tag: payload.data?.tag || 'ride-notification',
    data: payload.data,
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
