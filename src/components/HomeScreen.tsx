import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Menu, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import MapComponent from "./MapComponent";

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
  const [nearbyDrivers, setNearbyDrivers] = useState<Array<{id: number; lat: number; lng: number; type: 'auto' | 'bike'}>>([
    { id: 1, lat: 17.390, lng: 78.490, type: 'auto' as const },
    { id: 2, lat: 17.380, lng: 78.480, type: 'auto' as const },
    { id: 3, lat: 17.388, lng: 78.495, type: 'bike' as const },
    { id: 4, lat: 17.382, lng: 78.488, type: 'auto' as const },
    { id: 5, lat: 17.392, lng: 78.485, type: 'bike' as const },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current location on mount
    getCurrentLocation();
    
    // Simulate nearby drivers moving
    const interval = setInterval(() => {
      setNearbyDrivers(prev => prev.map(driver => ({
        ...driver,
        lat: driver.lat + (Math.random() - 0.5) * 0.001,
        lng: driver.lng + (Math.random() - 0.5) * 0.001,
      })));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
    navigate("/confirm-ride", { 
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
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/profile")}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold hover:bg-primary/90 transition-colors"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
          <div>
            <p className="font-semibold">Hello, {user.name}!</p>
            <p className="text-xs text-gray-500">Where would you like to go?</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/profile")}
        >
          <User className="w-5 h-5" />
        </Button>
      </header>

      {/* Map Area with Current Location */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent
          center={currentLocation}
          zoom={15}
          showDriverMarker={false}
          showRoute={false}
          nearbyDrivers={nearbyDrivers}
          showUserLocation={true}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Current Location Button */}
        <button 
          onClick={getCurrentLocation}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 z-10"
        >
          <Navigation className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t flex-shrink-0">
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <Input
                ref={pickupInputRef}
                placeholder="Pickup Location | పికప్ స్థానం"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="h-12 flex-1"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <Input
                ref={dropInputRef}
                placeholder="Drop Location | డ్రాప్ స్థానం"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                className="h-12 flex-1"
              />
            </div>
          </div>

          <Button
            onClick={handleFindAuto}
            disabled={!pickup || !drop}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            Find Auto | ఆటో వెతకండి
          </Button>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-xs text-gray-500">Total Rides</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">₹0</p>
              <p className="text-xs text-gray-500">Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-xs text-gray-500">Points</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
