import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import OnboardingScreens from "./components/OnboardingScreens";
import AuthScreen from "./components/AuthScreen";
import { PermissionScreen } from "./components/PermissionScreen";
import { RoleSelection } from "./components/RoleSelection";
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
import RideEstimatorDemo from "./components/RideEstimatorDemo";
import RideValidationDemo from "./components/RideValidationDemo";
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
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'driver'>('customer');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    const permissionsRequested = localStorage.getItem("permissions_requested");
    const savedRole = localStorage.getItem("user_role");
    
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      setIsLoading(false);
      return;
    }

    if (!permissionsRequested) {
      setShowPermissions(true);
      setIsLoading(false);
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUserRole(parsedUser.role || savedRole || 'customer');
    } else if (savedRole) {
      setUserRole(savedRole as 'customer' | 'driver');
    }
    setIsLoading(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
    setShowPermissions(true);
  };

  const handlePermissionsComplete = () => {
    setShowPermissions(false);
    
    const userData = localStorage.getItem("user");
    if (!userData) {
      setShowRoleSelection(true);
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUserRole(parsedUser.role || 'customer');
    }
  };

  const handleRoleSelect = (role: 'customer' | 'driver') => {
    setUserRole(role);
    setShowRoleSelection(false);
  };

  const handleLogin = (userData: User) => {
    const userWithRole = { ...userData, role: userRole };
    setUser(userWithRole);
    localStorage.setItem("user", JSON.stringify(userWithRole));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
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

  if (showRoleSelection) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

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
            
            {/* Customer Routes */}
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
                <Route
                  path="/emergency"
                  element={
                    user ? <EmergencyScreen /> : <Navigate to="/auth" replace />
                  }
                />
              </>
            )}

            {/* Driver Routes */}
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
            <Route
              path="/driver-dashboard"
              element={
                user ? <DriverDashboardScreen /> : <Navigate to="/auth" replace />
              }
            />

            {/* Demo/Testing Routes - Accessible without auth for testing */}
            <Route path="/demo/estimator" element={<RideEstimatorDemo />} />
            <Route path="/demo/validator" element={<RideValidationDemo />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
