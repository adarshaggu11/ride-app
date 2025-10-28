import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, MapPin, DollarSign, Clock } from "lucide-react";
import {
  calculateFare,
  estimateRideDuration,
  formatDistance,
  getDistanceBetweenPoints,
  validatePickupProximity,
  getSurgeStatus,
  type Coordinates,
  type RideType
} from "@/utils/distanceValidation";

/**
 * Demo component to test the complete ride estimation logic
 * Based on the React + JS code provided
 */
const RideEstimatorDemo = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [pickup, setPickup] = useState<Coordinates | null>(null);
  const [drop, setDrop] = useState<Coordinates | null>(null);
  const [estimate, setEstimate] = useState<any>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");

  // Get current GPS location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("⚠️ Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(location);
        alert(`📍 Current location detected!\n${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("⚠️ Enable location permission in your browser settings.");
      }
    );
  };

  // Validate pickup location proximity to user
  const validatePickup = (selectedPickup: Coordinates) => {
    if (!userLocation) {
      setWarning(null);
      return;
    }

    const validation = validatePickupProximity(userLocation, selectedPickup, 2);
    if (!validation.isValid && validation.warning) {
      setWarning(validation.warning);
    } else {
      setWarning(null);
    }
  };

  // Parse coordinates from input
  const parseCoordinates = (input: string): Coordinates | null => {
    const parts = input.split(",").map(s => s.trim());
    if (parts.length !== 2) return null;
    
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  };

  // Handle pickup input
  const handlePickupChange = (value: string) => {
    setPickupInput(value);
    const coords = parseCoordinates(value);
    if (coords) {
      setPickup(coords);
      validatePickup(coords);
    }
  };

  // Handle drop input
  const handleDropChange = (value: string) => {
    setDropInput(value);
    const coords = parseCoordinates(value);
    if (coords) {
      setDrop(coords);
    }
  };

  // Estimate ride for selected vehicle type
  const estimateRide = (type: RideType) => {
    if (!pickup || !drop) {
      alert("📍 Please enter both pickup and drop locations!");
      return;
    }

    const distanceKm = getDistanceBetweenPoints(pickup, drop);
    const durationMin = estimateRideDuration(distanceKm, type);
    const total = calculateFare(distanceKm, type, true); // Apply surge pricing
    const surgeStatus = getSurgeStatus();

    setEstimate({
      distanceKm,
      durationMin,
      total,
      type,
      surgeActive: surgeStatus.isActive,
      surgeMultiplier: surgeStatus.multiplier,
    });
  };

  // Get surge status
  const surgeStatus = getSurgeStatus();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          🚘 Ride Fare Estimator Demo
        </h2>

        {/* Surge Pricing Alert */}
        {surgeStatus.isActive && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-orange-700 font-medium">
              {surgeStatus.message}
            </p>
          </div>
        )}

        {/* Get Current Location */}
        <Button
          onClick={getUserLocation}
          className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Get Current Location
        </Button>

        {userLocation && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              📍 Current Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          </div>
        )}

        {/* Pickup Location Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Pickup Location
          </label>
          <Input
            placeholder="Enter Lat,Lng (e.g. 17.385,78.486)"
            value={pickupInput}
            onChange={(e) => handlePickupChange(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Hyderabad - 17.385, 78.486
          </p>
        </div>

        {/* Drop Location Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Drop Location
          </label>
          <Input
            placeholder="Enter Lat,Lng (e.g. 17.450,78.512)"
            value={dropInput}
            onChange={(e) => handleDropChange(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Secunderabad - 17.450, 78.512
          </p>
        </div>

        {/* Pickup Proximity Warning */}
        {warning && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-700">{warning}</p>
          </div>
        )}

        {/* Vehicle Type Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Select Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["bike", "auto", "car"] as RideType[]).map((type) => (
              <Button
                key={type}
                onClick={() => estimateRide(type)}
                className="bg-green-600 hover:bg-green-700 text-white capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Estimate Result */}
        {estimate && (
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 border-2 border-primary/20">
            <h3 className="font-bold text-xl mb-4 capitalize flex items-center gap-2">
              {estimate.type} Ride Estimate
              {estimate.surgeActive && (
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                  🔥 Surge
                </span>
              )}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5" />
                  Distance
                </span>
                <span className="font-bold text-lg">
                  {formatDistance(estimate.distanceKm)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5" />
                  Duration
                </span>
                <span className="font-bold text-lg">
                  {estimate.durationMin} mins
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary">
                <span className="flex items-center gap-2 text-primary font-semibold">
                  <DollarSign className="w-5 h-5" />
                  Total Fare
                </span>
                <span className="font-bold text-2xl text-primary">
                  ₹{estimate.total}
                </span>
              </div>

              {estimate.surgeActive && (
                <p className="text-xs text-center text-gray-600">
                  * Price includes {((estimate.surgeMultiplier - 1) * 100).toFixed(0)}% surge charge
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-sm mb-2">📋 How to Use:</h4>
          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
            <li>Click "Get Current Location" to fetch your GPS coordinates</li>
            <li>Enter pickup location as Latitude, Longitude (or use current location)</li>
            <li>Enter drop location as Latitude, Longitude</li>
            <li>Select a vehicle type (Bike, Auto, or Car)</li>
            <li>View estimated distance, duration, and fare</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default RideEstimatorDemo;
