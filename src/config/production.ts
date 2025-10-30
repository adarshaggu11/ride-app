// Production Configuration
// Driven by environment variables; avoid hardcoding for releases.

// If VITE_PRODUCTION_MODE is explicitly set to 'true', prefer that.
// Otherwise, fall back to Vite's production mode flag.
export const PRODUCTION_MODE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PRODUCTION_MODE === 'true') ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD) ||
  false;

export const config = {
  // API Configuration
  API_BASE_URL: PRODUCTION_MODE 
    ? 'https://your-production-api.com/api' 
    : 'http://localhost:3000/api',
  
  WS_URL: PRODUCTION_MODE
    ? 'wss://your-production-api.com'
    : 'ws://localhost:3000',

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
