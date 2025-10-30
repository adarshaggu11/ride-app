import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { initializePushNotifications } from "./services/pushNotifications";
import { requestNotificationPermission, getFCMToken, onForegroundMessage } from "./services/notificationService";
import { Capacitor } from "@capacitor/core";
import { safeGetItem, safeSetItem, safeGetJSON, safeSetJSON, safeRemoveItem } from "./utils/safeStorage";
import SplashScreen from "./components/SplashScreen";
import OnboardingScreens from "./components/OnboardingScreens";
import AuthScreen from "./components/AuthScreen";
import { PermissionScreen } from "./components/PermissionScreen";
import LocationPermission from "./components/LocationPermission";
import HomeScreen from "./components/HomeScreen";
import ConfirmRideScreen from "./components/ConfirmRideScreen";
import SearchingScreen from "./components/SearchingScreen";
import DriverAssignedScreen from "./components/DriverAssignedScreen";
import TripOngoingScreen from "./components/TripOngoingScreen";
import TripCompletedScreen from "./components/TripCompletedScreen";
import VehicleSelectionScreen from "./components/VehicleSelectionScreen";
import WalletScreen from "./components/WalletScreen";
import ProfileScreen from "./components/ProfileScreen";
import RideHistoryScreen from "./components/RideHistoryScreen";
import PaymentMethodsScreen from "./components/PaymentMethodsScreen";
import HelpSupportScreen from "./components/HelpSupportScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import SettingsScreen from "./components/SettingsScreen";
import SavedAddressesScreen from "./components/SavedAddressesScreen";
import AboutScreen from "./components/AboutScreen";
import TermsScreen from "./components/TermsScreen";
import PrivacyPolicyScreen from "./components/PrivacyPolicyScreen";
import ReferralScreen from "./components/ReferralScreen";
import { EmergencyScreen } from "./components/EmergencyScreen";
import { ScheduledRidesScreen } from "./components/ScheduledRidesScreen";
import { CarpoolScreen } from "./components/CarpoolScreen";
import { DriverDashboardScreen } from "./components/DriverDashboardScreen";
import SetupStatusScreen from "./components/SetupStatusScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role?: 'customer' | 'driver';
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  // Removed showRoleSelection - no longer needed
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'driver'>('customer');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    console.log('🔄 Starting app initialization...');
    
    try {
      const bypassPermissions = import.meta.env.VITE_BYPASS_PERMISSIONS === 'true';
      // Initialize push notifications first (async, doesn't block UI)
      // Allow disabling on native via env to isolate crashes: set VITE_DISABLE_NATIVE_PUSH=true
      try {
        const disableNativePush = import.meta.env.VITE_DISABLE_NATIVE_PUSH === 'true';
        if (!disableNativePush) {
          initializePushNotifications().catch(error => {
            console.warn('Push notifications initialization failed (non-critical):', error);
          });
        } else {
          console.warn('Native push initialization disabled by VITE_DISABLE_NATIVE_PUSH');
        }
      } catch (pushError) {
        console.warn('Push notifications setup failed (non-critical):', pushError);
      }

      // Web push (Firebase Messaging) setup – only on web
      try {
        if (!Capacitor.isNativePlatform() && 'serviceWorker' in navigator && 'Notification' in window) {
          if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) {
            console.warn('VITE_FIREBASE_VAPID_KEY is not set. Web push token retrieval will fail.');
          }

          const granted = await requestNotificationPermission();
          if (granted) {
            const token = await getFCMToken();
            if (token) {
              console.log('✅ Web push FCM token ready');
              // TODO: send token to backend for user mapping
            }

            const unsubscribe = onForegroundMessage((payload) => {
              console.log('📬 Foreground FCM message:', payload);
            });

            // Optional: store unsubscribe reference if needed later
            (window as any).__fcmUnsub = unsubscribe;
          }
        }
      } catch (webPushError) {
        console.warn('Web push setup failed (non-critical):', webPushError);
      }

      console.log('⏳ Showing splash screen for 2 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('📱 Checking app state...');
      const hasSeenOnboarding = safeGetItem("hasSeenOnboarding");
      const permissionsRequested = safeGetItem("permissions_requested");
      const savedRole = safeGetItem("user_role");
      
      console.log('App state:', { hasSeenOnboarding, permissionsRequested, savedRole });
      
      if (!hasSeenOnboarding) {
        console.log('➡️  Showing onboarding');
        setShowOnboarding(true);
        setIsLoading(false);
        return;
      }

      if (!permissionsRequested) {
        if (bypassPermissions) {
          console.warn('Bypassing permissions flow due to VITE_BYPASS_PERMISSIONS');
          safeSetItem('permissions_requested', 'true');
        } else {
          console.log('➡️  Showing permissions screen');
          setShowPermissions(true);
          setIsLoading(false);
          return;
        }
      }

      console.log('👤 Checking for user data...');
      const userData = safeGetItem("user");
      if (userData) {
        try {
          const parsedUser = safeGetJSON<User>("user", null as any);
          if (parsedUser) {
            console.log('✅ User data found:', parsedUser.name);
            setUser(parsedUser);
            setUserRole(parsedUser.role || savedRole as 'customer' | 'driver' || 'customer');
          }
        } catch (parseError) {
          console.error('⚠️  Error parsing user data, clearing:', parseError);
          safeRemoveItem("user");
        }
      } else if (savedRole) {
        console.log('✅ Saved role found:', savedRole);
        setUserRole(savedRole as 'customer' | 'driver');
      }
      
      console.log('✅ Initialization complete');
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Critical error during app initialization:', error);
      console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
      // Always set loading to false, even on error
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    safeSetItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
    setShowPermissions(true);
  };

  const handlePermissionsComplete = () => {
    setShowPermissions(false);
    // Skip RoleSelection - user can choose role directly in AuthScreen
  };

  const handleRoleSelect = (role: 'customer' | 'driver') => {
    setUserRole(role);
    // RoleSelection screen removed - role is now selected in AuthScreen
  };

  const handleLogin = (userData: User) => {
    const userWithRole = { ...userData, role: userRole };
    setUser(userWithRole);
    safeSetJSON("user", userWithRole);
  };

  const handleLogout = () => {
    setUser(null);
    safeRemoveItem("user");
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreens onComplete={handleOnboardingComplete} />;
  }

  if (showPermissions) {
    return <PermissionScreen onComplete={handlePermissionsComplete} />;
  }

  // RoleSelection screen removed - users choose role directly in AuthScreen tabs

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={userRole === 'driver' ? "/driver-dashboard" : "/home"} replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/auth"
              element={
                user ? (
                  <Navigate to={userRole === 'driver' ? "/driver-dashboard" : "/home"} replace />
                ) : (
                  <AuthScreen onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/location-permission"
              element={<LocationPermission />}
            />
            
            {/* Customer-specific Routes */}
            {userRole === 'customer' && (
              <>
                <Route
                  path="/home"
                  element={
                    user ? (
                      <HomeScreen user={user} onLogout={handleLogout} />
                    ) : (
                      <Navigate to="/auth" replace />
                    )
                  }
                />
              </>
            )}

            {/* Driver-specific Routes */}
            {userRole === 'driver' && (
              <>
                <Route
                  path="/driver-dashboard"
                  element={
                    user ? <DriverDashboardScreen /> : <Navigate to="/auth" replace />
                  }
                />
              </>
            )}

            {/* Shared Routes (Both Customer & Driver) */}
            <Route
              path="/confirm-ride"
              element={
                user ? <ConfirmRideScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/searching"
              element={
                user ? <SearchingScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/driver-assigned/:rideId"
              element={
                user ? (
                  <DriverAssignedScreen />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/trip-ongoing/:rideId"
              element={
                user ? <TripOngoingScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/trip-completed/:rideId"
              element={
                user ? (
                  <TripCompletedScreen />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                user ? (
                  <ProfileScreen user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/ride-history"
              element={
                user ? <RideHistoryScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/payment-methods"
              element={
                user ? <PaymentMethodsScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/help-support"
              element={
                user ? <HelpSupportScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/notifications"
              element={
                user ? <NotificationsScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/settings"
              element={
                user ? <SettingsScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/saved-addresses"
              element={
                user ? <SavedAddressesScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/about"
              element={
                user ? <AboutScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/terms"
              element={
                user ? <TermsScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/privacy"
              element={
                user ? <PrivacyPolicyScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/wallet"
              element={
                user ? <WalletScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/vehicle-selection"
              element={
                user ? <VehicleSelectionScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/referral"
              element={
                user ? <ReferralScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/emergency"
              element={
                user ? <EmergencyScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/scheduled-rides"
              element={
                user ? <ScheduledRidesScreen /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/carpool"
              element={
                user ? <CarpoolScreen /> : <Navigate to="/auth" replace />
              }
            />

            {/* Setup & Testing Routes - Accessible without auth */}
            <Route path="/setup-status" element={<SetupStatusScreen />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
