// Firebase Push Notification Service
// Handles push notifications for ride updates, driver assignments, etc.

import { messaging, isFirebaseEnabled } from '../config/firebase';
import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { config } from '@/config/production';
import { safeGetJSON } from '@/utils/safeStorage';

// Notification permission status
let notificationPermission: NotificationPermission = 'default';

/**
 * Request notification permission from user
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isFirebaseEnabled) {
    console.warn('Firebase not configured. Push notifications disabled.');
    return false;
  }

  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  try {
    notificationPermission = await Notification.requestPermission();
    
    if (notificationPermission === 'granted') {
      console.log('✅ Notification permission granted');
      return true;
    } else {
      console.warn('⚠️ Notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Get FCM token for push notifications
 */
export const getFCMToken = async (): Promise<string | null> => {
  if (!isFirebaseEnabled || !messaging) {
    return null;
  }

  try {
    // Request permission first
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return null;
    }

    // Ensure our main PWA service worker is ready and use it for FCM
    const registration = await navigator.serviceWorker.ready;

    // Get FCM token
    const token = await getToken(messaging as Messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('✅ FCM Token:', token);
      // Attempt to persist token to backend (non-blocking)
      try {
        const user = safeGetJSON<any>('user', null);
        await fetch(`${config.API_BASE_URL}/push/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            platform: 'web',
            userId: user?._id || user?.id || undefined,
            meta: {
              ua: navigator.userAgent,
              lang: navigator.language,
            },
          }),
        });
      } catch (e) {
        console.warn('Failed to persist FCM token to backend (non-critical):', e);
      }
      return token;
    } else {
      console.warn('⚠️ No FCM token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Listen for foreground messages
 */
export const onForegroundMessage = (callback: (payload: any) => void): (() => void) | null => {
  if (!isFirebaseEnabled || !messaging) {
    return null;
  }

  return onMessage(messaging as Messaging, (payload) => {
    console.log('📬 Foreground message received:', payload);
    
    // Show browser notification
    if (notificationPermission === 'granted' && payload.notification) {
      new Notification(payload.notification.title || 'Notification', {
        body: payload.notification.body,
        icon: payload.notification.icon || '/favicon.ico',
        // badge omitted to avoid missing asset; let browser default
        tag: payload.data?.tag || 'ride-notification',
        requireInteraction: true
      });
    }
    
    // Call custom callback
    callback(payload);
  });
};

/**
 * Send notification (for testing purposes)
 */
export const sendTestNotification = () => {
  if (notificationPermission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  new Notification('🚗 Test Notification', {
    body: 'Firebase push notifications are working!',
    icon: '/favicon.ico'
  });
};

/**
 * Check if notifications are supported and enabled
 */
export const areNotificationsEnabled = (): boolean => {
  return isFirebaseEnabled && 
         'Notification' in window && 
         notificationPermission === 'granted';
};
