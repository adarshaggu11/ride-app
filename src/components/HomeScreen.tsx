import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Menu, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import MapComponent from "./MapComponent";
import { vehicleTrackingService, Vehicle } from "@/services/vehicleTrackingService";

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
  const navigate = useNavigate();

  useEffect(() => {
    // Get current location on mount
    getCurrentLocation();
    
    // Simulate nearby drivers moving
  useEffect(() => {
    // Get current location on mount
    getCurrentLocation();
    
    // Initialize vehicle tracking service
    vehicleTrackingService.initializeMockVehicles(currentLocation, 20);
    vehicleTrackingService.startTracking();

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
  }, [currentLocation, selectedVehicleType]);

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
  }, []);

  const getCurrentLocation = async () => {
    try {
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Modern Header with Glass Effect */}
      <header className="glass shadow-lg p-4 flex items-center justify-between flex-shrink-0 relative z-20 border-b">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/profile")}
            className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-secondary text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ring-2 ring-primary/20"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
          <div>
            <p className="font-bold text-foreground">Hello, {user.name}! 👋</p>
            <p className="text-xs text-muted-foreground">Where would you like to go?</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/profile")}
          className="hover:bg-primary/10 rounded-full"
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
        
        {/* Current Location Button - Modern FAB */}
        <button 
          onClick={getCurrentLocation}
          className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-50 transform hover:scale-110 transition-all duration-300 z-10 ring-4 ring-white/50"
        >
          <Navigation className="w-6 h-6 text-primary" />
        </button>

        {/* Vehicle Type Filter */}
        <div className="absolute top-6 left-6 flex gap-2 z-10">
          <button
            onClick={() => setSelectedVehicleType(undefined)}
            className={`glass-dark px-4 py-2 rounded-full shadow-lg text-white text-sm font-semibold transition-all ${
              !selectedVehicleType ? 'ring-2 ring-white' : 'opacity-70'
            }`}
          >
            All ({nearbyVehicles.length})
          </button>
          <button
            onClick={() => setSelectedVehicleType('bike')}
            className={`glass-dark px-4 py-2 rounded-full shadow-lg text-white text-sm font-semibold transition-all ${
              selectedVehicleType === 'bike' ? 'ring-2 ring-white' : 'opacity-70'
            }`}
          >
            Bikes ({vehicleTrackingService.getVehiclesByType('bike').length})
          </button>
          <button
            onClick={() => setSelectedVehicleType('auto')}
            className={`glass-dark px-4 py-2 rounded-full shadow-lg text-white text-sm font-semibold transition-all ${
              selectedVehicleType === 'auto' ? 'ring-2 ring-white' : 'opacity-70'
            }`}
          >
            Autos ({vehicleTrackingService.getVehiclesByType('auto').length})
          </button>
          <button
            onClick={() => setSelectedVehicleType('car')}
            className={`glass-dark px-4 py-2 rounded-full shadow-lg text-white text-sm font-semibold transition-all ${
              selectedVehicleType === 'car' ? 'ring-2 ring-white' : 'opacity-70'
            }`}
          >
            Cars ({vehicleTrackingService.getVehiclesByType('car').length})
          </button>
        </div>

        {/* Live Status Indicator */}
        <div className="absolute bottom-6 left-6 glass-dark px-4 py-2 rounded-full shadow-lg z-10">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Live Tracking
          </p>
        </div>
      </div> className="text-white text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {nearbyDrivers.length} autos nearby
          </p>
        </div>
      </div>

      {/* Bottom Card - Modern Elevated Design */}
      <Card className="rounded-t-3xl shadow-2xl border-t flex-shrink-0 bg-gradient-to-b from-white to-gray-50/50">
        <div className="p-6 space-y-5">
          {/* Location Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="w-4 h-4 bg-primary rounded-full shadow-lg ring-4 ring-primary/20 flex-shrink-0"></div>
              <div className="flex-1 relative">
                <Input
                  ref={pickupInputRef}
                  placeholder="Pickup Location | పికప్ స్థానం"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="h-14 flex-1 border-2 border-border focus:border-primary transition-all duration-300 rounded-xl shadow-sm font-medium pl-4 bg-white"
                />
                {pickup && (
                  <button 
                    onClick={() => setPickup("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 group">
              <div className="w-4 h-4 bg-destructive rounded-full shadow-lg ring-4 ring-destructive/20 flex-shrink-0"></div>
              <div className="flex-1 relative">
                <Input
                  ref={dropInputRef}
                  placeholder="Drop Location | డ్రాప్ స్థానం"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="h-14 flex-1 border-2 border-border focus:border-destructive transition-all duration-300 rounded-xl shadow-sm font-medium pl-4 bg-white"
                />
                {drop && (
                  <button 
                    onClick={() => setDrop("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button - Premium Design */}
          <Button
            onClick={handleFindAuto}
            disabled={!pickup || !drop}
            className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-xl"
            size="lg"
          >
            {!pickup || !drop ? (
              "Enter locations to continue"
            ) : (
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Find Your Ride
              </span>
            )}
          </Button>

          {/* Quick Stats - Modern Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 shadow-sm">
              <p className="text-2xl font-extrabold text-blue-600">0</p>
              <p className="text-xs text-blue-800 font-medium">Total Rides</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 shadow-sm">
              <p className="text-2xl font-extrabold text-green-600">₹0</p>
              <p className="text-xs text-green-800 font-medium">Saved</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 shadow-sm">
              <p className="text-2xl font-extrabold text-purple-600">0</p>
              <p className="text-xs text-purple-800 font-medium">Points</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
