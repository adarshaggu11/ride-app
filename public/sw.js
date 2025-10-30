// Service Worker for PWA, Offline Support, and Firebase Cloud Messaging
const CACHE_NAME = 'mana-auto-v1';
const RUNTIME_CACHE = 'mana-auto-runtime-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - cache first, network fallback
  event.respondWith(cacheFirstStrategy(request));
});

// Cache-first strategy
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline page if available
    return caches.match('/offline.html');
  }
}

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-rides') {
    event.waitUntil(syncPendingRides());
  }
});

async function syncPendingRides() {
  // Sync pending ride requests when back online
  console.log('Syncing pending rides...');
}

// ------------------------------
// Firebase Cloud Messaging (Compat v12)
// ------------------------------
try {
  importScripts('https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js');

  // Attempt to load config from /firebase-config.json if provided
  const initMessaging = async () => {
    let cfg = {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      databaseURL: ""
    };

    try {
      const resp = await fetch('/firebase-config.json', { cache: 'no-cache' });
      if (resp.ok) {
        const json = await resp.json();
        cfg = Object.assign(cfg, json || {});
      }
    } catch (_) {
      // ignore, will fallback below if fields are empty
    }

    // Require explicit config; skip initialization if missing
    if (!cfg.apiKey || !cfg.projectId || !cfg.messagingSenderId || !cfg.appId) {
      // Do not initialize Firebase Messaging without proper web config.
      // This avoids accidental mismatches with native configs.
      return;
    }

    // Initialize Firebase safely (avoid duplicate-app error)
    try {
      if (firebase.apps && firebase.apps.length) {
        firebase.app();
      } else {
        firebase.initializeApp(cfg);
      }
    } catch (e) {
      try { firebase.app(); } catch (_) {}
    }

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const title = payload.notification?.title || 'Dropout';
      const options = {
        body: payload.notification?.body || 'You have a new update',
        icon: payload.notification?.icon || '/favicon.ico',
        // badge omitted to avoid missing asset; browser default applies
        tag: payload.data?.tag || 'ride-notification',
        data: payload.data,
        requireInteraction: true,
        actions: [
          { action: 'open', title: 'Open App' },
          { action: 'close', title: 'Dismiss' }
        ]
      };

      return self.registration.showNotification(title, options);
    });
  };

  initMessaging();

  // Notification click handler (works for both generic and FCM notifications)
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
          for (const client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  });
} catch (err) {
  // Firebase not available in SW; proceed without web push
}
