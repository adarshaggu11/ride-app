import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bike, Car, Users, Clock, MapPin, AlertCircle, CheckCircle, Zap, TrendingUp } from "lucide-react";
import MapComponent from "./MapComponent";
import { vehicleTrackingService, Vehicle } from "@/services/vehicleTrackingService";
import { 
  getDistanceBetweenPoints, 
  validateRideDistance, 
  formatDistance,
  estimateRideDuration,
  calculateFare,
  getSurgeStatus,
  type RideType 
} from "@/utils/distanceValidation";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const { pickup, drop, pickupCoords, dropCoords } = location.state || {};
  
  const [selectedVehicle, setSelectedVehicle] = useState<string>("auto");
  const [nearbyVehicles, setNearbyVehicles] = useState<Vehicle[]>([]);
  const [rideDistance, setRideDistance] = useState<number>(0);
  const [surgeActive, setSurgeActive] = useState<boolean>(false);

  // Calculate distance on mount
  useEffect(() => {
    if (pickupCoords && dropCoords) {
      const distance = getDistanceBetweenPoints(pickupCoords, dropCoords);
      setRideDistance(distance);
    }
    
    // Check surge pricing status
    const surgeStatus = getSurgeStatus();
    setSurgeActive(surgeStatus.isActive);
  }, [pickupCoords, dropCoords]);

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

    return () => {
      unsubscribe();
    };
  }, [pickupCoords, selectedVehicle]);

  const vehicles: VehicleOption[] = [
    {
      id: "bike",
      name: "Bike",
      icon: Bike,
      image: "/images/bike-icon.svg",
      price: calculateFare(rideDistance, 'bike'),
      duration: `${estimateRideDuration(rideDistance, 'bike')} min`,
      capacity: "1 person",
      description: "Quick & Affordable",
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: "auto",
      name: "Auto",
      icon: Users,
      image: "/images/auto-icon.svg",
      price: calculateFare(rideDistance, 'auto'),
      duration: `${estimateRideDuration(rideDistance, 'auto')} min`,
      capacity: "3 persons",
      description: "Most Popular",
      color: "from-primary to-accent"
    },
    {
      id: "car",
      name: "Car",
      icon: Car,
      image: "/images/car-icon.svg",
      price: calculateFare(rideDistance, 'car'),
      duration: `${estimateRideDuration(rideDistance, 'car')} min`,
      capacity: "4 persons",
      description: "Comfortable",
      color: "from-amber-500 to-orange-600"
    }
  ];

  // Get validation for each vehicle
  const getValidation = (vehicleId: string) => {
    if (!pickupCoords || !dropCoords) return null;
    return validateRideDistance(vehicleId as RideType, pickupCoords, dropCoords);
  };

  const handleContinue = () => {
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const validation = getValidation(selectedVehicle);

    // Check if ride exceeds distance limit
    if (validation && validation.status === 'error') {
      toast({
        title: "Distance Limit Exceeded",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    // Show warning if close to limit
    if (validation && validation.status === 'warning') {
      toast({
        title: "Distance Warning",
        description: validation.message,
      });
    }

    navigate("/confirm-ride", {
      state: {
        pickup,
        drop,
        pickupCoords,
        dropCoords,
        vehicle: {
          type: vehicle?.name,
          price: vehicle?.price,
          duration: vehicle?.duration,
          distance: rideDistance,
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Header with Logo */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 bg-white border-b sticky top-0 z-10 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        {/* Premium Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h1 className="font-black text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Choose a Ride
            </h1>
            <p className="text-xs text-muted-foreground font-semibold">Select your preferred vehicle</p>
          </div>
        </div>

        {/* Nearby Count Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-green-700">{nearbyVehicles.length} nearby</span>
        </div>
      </div>

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

        {/* Route Info Overlay - Premium */}
        <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-400/30 shadow-lg"></div>
              <div className="w-0.5 h-10 bg-gradient-to-b from-green-500 via-yellow-500 to-orange-500 rounded-full"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full ring-4 ring-orange-400/30 shadow-lg"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-gray-900 font-bold text-sm line-clamp-1">{pickup || "Pickup Location"}</p>
                <p className="text-gray-500 text-xs font-medium">Current location</p>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm line-clamp-1">{drop || "Drop Location"}</p>
                <p className="text-gray-500 text-xs font-medium">Destination</p>
              </div>
            </div>
          </div>
          
          {/* Distance Display */}
          {rideDistance > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-gray-700 text-xs flex items-center gap-2 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-yellow-600" />
                  Total Distance
                </p>
                <span className="text-sm font-black text-yellow-600">{formatDistance(rideDistance)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Removed duplicate nearby count - now in header */}
      </div>

      {/* Vehicle Selection Bottom Sheet - Premium */}
      <div className="flex-shrink-0 bg-white rounded-t-3xl shadow-2xl border-t-2 border-gray-100">
        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              Ride Options
            </h2>
            {surgeActive ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-200">
                <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-bold text-orange-700">Peak Hours</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-medium">Choose wisely</p>
            )}
          </div>
          
          {/* Surge Pricing Alert */}
          {surgeActive && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-3 flex items-center gap-2 shadow-sm">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <p className="text-xs text-orange-800 font-semibold">
                Peak hour surge pricing active (50% increase). Prices shown include surge charges.
              </p>
            </div>
          )}

          {/* Premium Vehicle Cards */}
          <div className="space-y-3">
            {vehicles.map((vehicle) => {
              const Icon = vehicle.icon;
              const isSelected = selectedVehicle === vehicle.id;
              const validation = getValidation(vehicle.id);
              const isDisabled = validation?.status === 'error';
              
              return (
                <Card
                  key={vehicle.id}
                  onClick={() => !isDisabled && setSelectedVehicle(vehicle.id)}
                  className={`p-4 transition-all duration-300 transform ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-2xl hover:scale-[1.02]'
                  } ${
                    isSelected
                      ? 'ring-2 ring-yellow-400 shadow-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Premium Vehicle Image */}
                    <div className={`w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg transition-all duration-300 ${
                      isSelected ? 'ring-2 ring-yellow-400 scale-110' : ''
                    }`} style={{
                      background: isSelected ? 'linear-gradient(135deg, #FCD34D, #F59E0B)' : '#f3f4f6'
                    }}>
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover p-2"
                        loading="lazy"
                      />
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-black text-lg">{vehicle.name}</h3>
                        <div className="text-right">
                          <p className="text-2xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                            ₹{vehicle.price}
                          </p>
                          {isSelected && !isDisabled && (
                            <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                              <CheckCircle className="w-3 h-3" fill="currentColor" />
                              Selected
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-semibold mb-2">{vehicle.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-yellow-600" />
                          {vehicle.duration}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Users className="w-3.5 h-3.5 text-yellow-600" />
                          {vehicle.capacity}
                        </span>
                      </div>

                      {/* Validation Status */}
                      {validation && (
                        <div className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${
                          validation.status === 'error' ? 'text-red-600' :
                          validation.status === 'warning' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {validation.status === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
                          {validation.status === 'warning' && <AlertCircle className="w-3.5 h-3.5" />}
                          {validation.status === 'success' && <CheckCircle className="w-3.5 h-3.5" />}
                          <span>{validation.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected && !isDisabled
                        ? 'border-yellow-500 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && !isDisabled && (
                        <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Premium Start Ride Button */}
          <Button
            onClick={handleContinue}
            className="w-full h-16 text-lg font-black shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)',
              color: 'white'
            }}
          >
            <span className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Start Ride • ₹{vehicles.find(v => v.id === selectedVehicle)?.price}
            </span>
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
