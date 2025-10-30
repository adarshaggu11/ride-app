import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, IndianRupee, Zap, ArrowLeft, TrendingUp } from "lucide-react";
import MapComponent from "./MapComponent";

const ConfirmRideScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickup, drop, pickupCoords, dropCoords } = location.state || { 
    pickup: "", 
    drop: "",
    pickupCoords: { lat: 17.385, lng: 78.486 },
    dropCoords: { lat: 17.447, lng: 78.379 }
  };
  
  const [pickupLocation] = useState(pickupCoords || { lat: 17.385, lng: 78.486 });
  const [dropLocation] = useState(dropCoords || { lat: 17.447, lng: 78.379 });
  const [distance, setDistance] = useState("5.2 km");
  const [duration, setDuration] = useState("15 min");
  const [fare, setFare] = useState(80);

  // Calculate real distance and fare
  useEffect(() => {
    if (window.google?.maps && pickupLocation && dropLocation) {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [pickupLocation],
        destinations: [dropLocation],
        travelMode: google.maps.TravelMode.DRIVING,
      }, (response, status) => {
        if (status === 'OK' && response?.rows[0]?.elements[0]) {
          const element = response.rows[0].elements[0];
          if (element.status === 'OK') {
            setDistance(element.distance.text);
            setDuration(element.duration.text);
            
            // Calculate fare: ₹20 base + ₹12/km
            const distanceKm = element.distance.value / 1000;
            const calculatedFare = Math.round(20 + (distanceKm * 12));
            setFare(calculatedFare);
          }
        }
      });
    }
  }, [pickupLocation, dropLocation]);

  const handleConfirm = () => {
    navigate("/searching", {
      state: {
        pickup,
        drop,
        pickupCoords: pickupLocation,
        dropCoords: dropLocation,
        distance,
        duration,
        fare
      }
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex flex-col overflow-hidden">
      {/* Premium Header */}
      <header className="bg-white shadow-lg p-4 flex items-center gap-3 relative z-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Premium Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-yellow-400/30">
          <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>

        <div className="flex-1">
          <p className="font-black text-base bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Confirm Your Ride
          </p>
          <p className="text-xs text-muted-foreground font-semibold">Review details & confirm</p>
        </div>
      </header>

      {/* Map Area with Route Preview */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent
          center={pickupLocation}
          zoom={13}
          showRoute={true}
          origin={pickupLocation}
          destination={dropLocation}
          showDriverMarker={false}
          showUserLocation={false}
          className="absolute inset-0 w-full h-full"
        />

        {/* Distance Badge on Map */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-yellow-400 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
            <span className="font-black text-lg text-gray-800">{distance}</span>
            <span className="text-sm text-gray-500">•</span>
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-gray-600">{duration}</span>
          </div>
        </div>
      </div>

      {/* Premium Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t-2 border-gray-100 flex-shrink-0 bg-white">
        <div className="p-6 space-y-5">
          {/* Location Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mt-1 shadow-lg ring-4 ring-green-400/30 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold mb-1">PICKUP LOCATION</p>
                <p className="font-bold text-gray-900 text-sm leading-relaxed">{pickup}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mt-1 shadow-lg ring-4 ring-orange-400/30 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold mb-1">DROP LOCATION</p>
                <p className="font-bold text-gray-900 text-sm leading-relaxed">{drop}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-md">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-bold">Distance</span>
              </div>
              <p className="text-2xl font-black text-blue-700">{distance}</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-md">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-bold">Duration</span>
              </div>
              <p className="text-2xl font-black text-purple-700">{duration}</p>
            </Card>
          </div>

          {/* Premium Fare Card - NO TELUGU */}
          <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-1">Estimated Fare</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-600 font-semibold">Final price after ride</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gradient-to-br from-yellow-100 to-orange-100 px-4 py-2 rounded-2xl shadow-md border border-yellow-300">
                <IndianRupee className="w-7 h-7 text-yellow-700" strokeWidth={3} />
                <span className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{fare}</span>
              </div>
            </div>
          </Card>

          {/* Premium Confirm Button - NO TELUGU */}
          <Button
            onClick={handleConfirm}
            className="w-full h-16 text-lg font-black shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)'
            }}
            size="lg"
          >
            <Zap className="w-6 h-6 mr-2" />
            Confirm Booking
          </Button>

          {/* Change Location Link */}
          <button
            onClick={() => navigate(-1)}
            className="w-full text-center text-gray-600 hover:text-gray-900 font-bold text-sm py-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            Change Location
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmRideScreen;
