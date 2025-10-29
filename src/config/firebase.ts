// Firebase Configuration
// Project: dropout (dropout586586)

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, PhoneAuthProvider } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getMessaging, Messaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getAnalytics, Analytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

// Firebase configuration from environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  databaseURL: import.meta.env.VITE_FIREBASE_PROJECT_ID 
    ? `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
    : ''
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

// Initialize Firebase only if configured
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let database: Database | undefined;
let messaging: Messaging | undefined;
let analytics: Analytics | undefined;

if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Authentication
    auth = getAuth(app);
    
    // Initialize Realtime Database
    database = getDatabase(app);
    
    // Initialize Cloud Messaging (only in browser with service worker support)
    isMessagingSupported().then((supported) => {
      if (supported && app) {
        messaging = getMessaging(app);
      }
    }).catch((error) => {
      console.warn('Firebase Messaging not supported:', error);
    });
    
    // Initialize Analytics (only in production)
    if (import.meta.env.PROD) {
      isAnalyticsSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch((error) => {
        console.warn('Firebase Analytics not supported:', error);
      });
    }
    
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  console.warn('⚠️ Firebase not configured. Add credentials to .env file.');
}

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

// Export Firebase services
export { 
  app, 
  auth, 
  database, 
  messaging, 
  analytics,
  PhoneAuthProvider
};

// Export helper
export const isFirebaseEnabled = isFirebaseConfigured();
