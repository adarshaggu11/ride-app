import { LocalNotifications, PermissionStatus } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Check if local notification permission is granted (for Android 13+)
 */
export const checkLocalNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Web platform - check browser notifications
      if ('Notification' in window) {
        return Notification.permission === 'granted';
      }
      return false;
    }

    const permission: PermissionStatus = await LocalNotifications.checkPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error checking local notification permission:', error);
    return false;
  }
};

/**
 * Request local notification permission from user (Android 13+)
 */
export const requestLocalNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Web platform - request browser notification permission
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        return result === 'granted';
      }
      return false;
    }

    const permission: PermissionStatus = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error requesting local notification permission:', error);
    return false;
  }
};

/**
 * Schedule a local notification (for ride alerts, reminders, etc.)
 */
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  id: number = Date.now()
): Promise<void> => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          schedule: { at: new Date(Date.now() + 1000) }, // Show after 1 second
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  } catch (error) {
    console.error('Error scheduling local notification:', error);
  }
};

/**
 * Cancel a scheduled local notification
 */
export const cancelLocalNotification = async (id: number): Promise<void> => {
  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  } catch (error) {
    console.error('Error canceling local notification:', error);
  }
};

/**
 * Cancel all scheduled local notifications
 */
export const cancelAllLocalNotifications = async (): Promise<void> => {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch (error) {
    console.error('Error canceling all local notifications:', error);
  }
};
