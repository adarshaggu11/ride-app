import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, AlertCircle, Zap, Navigation, Clock, Shield, Star } from "lucide-react";
import MapComponent from "./MapComponent";

const TripOngoingScreen = () => {
  const navigate = useNavigate();
  const { rideId } = useParams();
  const [driverLocation, setDriverLocation] = useState({ lat: 17.385, lng: 78.486 });
  const [destination] = useState({ lat: 17.447, lng: 78.379 });

  useEffect(() => {
    // Simulate trip completion after 10 seconds (increased for demo)
    const timer = setTimeout(() => {
      navigate(`/trip-completed/${rideId}`);
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate, rideId]);

  // Simulate live driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        // Move driver slightly towards destination
        lat: prev.lat + (destination.lat - prev.lat) * 0.1,
        lng: prev.lng + (destination.lng - prev.lng) * 0.1,
      }));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [destination]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex flex-col">
      {/* Premium Header */}
      <header className="bg-white shadow-lg p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {/* Premium Logo */}
          <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-yellow-400/30 animate-pulse">
            <Navigation className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-black text-base bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Trip in Progress
            </p>
            <p className="text-xs text-muted-foreground font-semibold">Enjoy your safe ride</p>
          </div>
        </div>

        {/* Call Driver Button */}
        <Button
          size="icon"
          className="w-10 h-10 rounded-xl border-0 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
          }}
          onClick={() => window.open("tel:+919876543210")}
        >
          <Phone className="w-5 h-5" />
        </Button>
      </header>

      {/* Map Area with Live Tracking */}
      <div className="flex-1 relative">
        <MapComponent
          center={driverLocation}
          zoom={14}
          showRoute={true}
          origin={driverLocation}
          destination={destination}
          driverLocation={driverLocation}
          showDriverMarker={true}
          className="w-full h-full"
        />

        {/* Premium SOS Button */}
        <button className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-2 hover:shadow-3xl hover:scale-110 transform transition-all duration-300 ring-4 ring-red-400/30 animate-pulse z-10">
          <AlertCircle className="w-6 h-6" strokeWidth={3} />
          SOS
        </button>

        {/* Live Status Badge */}
        <div className="absolute top-6 left-6 z-10">
          <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border-2 border-green-400 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-green-700">Live Tracking</span>
          </div>
        </div>

        {/* ETA Badge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-yellow-400">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">ARRIVING IN</p>
                <p className="text-lg font-black text-gray-800">5 minutes</p>
              </div>
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">LEFT</p>
                <p className="text-lg font-black text-gray-800">1.2 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t-2 border-gray-100 bg-white">
        <div className="p-6 space-y-5">
          {/* Destination Card */}
          <Card className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mt-1 shadow-lg ring-4 ring-orange-400/30 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-bold mb-1">DESTINATION</p>
                <p className="font-black text-lg text-gray-900">Arriving Soon...</p>
                <p className="text-sm text-gray-600 font-semibold mt-2">HITEC City, Hyderabad</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">ETA</p>
                <p className="text-2xl font-black text-orange-600">5 min</p>
              </div>
            </div>
          </Card>

          {/* Driver Info */}
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                RK
              </div>
              <div className="flex-1">
                <p className="font-black text-gray-900">Ravi Kumar</p>
                <p className="text-sm text-gray-600 font-semibold">AP 39 AB 1234</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs font-bold text-gray-600 ml-1">4.8</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Safety Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200 shadow-md">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-black text-green-800 mb-2">Your Safety is Our Priority</p>
                <p className="text-xs text-green-700 font-semibold leading-relaxed">
                  Your ride is being tracked in real-time. Use the SOS button in case of emergency.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl text-center border border-blue-200">
              <Navigation className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-blue-700">GPS Tracked</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl text-center border border-green-200">
              <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-green-700">Safe Ride</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl text-center border border-purple-200">
              <Zap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-purple-700">Fast Route</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TripOngoingScreen;
