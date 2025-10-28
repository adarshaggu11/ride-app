import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bike, Car, Users, Clock, MapPin } from "lucide-react";
import MapComponent from "./MapComponent";
import { vehicleTrackingService, Vehicle } from "@/services/vehicleTrackingService";

interface VehicleOption {
  id: string;
  name: string;
  icon: typeof Bike;
  image: string;
  price: number;
  duration: string;
  capacity: string;
  description: string;
  color: string;
}

const VehicleSelectionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickup, drop, pickupCoords, dropCoords } = location.state || {};
  
  const [selectedVehicle, setSelectedVehicle] = useState<string>("auto");
  const [nearbyVehicles, setNearbyVehicles] = useState<Vehicle[]>([]);
  const vehicles: VehicleOption[] = [
    {
      id: "bike",
      name: "Bike",
      icon: Bike,
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=300&fit=crop",
      price: 49,
      duration: "8-11 min",
      capacity: "1 person",
      description: "Quick & Affordable",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "auto",
      name: "Auto",
      icon: Users,
      image: "https://images.unsplash.com/photo-1590642916589-592bca10dfbf?w=400&h=300&fit=crop",
      price: 85,
      duration: "10-15 min",
      capacity: "3 persons",
      description: "Most Popular",
      color: "from-primary to-accent"
    },
    {
      id: "car",
      name: "Car",
      icon: Car,
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
      price: 120,
      duration: "12-18 min",
      capacity: "4 persons",
      description: "Comfortable",
      color: "from-purple-500 to-purple-600"
    }
  ];

  // Track vehicles on map based on selected type
  useEffect(() => {
    if (!pickupCoords) return;

    // Subscribe to vehicle updates
    const unsubscribe = vehicleTrackingService.subscribe((vehicles) => {
      const vehicleType = selectedVehicle as 'bike' | 'auto' | 'car';
      const nearby = vehicleTrackingService.getNearbyVehicles(
        pickupCoords.lat,
        pickupCoords.lng,
        5,
        vehicleType
      );
      setNearbyVehicles(nearby);
    });

    return () => unsubscribe();
  }, [pickupCoords, selectedVehicle]);}
  ];

  const handleContinue = () => {
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    navigate("/confirm-ride", {
      state: {
        pickup,
        drop,
        pickupCoords,
        dropCoords,
        vehicle: {
          type: vehicle?.name,
          price: vehicle?.price,
          duration: vehicle?.duration
        }
      }
    });
  };
      {/* Map Section */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent
          center={pickupCoords || { lat: 17.385, lng: 78.486 }}
          zoom={14}
          showRoute={false}
          showDriverMarker={false}
          nearbyVehicles={nearbyVehicles}
          vehicleType={selectedVehicle as 'bike' | 'auto' | 'car'}
          showUserLocation={true}
          className="absolute inset-0 w-full h-full"
        />

        {/* Route Info Overlay */}
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-bold text-lg">Choose a Ride</h1>
          <p className="text-xs text-muted-foreground">Select your preferred vehicle</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent
          center={pickupCoords || { lat: 17.385, lng: 78.486 }}
          zoom={13}
            </div>
          </div>
        </div>

        {/* Nearby Vehicles Count */}
        <div className="absolute bottom-4 left-4 glass-dark px-4 py-2 rounded-full shadow-lg">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {nearbyVehicles.length} nearby
          </p>
        </div>
      </div>

        {/* Route Info Overlay */}
        <div className="absolute top-4 left-4 right-4 glass-dark p-3 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full ring-4 ring-green-400/30"></div>
              <div className="w-0.5 h-8 bg-gradient-to-b from-green-400 to-red-400"></div>
              <div className="w-3 h-3 bg-red-400 rounded-full ring-4 ring-red-400/30"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-white font-semibold text-sm line-clamp-1">{pickup || "Pickup Location"}</p>
                <p className="text-white/60 text-xs">Current location</p>
              </div>
              <div>
                <p className="text-white font-semibold text-sm line-clamp-1">{drop || "Drop Location"}</p>
                <p className="text-white/60 text-xs">Destination</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Bottom Sheet */}
      <div className="flex-shrink-0 bg-white rounded-t-3xl shadow-2xl">
        <div className="p-6 space-y-4">
          {/* Ride Preferences Title */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Ride Preferences
            </h2>
            <p className="text-sm text-muted-foreground">Choose wisely</p>
          </div>

          {/* Vehicle Cards */}
          <div className="space-y-3">
            {vehicles.map((vehicle) => {
              const Icon = vehicle.icon;
              const isSelected = selectedVehicle === vehicle.id;
              
              return (
                <Card
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-lg bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Vehicle Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-base">{vehicle.name}</h3>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">₹{vehicle.price}</p>
                          {isSelected && (
                            <p className="text-xs text-green-600 font-semibold">Selected</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{vehicle.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {vehicle.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {vehicle.capacity}
                        </span>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Start Ride Button */}
          <Button
            onClick={handleContinue}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 shadow-xl"
          >
            Start Ride • ₹{vehicles.find(v => v.id === selectedVehicle)?.price}
          </Button>

          {/* Payment Info */}
          <p className="text-center text-xs text-muted-foreground">
            Cash, UPI & Cards accepted - No hidden charges
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelectionScreen;
