import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import OnboardingScreens from "./components/OnboardingScreens";
import AuthScreen from "./components/AuthScreen";
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
import NotFound from "./pages/NotFound";
import { offlineService } from "./services/offlineService";

const queryClient = new QueryClient();

interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Show splash for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      setIsLoading(false);
      return;
    }

    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Initialize offline service for PWA
    // Commented out for now - will add when PWA is fully configured
    /* try {
      if ('serviceWorker' in navigator) {
        await offlineService.register();
      }
    } catch (error) {
      console.error("Failed to initialize offline service:", error);
    } */

    setAppInitialized(true);
    setIsLoading(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
    setAppInitialized(true);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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
                appInitialized && user ? (
                  <Navigate to="/home" replace />
                ) : appInitialized && !user ? (
                  <Navigate to="/auth" replace />
                ) : (
                  <SplashScreen />
                )
              }
            />
            <Route
              path="/auth"
              element={
                user ? (
                  <Navigate to="/home" replace />
                ) : (
                  <AuthScreen onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/location-permission"
              element={<LocationPermission />}
            />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
