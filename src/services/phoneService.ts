import { Capacitor } from '@capacitor/core';

/**
 * Check if phone permission is granted
 */
export const checkPhonePermission = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    return true; // Web platform doesn't need phone permission
  }

  // Android automatically grants CALL_PHONE permission on app install if declared in manifest
  // No runtime permission check needed for CALL_PHONE (dangerous permission)
  return true;
};

/**
 * Make a phone call to driver or support
 */
export const makePhoneCall = async (phoneNumber: string): Promise<void> => {
  try {
    // Remove any non-numeric characters except + 
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    if (!cleanNumber) {
      throw new Error('Invalid phone number');
    }

    // Use tel: URL scheme (works on both Android and iOS)
    const telUrl = `tel:${cleanNumber}`;
    
    if (Capacitor.isNativePlatform()) {
      // On native platform, use Capacitor App plugin
      const { App } = await import('@capacitor/app');
      await App.openUrl({ url: telUrl });
    } else {
      // On web, use window.location
      window.location.href = telUrl;
    }
    
    console.log(`✅ Initiating call to ${phoneNumber}`);
  } catch (error) {
    console.error('Error making phone call:', error);
    throw new Error('Unable to make phone call. Please try again.');
  }
};

/**
 * Call driver directly
 */
export const callDriver = async (driverPhone: string): Promise<void> => {
  try {
    await makePhoneCall(driverPhone);
    
    // Log the call for tracking
    logPhoneCall('driver', driverPhone);
  } catch (error) {
    console.error('Error calling driver:', error);
    throw error;
  }
};

/**
 * Call customer support
 */
export const callSupport = async (): Promise<void> => {
  try {
    // Replace with your actual support number
    const supportNumber = '+1234567890'; // TODO: Update with real support number
    await makePhoneCall(supportNumber);
    
    // Log the call for tracking
    logPhoneCall('support', supportNumber);
  } catch (error) {
    console.error('Error calling support:', error);
    throw error;
  }
};

/**
 * Call emergency contact
 */
export const callEmergency = async (emergencyNumber: string): Promise<void> => {
  try {
    await makePhoneCall(emergencyNumber);
    
    // Log the emergency call
    logPhoneCall('emergency', emergencyNumber);
  } catch (error) {
    console.error('Error calling emergency:', error);
    throw error;
  }
};

/**
 * Open SMS app with pre-filled message
 */
export const sendSMS = async (phoneNumber: string, message?: string): Promise<void> => {
  try {
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    if (!cleanNumber) {
      throw new Error('Invalid phone number');
    }

    // Use sms: URL scheme
    let smsUrl = `sms:${cleanNumber}`;
    
    // Add message body if provided
    if (message) {
      const encodedMessage = encodeURIComponent(message);
      // Android uses ?body= while iOS uses &body=
      smsUrl += Capacitor.getPlatform() === 'android' ? `?body=${encodedMessage}` : `&body=${encodedMessage}`;
    }
    
    if (Capacitor.isNativePlatform()) {
      const { App } = await import('@capacitor/app');
      await App.openUrl({ url: smsUrl });
    } else {
      window.location.href = smsUrl;
    }
    
    console.log(`✅ Opening SMS to ${phoneNumber}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Unable to open SMS app. Please try again.');
  }
};

/**
 * Share ride details via SMS
 */
export const shareRideViaSMS = async (phoneNumber: string, rideDetails: {
  driverName: string;
  vehicleNumber: string;
  pickupLocation: string;
  dropLocation: string;
  estimatedTime: string;
}): Promise<void> => {
  try {
    const message = `🚗 Ride Details:\nDriver: ${rideDetails.driverName}\nVehicle: ${rideDetails.vehicleNumber}\nFrom: ${rideDetails.pickupLocation}\nTo: ${rideDetails.dropLocation}\nETA: ${rideDetails.estimatedTime}`;
    
    await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error('Error sharing ride via SMS:', error);
    throw error;
  }
};

/**
 * Log phone call for tracking and analytics
 */
const logPhoneCall = (type: 'driver' | 'support' | 'emergency', phoneNumber: string) => {
  try {
    const callLog = {
      type,
      phoneNumber,
      timestamp: new Date().toISOString()
    };
    
    // Store in localStorage
    const calls = JSON.parse(localStorage.getItem('phone_calls') || '[]');
    calls.unshift(callLog);
    
    // Keep only last 50 calls
    if (calls.length > 50) {
      calls.splice(50);
    }
    
    localStorage.setItem('phone_calls', JSON.stringify(calls));
    
    // TODO: Send to analytics/backend
    console.log('📞 Call logged:', callLog);
  } catch (error) {
    console.error('Error logging phone call:', error);
  }
};

/**
 * Get phone call history
 */
export const getPhoneCallHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('phone_calls') || '[]');
  } catch (error) {
    console.error('Error getting phone call history:', error);
    return [];
  }
};

/**
 * Format phone number for display (e.g., +1 234-567-8900)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};
