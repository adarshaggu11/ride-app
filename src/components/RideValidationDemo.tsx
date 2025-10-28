import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getDistanceBetweenPoints,
  validateRideDistance,
  validatePickupProximity,
  formatDistance,
  RIDE_LIMITS,
  type Coordinates,
  type RideType,
} from "@/utils/distanceValidation";

/**
 * Ride Validation Component - Rapido-style Logic
 * Validates rides based on distance limits and pickup proximity
 */
const RideValidationDemo = () => {
  const { toast } = useToast();
  const [rideType, setRideType] = useState<RideType>("auto");
  const [pickup, setPickup] = useState<Coordinates | null>(null);
  const [drop, setDrop] = useState<Coordinates | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");

  // 🌍 Step 1: Get current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        toast({
          title: "Location Set ✅",
          description: `Current location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Unable to Fetch Location",
          description: "Please enable location permissions in your browser.",
          variant: "destructive",
        });
      }
    );
  };

  // Parse coordinates from input
  const parseCoordinates = (input: string): Coordinates | null => {
    const parts = input.split(",").map((s) => s.trim());
    if (parts.length !== 2) return null;

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  };

  // Handle pickup input
  const handlePickupInput = (value: string) => {
    setPickupInput(value);
    const coords = parseCoordinates(value);
    if (coords) {
      setPickup(coords);
    }
  };

  // Handle drop input
  const handleDropInput = (value: string) => {
    setDropInput(value);
    const coords = parseCoordinates(value);
    if (coords) {
      setDrop(coords);
    }
  };

  // 🧠 Step 3: Validate Ride
  const validateRide = () => {
    // Check if locations are set
    if (!pickup || !drop) {
      toast({
        title: "Missing Locations",
        description: "Please select both pickup and drop locations.",
        variant: "destructive",
      });
      return;
    }

    // Validate ride distance based on vehicle type
    const distanceValidation = validateRideDistance(rideType, pickup, drop);
    const rideDistance = distanceValidation.distance;
    const maxDistance = RIDE_LIMITS[rideType];

    // Check if distance exceeds limit
    if (distanceValidation.status === "error") {
      toast({
        title: "Distance Limit Exceeded ❌",
        description: `Ride distance (${formatDistance(rideDistance)}) exceeds the ${maxDistance} km limit for ${rideType} rides.`,
        variant: "destructive",
      });
      return;
    }

    // Optional: Check pickup proximity to user location
    if (userLocation) {
      const proximityCheck = validatePickupProximity(userLocation, pickup, 3);

      if (!proximityCheck.isValid) {
        toast({
          title: "Pickup Too Far ⚠️",
          description: proximityCheck.warning,
          variant: "destructive",
        });
        return;
      }
    }

    // Success - Ride accepted
    toast({
      title: "Ride Accepted ✅",
      description: `Distance: ${formatDistance(rideDistance)} (${rideType.toUpperCase()} mode)`,
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          🚖 Ride Validator
          <span className="text-sm font-normal text-muted-foreground">
            (Rapido Logic)
          </span>
        </h2>

        {/* Current Location */}
        <div className="mb-6">
          <Button
            onClick={getCurrentLocation}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get Current Location
          </Button>

          {userLocation && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700">
                  Current Location Set
                </p>
                <p className="text-xs text-green-600">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ride Type Selection */}
        <div className="mb-4">
          <Label htmlFor="ride-type" className="text-sm font-semibold mb-2">
            Ride Type
          </Label>
          <Select
            value={rideType}
            onValueChange={(value) => setRideType(value as RideType)}
          >
            <SelectTrigger id="ride-type" className="w-full">
              <SelectValue placeholder="Select ride type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bike">
                🏍️ Bike (Max: {RIDE_LIMITS.bike} km)
              </SelectItem>
              <SelectItem value="auto">
                🛺 Auto (Max: {RIDE_LIMITS.auto} km)
              </SelectItem>
              <SelectItem value="car">
                🚗 Car (Max: {RIDE_LIMITS.car} km)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pickup Location */}
        <div className="mb-4">
          <Label htmlFor="pickup" className="text-sm font-semibold mb-2">
            Pickup Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="pickup"
              type="text"
              placeholder="Enter Lat,Lng (e.g. 17.385, 78.486)"
              value={pickupInput}
              onChange={(e) => handlePickupInput(e.target.value)}
              className="pl-10"
            />
          </div>
          {pickup && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Pickup set: {pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Example: Hyderabad - 17.385, 78.486
          </p>
        </div>

        {/* Drop Location */}
        <div className="mb-4">
          <Label htmlFor="drop" className="text-sm font-semibold mb-2">
            Drop Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
            <Input
              id="drop"
              type="text"
              placeholder="Enter Lat,Lng (e.g. 17.450, 78.512)"
              value={dropInput}
              onChange={(e) => handleDropInput(e.target.value)}
              className="pl-10"
            />
          </div>
          {drop && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Drop set: {drop.lat.toFixed(4)}, {drop.lng.toFixed(4)}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Example: Secunderabad - 17.450, 78.512
          </p>
        </div>

        {/* Distance Preview */}
        {pickup && drop && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                Estimated Distance:
              </span>
              <span className="text-lg font-bold text-blue-900">
                {formatDistance(getDistanceBetweenPoints(pickup, drop))}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium text-blue-700">
                {rideType.toUpperCase()} Limit:
              </span>
              <span className="text-sm font-bold text-blue-900">
                {RIDE_LIMITS[rideType]} km
              </span>
            </div>
          </div>
        )}

        {/* Validate Button */}
        <Button
          onClick={validateRide}
          className="w-full bg-green-600 hover:bg-green-700 text-lg font-semibold py-6"
          disabled={!pickup || !drop}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Validate Ride
        </Button>

        {/* Features List */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Features Included:
          </h4>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Works for manual pickup/drop input (from Google Maps or text fields)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Restricts ride based on max distance (Bike: 35km, Auto: 45km, Car: 60km)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Restricts pickup too far from user GPS (3 km limit)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Built with React hooks — plug & play</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Alerts user with clear messages like Rapido UI</span>
            </li>
          </ul>
        </div>

        {/* Test Data */}
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-sm mb-2 text-yellow-800">
            🧪 Quick Test Data:
          </h4>
          <div className="text-xs space-y-1 text-yellow-700">
            <p><strong>Short (8 km):</strong> Pickup: 17.385, 78.486 | Drop: 17.450, 78.512</p>
            <p><strong>Medium (42 km):</strong> Pickup: 17.385, 78.486 | Drop: 17.700, 78.750</p>
            <p><strong>Long (55 km):</strong> Pickup: 17.385, 78.486 | Drop: 17.850, 78.900</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RideValidationDemo;
