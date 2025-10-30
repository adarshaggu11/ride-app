// Production Configuration
// Driven by environment variables; avoid hardcoding for releases.
import { Capacitor } from '@capacitor/core';

// If VITE_PRODUCTION_MODE is explicitly set to 'true', prefer that.
// Otherwise, fall back to Vite's production mode flag.
export const PRODUCTION_MODE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PRODUCTION_MODE === 'true') ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD) ||
  false;

// Read optional runtime override from localStorage (safe)
const readLocal = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (_) {}
  return null;
};

// Resolve API Base URL with environment, native emulator tweaks, and local override support
const resolveApiBaseUrl = (): string => {
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  let base = envBase || (PRODUCTION_MODE ? 'https://your-production-api.com/api' : 'http://localhost:3000/api');

  // On native emulator, replace localhost with 10.0.2.2
  if (Capacitor.isNativePlatform() && base.includes('localhost')) {
    base = base.replace('localhost', '10.0.2.2');
  }

  const override = readLocal('api_base_url') || readLocal('api_base_override');
  if (override) return override;
  return base;
};

// Resolve WebSocket URL similarly
const resolveWsUrl = (apiBase: string): string => {
  const envWs = (import.meta as any).env?.VITE_WS_URL as string | undefined;
  if (envWs) return envWs;

  try {
    const url = new URL(apiBase);
    const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    const port = url.port || (url.protocol === 'https:' ? '443' : '80');
    // If API path ends with /api, use same host for WS without path
    return `${wsProtocol}//${url.hostname}:${port}`;
  } catch (_) {
    // Fallback
    return PRODUCTION_MODE ? 'wss://your-production-api.com' : (Capacitor.isNativePlatform() ? 'ws://10.0.2.2:3000' : 'ws://localhost:3000');
  }
};

const API_BASE_URL = resolveApiBaseUrl();
const WS_URL = resolveWsUrl(API_BASE_URL);

export const config = {
  // API Configuration
  API_BASE_URL,
  WS_URL,

  // Feature Flags
  ENABLE_MOCK_VEHICLES: !PRODUCTION_MODE, // Show mock vehicles in development
  ENABLE_MOCK_OTP: !PRODUCTION_MODE, // Allow OTP bypass in development
  ENABLE_DEMO_ROUTES: !PRODUCTION_MODE, // Enable /demo/* routes in development
  
  // OTP Configuration
  MOCK_OTP: '123456', // Only used when ENABLE_MOCK_OTP is true
  
  // App Configuration
  APP_NAME: PRODUCTION_MODE ? 'Dropout' : 'Dropout Dev',
  APP_VERSION: '1.0.0',
  
  // Google Maps
  GOOGLE_MAPS_API_KEY: (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY,
  
  // Firebase
  FIREBASE_ENABLED: true,
  
  // Logging
  ENABLE_CONSOLE_LOGS: !PRODUCTION_MODE,
  ENABLE_ERROR_REPORTING: PRODUCTION_MODE,
  
  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  DRIVER_SEARCH_TIMEOUT: 60000, // 60 seconds
  
  // Vehicle Tracking
  VEHICLE_UPDATE_INTERVAL: 2000, // 2 seconds
  NEARBY_RADIUS_KM: 5,
  
  // Default Values
  DEFAULT_LOCATION: {
    lat: 17.385044,
    lng: 78.486671,
    name: 'Hyderabad, Telangana'
  }
};

// Helper function for conditional logging
export const log = (...args: any[]) => {
  if (config.ENABLE_CONSOLE_LOGS) {
    console.log(...args);
  }
};

export const logError = (...args: any[]) => {
  if (config.ENABLE_CONSOLE_LOGS || config.ENABLE_ERROR_REPORTING) {
    console.error(...args);
  }
};

export const logWarn = (...args: any[]) => {
  if (config.ENABLE_CONSOLE_LOGS) {
    console.warn(...args);
  }
};
