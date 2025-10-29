/**
 * BULLETPROOF LocalStorage Wrapper
 * Prevents ALL crashes from localStorage operations
 * Handles: quota exceeded, corrupted data, disabled storage, parse errors
 */

/**
 * Safely get item from localStorage
 * Never throws errors - returns null on failure
 */
export const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available');
      return null;
    }
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting localStorage item "${key}":`, error);
    return null;
  }
};

/**
 * Safely set item in localStorage
 * Never throws errors - returns false on failure
 */
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available');
      return false;
    }
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
    
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old data...');
      try {
        // Try to clear some space
        clearOldData();
        // Retry once
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error('Failed to save even after clearing:', retryError);
      }
    }
    
    return false;
  }
};

/**
 * Safely remove item from localStorage
 */
export const safeRemoveItem = (key: string): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Safely parse JSON from localStorage
 * Returns default value on any error
 */
export const safeGetJSON = <T>(key: string, defaultValue: T): T => {
  try {
    const item = safeGetItem(key);
    if (!item) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage "${key}":`, error);
    // Remove corrupted data
    safeRemoveItem(key);
    return defaultValue;
  }
};

/**
 * Safely stringify and save JSON to localStorage
 */
export const safeSetJSON = <T>(key: string, value: T): boolean => {
  try {
    const jsonString = JSON.stringify(value);
    return safeSetItem(key, jsonString);
  } catch (error) {
    console.error(`Error stringifying/saving JSON to localStorage "${key}":`, error);
    return false;
  }
};

/**
 * Clear old/unnecessary data to free up space
 */
const clearOldData = (): void => {
  try {
    // Clear temporary data that can be regenerated
    const temporaryKeys = [
      'phone_calls',
      'app_notifications',
      'sos_alerts',
      'permission_state',
      'permission_step',
    ];
    
    temporaryKeys.forEach(key => {
      safeRemoveItem(key);
    });
    
    console.log('Cleared temporary localStorage data');
  } catch (error) {
    console.error('Error clearing old data:', error);
  }
};

/**
 * Check if localStorage is available and working
 */
export const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    // Test if we can actually write
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('localStorage not available:', error);
    return false;
  }
};

/**
 * Get localStorage usage statistics
 */
export const getStorageStats = (): { used: number; available: boolean } => {
  try {
    if (!isStorageAvailable()) {
      return { used: 0, available: false };
    }
    
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const item = localStorage.getItem(key);
        totalSize += key.length + (item?.length || 0);
      }
    }
    
    return {
      used: totalSize,
      available: true,
    };
  } catch (error) {
    return { used: 0, available: false };
  }
};

/**
 * Clear ALL localStorage data (use with caution!)
 */
export const clearAllStorage = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    localStorage.clear();
    console.log('All localStorage data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing all storage:', error);
    return false;
  }
};
