import { Geolocation, Position, PermissionStatus } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

/**
 * Check if location permission is granted
 */
export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Web platform - check browser geolocation
      return 'geolocation' in navigator;
    }

    const permission = await Geolocation.checkPermissions();
    return permission.location === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

/**
 * Request location permission from user
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Web platform - browser will request automatically
      return true;
    }

    const permission: PermissionStatus = await Geolocation.requestPermissions();
    return permission.location === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get current user location
 */
export const getCurrentLocation = async (): Promise<LocationCoords> => {
  try {
    const position: Position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw new Error('Unable to get current location. Please check your location settings.');
  }
};

/**
 * Watch user location for real-time tracking
 */
export const watchLocation = async (
  callback: (location: LocationCoords) => void,
  errorCallback?: (error: Error) => void
): Promise<string> => {
  const watchId = await Geolocation.watchPosition(
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    },
    (position: Position | null, error?: any) => {
      if (error) {
        errorCallback?.(new Error(error.message || 'Location watch error'));
        return;
      }

      if (position) {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed
        });
      }
    }
  );

  return watchId;
};

/**
 * Stop watching location
 */
export const clearLocationWatch = async (watchId: string): Promise<void> => {
  try {
    await Geolocation.clearWatch({ id: watchId });
  } catch (error) {
    console.error('Error clearing location watch:', error);
  }
};

/**
 * Calculate distance between two coordinates (in kilometers)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};
