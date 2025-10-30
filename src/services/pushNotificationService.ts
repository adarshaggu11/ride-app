// Push Notification Service with Firebase Cloud Messaging
// This service will work when Firebase is configured

import { firebaseConfig, isFirebaseConfigured, getFirebaseStatus } from '@/config/firebase';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

class PushNotificationService {
  private isSupported: boolean = false;
  private isFirebaseReady: boolean = false;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.isFirebaseReady = isFirebaseConfigured();
    
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Check if push notifications are supported
   */
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Get Firebase configuration status
   */
  getStatus() {
    return {
      browserSupport: this.isSupported,
      permission: this.permission,
      firebase: getFirebaseStatus()
    };
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        return true;
      } else {
        console.log('❌ Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Show a local notification (works without Firebase)
   */
  async showLocalNotification(payload: NotificationPayload): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications not supported');
      return false;
    }

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        badge: payload.badge || '/favicon.ico',
        tag: 'mana-auto-notification',
        requireInteraction: false,
        data: payload.data
      });

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  /**
   * Initialize Firebase Cloud Messaging (when Firebase is configured)
   */
  async initializeFirebaseMessaging(): Promise<string | null> {
    if (!this.isFirebaseReady) {
      console.warn('Firebase not configured. Using local notifications only.');
      console.log('To enable Firebase:', getFirebaseStatus());
      return null;
    }

    try {
      // TODO: Initialize Firebase when credentials are added
      // const messaging = getMessaging(app);
      // const token = await getToken(messaging, { vapidKey: 'your-vapid-key' });
      // return token;
      
      console.log('Firebase initialization will be completed when credentials are added');
      return null;
    } catch (error) {
      console.error('Error initializing Firebase messaging:', error);
      return null;
    }
  }

  /**
   * Subscribe to ride updates (using local notifications for now)
   */
  async subscribeToRideUpdates(rideId: string): Promise<boolean> {
    console.log(`Subscribed to ride updates: ${rideId}`);
    return true;
  }

  /**
   * Send notification for driver assignment
   */
  async notifyDriverAssigned(driverName: string, eta: string): Promise<void> {
    await this.showLocalNotification({
      title: '🚗 Driver Assigned!',
      body: `${driverName} is on the way. ETA: ${eta}`,
      icon: '/favicon.ico',
      data: { type: 'driver_assigned', driverName, eta },
      actions: [
        { action: 'view', title: 'View Ride' },
        { action: 'call', title: 'Call Driver' }
      ]
    });
  }

  /**
   * Send notification for ride arrival
   */
  async notifyDriverArrived(): Promise<void> {
    await this.showLocalNotification({
      title: '🎯 Driver Arrived!',
      body: 'Your driver has arrived at the pickup location',
      icon: '/favicon.ico',
      data: { type: 'driver_arrived' },
      actions: [
        { action: 'view', title: 'View Details' }
      ]
    });
  }

  /**
   * Send notification for ride completion
   */
  async notifyRideCompleted(fare: number): Promise<void> {
    await this.showLocalNotification({
      title: '✅ Ride Completed',
      body: `Total fare: ₹${fare}. Thank you for riding with us!`,
      icon: '/favicon.ico',
      data: { type: 'ride_completed', fare },
      actions: [
        { action: 'rate', title: 'Rate Ride' },
        { action: 'receipt', title: 'View Receipt' }
      ]
    });
  }

  /**
   * Send notification for payment success
   */
  async notifyPaymentSuccess(amount: number): Promise<void> {
    await this.showLocalNotification({
      title: '💳 Payment Successful',
      body: `₹${amount} paid successfully`,
      icon: '/favicon.ico',
      data: { type: 'payment_success', amount }
    });
  }

  /**
   * Send notification for promotional offers
   */
  async notifyPromotion(title: string, message: string): Promise<void> {
    await this.showLocalNotification({
      title: `🎁 ${title}`,
      body: message,
      icon: '/favicon.ico',
      data: { type: 'promotion' },
      actions: [
        { action: 'view', title: 'View Offer' }
      ]
    });
  }

  /**
   * Test notification (for development)
   */
  async sendTestNotification(): Promise<void> {
    await this.showLocalNotification({
      title: '🧪 Test Notification',
      body: 'Push notifications are working correctly!',
      icon: '/favicon.ico',
      data: { type: 'test' }
    });
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

// Export types
export type { NotificationPayload };
