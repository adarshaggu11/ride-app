// Firebase Configuration
// Get your config from: https://console.firebase.google.com/

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

// Get status message
export const getFirebaseStatus = () => {
  if (isFirebaseConfigured()) {
    return {
      configured: true,
      message: '✅ Firebase configured and ready'
    };
  }
  
  return {
    configured: false,
    message: '⚠️ Firebase not configured. Add credentials to .env file',
    missingKeys: [
      !firebaseConfig.apiKey && 'VITE_FIREBASE_API_KEY',
      !firebaseConfig.authDomain && 'VITE_FIREBASE_AUTH_DOMAIN',
      !firebaseConfig.projectId && 'VITE_FIREBASE_PROJECT_ID',
      !firebaseConfig.storageBucket && 'VITE_FIREBASE_STORAGE_BUCKET',
      !firebaseConfig.messagingSenderId && 'VITE_FIREBASE_MESSAGING_SENDER_ID',
      !firebaseConfig.appId && 'VITE_FIREBASE_APP_ID'
    ].filter(Boolean)
  };
};
