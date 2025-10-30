import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { scheduleLocalNotification } from './localNotificationService';
import { safeSetItem, safeGetJSON } from "@/utils/safeStorage";

/**
 * Initialize push notifications when app starts
 * Call this in App.tsx on mount
 */
export const initializePushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications only work on native platforms');
    return null;
  }

  try {
    // Request permission to use push notifications
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn('Push notification permission denied');
      return null;
    }

    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register();

    // Listen for registration success
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('✅ Push registration success, token: ' + token.value);
      // Send this token to your backend server
      saveFCMToken(token.value); 
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('❌ Push registration error: ' + JSON.stringify(error));
    });

    // Listen for push notifications received while app is in foreground
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('📬 Push notification received (foreground):', notification);
        
        // Show local notification when app is open
        await scheduleLocalNotification(
          notification.title || 'New Notification',
          notification.body || '',
          Date.now()
        );

        // Store notification in app state/storage
        storeNotification(notification);
      }
    );

    // Listen for push notification action (when user taps notification)
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('👆 Push notification action performed:', action);
        
        const data = action.notification.data;
        handleNotificationAction(data);
      }
    );

    console.log('✅ Push notifications initialized successfully');
    return permStatus;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return null;
  }
};

/**
 * Get delivered notifications (notification center)
 */
export const getDeliveredNotifications = async () => {
  try {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('Delivered notifications:', notificationList);
    return notificationList.notifications;
  } catch (error) {
    console.error('Error getting delivered notifications:', error);
    return [];
  }
};

/**
 * Remove all delivered notifications from notification center
 */
export const removeAllNotifications = async () => {
  try {
    await PushNotifications.removeAllDeliveredNotifications();
    console.log('✅ All notifications removed');
  } catch (error) {
    console.error('Error removing notifications:', error);
  }
};

/**
 * Save FCM token to backend server
 */
const saveFCMToken = async (token: string) => {
  try {
    // Save to localStorage (safely) for now
    safeSetItem('fcm_token', token);
    
    // TODO: Send to your backend API
    // const response = await fetch('YOUR_API_URL/save-fcm-token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token, userId: 'user_id_here' })
    // });
    
    console.log('✅ FCM token saved:', token);
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

/**
 * Store notification in app for notification history
 */
const storeNotification = (notification: PushNotificationSchema) => {
  try {
    const notifications = safeGetJSON<any[]>('app_notifications', []);
    
    notifications.unshift({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      timestamp: new Date().toISOString(),
      read: false
    });

    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }

    safeSetItem('app_notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error storing notification:', error);
  }
};

/**
 * Handle notification tap action (navigate to specific screen)
 */
const handleNotificationAction = (data: any) => {
  try {
    console.log('Handling notification action with data:', data);
    
    // Navigate based on notification type
    if (data.type === 'ride_assigned') {
      // Navigate to driver assigned screen
      window.location.href = `/driver-assigned/${data.rideId}`;
    } else if (data.type === 'ride_started') {
      // Navigate to trip ongoing screen
      window.location.href = `/trip-ongoing/${data.rideId}`;
    } else if (data.type === 'ride_completed') {
      // Navigate to trip completed screen
      window.location.href = `/trip-completed/${data.rideId}`;
    } else if (data.type === 'driver_arrived') {
      // Show driver arrived notification
      window.location.href = `/driver-assigned/${data.rideId}`;
    } else {
      // Default: navigate to notifications screen
      window.location.href = '/notifications';
    }
  } catch (error) {
    console.error('Error handling notification action:', error);
  }
};

/**
 * Get all app notifications from storage
 */
export const getAppNotifications = () => {
  try {
    return safeGetJSON<any[]>('app_notifications', []);
  } catch (error) {
    console.error('Error getting app notifications:', error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = (notificationId: string) => {
  try {
    const notifications = getAppNotifications();
    const updated = notifications.map((n: any) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    safeSetItem('app_notifications', JSON.stringify(updated));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = () => {
  try {
    const notifications = getAppNotifications();
    return notifications.filter((n: any) => !n.read).length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};
