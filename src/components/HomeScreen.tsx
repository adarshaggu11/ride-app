import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Menu, User, Bell, Zap, TrendingUp, Award, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import MapComponent from "./MapComponent";
import { vehicleTrackingService, Vehicle } from "@/services/vehicleTrackingService";
import { getUnreadNotificationCount } from "@/services/pushNotifications";

interface HomeScreenProps {
  user: { id: string; name: string; phone: string; avatar: string };
  onLogout: () => void;
}

const HomeScreen = ({ user, onLogout }: HomeScreenProps) => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupCoords, setPickupCoords] = useState({ lat: 17.385, lng: 78.486 });
  const [dropCoords, setDropCoords] = useState({ lat: 17.447, lng: 78.379 });
  const [currentLocation, setCurrentLocation] = useState({ lat: 17.385, lng: 78.486 });
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropInputRef = useRef<HTMLInputElement>(null);
  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [dropAutocomplete, setDropAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [nearbyVehicles, setNearbyVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<'bike' | 'auto' | 'car' | undefined>(undefined);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const getCurrentLocation = async () => {
    try {
      // Centralized flag helper
      const { isBypassPermissionsEnabled } = await import('@/utils/flags');
      const bypassPermissions = isBypassPermissionsEnabled();
      if (bypassPermissions) {
        // Skip geolocation calls entirely when bypassing permissions
        setPickup('Location temporarily disabled');
        return;
      }
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setCurrentLocation(location);
            setPickupCoords(location);
            
            // Reverse geocode to get address
            if (window.google?.maps) {
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ location }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  setPickup(results[0].formatted_address);
                } else {
                  setPickup(`Current Location (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`);
                }
              });
            } else {
              setPickup(`Current Location (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            setPickup("Enable location for better experience");
          }
        );
      }
    } catch (error) {
      console.error("Geolocation error:", error);
    }
  };

  useEffect(() => {
    // Get current location on mount
    getCurrentLocation();
    
    // Get unread notification count
    const count = getUnreadNotificationCount();
    setUnreadCount(count);
    
    // Initialize vehicle tracking service only in development
    // In production, vehicles will be fetched from backend API
    if (import.meta.env.DEV) {
      vehicleTrackingService.initializeMockVehicles(currentLocation, 20);
      vehicleTrackingService.startTracking();
    }

    // Subscribe to vehicle updates
    const unsubscribe = vehicleTrackingService.subscribe((vehicles) => {
      // Get vehicles within 5km radius
      const nearby = vehicleTrackingService.getNearbyVehicles(
        currentLocation.lat,
        currentLocation.lng,
        5,
        selectedVehicleType
      );
      setNearbyVehicles(nearby);
    });

    return () => {
      unsubscribe();
      vehicleTrackingService.stopTracking();
    };
  }, [currentLocation.lat, currentLocation.lng, selectedVehicleType]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const initAutocomplete = () => {
      if (!window.google?.maps?.places) {
        setTimeout(initAutocomplete, 500);
        return;
      }

      // Pickup autocomplete
      if (pickupInputRef.current && !pickupAutocomplete) {
        const autocomplete = new google.maps.places.Autocomplete(pickupInputRef.current, {
          componentRestrictions: { country: 'in' },
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['establishment', 'geocode']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const coords = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            setPickupCoords(coords);
            setPickup(place.formatted_address || place.name || '');
          }
        });

        setPickupAutocomplete(autocomplete);
      }

      // Drop autocomplete
      if (dropInputRef.current && !dropAutocomplete) {
        const autocomplete = new google.maps.places.Autocomplete(dropInputRef.current, {
          componentRestrictions: { country: 'in' },
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['establishment', 'geocode']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const coords = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            setDropCoords(coords);
            setDrop(place.formatted_address || place.name || '');
          }
        });

        setDropAutocomplete(autocomplete);
      }
    };

    initAutocomplete();
  }, [pickupAutocomplete, dropAutocomplete]);

  const handleFindAuto = () => {
    if (!pickup || !drop) {
      return;
    }
    navigate("/vehicle-selection", { 
      state: { 
        pickup, 
        drop,
        pickupCoords,
        dropCoords
      } 
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">
      {/* Premium Header with Logo */}
      <header className="bg-white shadow-lg p-4 flex items-center justify-between flex-shrink-0 relative z-20 border-b">
        {/* Logo & User Section */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-yellow-400/30">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-black text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Hey, {user.name.split(' ')[0]}!
            </p>
            <p className="text-xs text-muted-foreground font-semibold">Where to today?</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/notifications")}
            className="hover:bg-yellow-50 rounded-full relative transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/profile")}
            className="hover:bg-yellow-50 rounded-full transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </Button>
        </div>
      </header>

      {/* Map Area with Current Location */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent
          center={currentLocation}
          zoom={15}
          showDriverMarker={false}
          showRoute={false}
          nearbyVehicles={nearbyVehicles}
          vehicleType={selectedVehicleType}
          showUserLocation={true}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Premium Current Location Button */}
        <button 
          onClick={getCurrentLocation}
          className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transform transition-all duration-300 z-10 ring-4 ring-white"
        >
          <Navigation className="w-7 h-7 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Premium Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t-2 border-gray-100 flex-shrink-0 bg-white">
        <div className="p-6 space-y-5">
          {/* Location Inputs - No Telugu */}
          <div className="space-y-4">
            {/* Pickup */}
            <div className="flex items-center gap-3 group">
              <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg ring-4 ring-green-400/30 flex-shrink-0"></div>
              <div className="flex-1 relative">
                <Input
                  ref={pickupInputRef}
                  placeholder="Pickup Location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="h-14 flex-1 border-2 border-gray-200 focus:border-yellow-500 transition-all duration-300 rounded-xl shadow-sm font-semibold pl-4 bg-white"
                />
                {pickup && (
                  <button 
                    onClick={() => setPickup("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* Drop */}
            <div className="flex items-center gap-3 group">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg ring-4 ring-orange-400/30 flex-shrink-0"></div>
              <div className="flex-1 relative">
                <Input
                  ref={dropInputRef}
                  placeholder="Drop Location"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="h-14 flex-1 border-2 border-gray-200 focus:border-orange-500 transition-all duration-300 rounded-xl shadow-sm font-semibold pl-4 bg-white"
                />
                {drop && (
                  <button 
                    onClick={() => setDrop("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Premium CTA Button */}
          <Button
            onClick={handleFindAuto}
            disabled={!pickup || !drop}
            className="w-full h-16 text-lg font-black shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 border-0"
            style={{
              background: !pickup || !drop ? '#E5E7EB' : 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)',
              color: !pickup || !drop ? '#9CA3AF' : 'white'
            }}
            size="lg"
          >
            {!pickup || !drop ? (
              "Enter locations to continue"
            ) : (
              <span className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                Find Your Ride Now
              </span>
            )}
          </Button>

          {/* Premium Stats Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300 shadow-md border border-yellow-200">
              <TrendingUp className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-2xl font-black text-yellow-700">0</p>
              <p className="text-[10px] text-yellow-800 font-bold">Total Rides</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300 shadow-md border border-amber-200">
              <Wallet className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <p className="text-2xl font-black text-amber-700">₹0</p>
              <p className="text-[10px] text-amber-800 font-bold">Saved</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300 shadow-md border border-orange-200">
              <Award className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-2xl font-black text-orange-700">0</p>
              <p className="text-[10px] text-orange-800 font-bold">Points</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
