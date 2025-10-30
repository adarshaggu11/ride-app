import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MapPin, User, Car, MessageSquare, Zap, Star, Clock, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { callDriver, shareRideViaSMS } from "@/services/phoneService";
import { useToast } from "@/hooks/use-toast";
import MapComponent from "./MapComponent";

const DriverAssignedScreen = () => {
  const navigate = useNavigate();
  const { rideId } = useParams();
  const { toast } = useToast();
  const [pickupLocation] = useState({ lat: 17.385, lng: 78.486 });
  const [driverLocation, setDriverLocation] = useState({ lat: 17.375, lng: 78.476 });
  const [eta, setEta] = useState(2);
  
  // Driver details
  const driverPhone = "+919876543210";
  const driverName = "Ravi Kumar";
  const vehicleNumber = "AP 39 AB 1234";

  // Simulate driver approaching
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        lat: prev.lat + (pickupLocation.lat - prev.lat) * 0.15,
        lng: prev.lng + (pickupLocation.lng - prev.lng) * 0.15,
      }));
      setEta((prev) => Math.max(0, prev - 0.2));
    }, 1000);

    return () => clearInterval(interval);
  }, [pickupLocation]);

  const handleStartTrip = () => {
    navigate(`/trip-ongoing/${rideId}`);
  };

  const handleCallDriver = async () => {
    try {
      await callDriver(driverPhone);
      toast({
        title: "Calling Driver",
        description: `Calling ${driverName}...`,
      });
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Unable to make call. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareRide = async () => {
    try {
      await shareRideViaSMS("", {
        driverName,
        vehicleNumber,
        pickupLocation: "Banjara Hills",
        dropLocation: "HITEC City",
        estimatedTime: `${Math.ceil(eta)} minutes`,
      });
      toast({
        title: "Share Ride",
        description: "SMS app opened with ride details",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share ride details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex flex-col">
      {/* Premium Header */}
      <header className="bg-white shadow-lg p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {/* Premium Logo */}
          <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-yellow-400/30">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-black text-base bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Driver On The Way!
            </p>
            <p className="text-xs text-muted-foreground font-semibold">Track your driver in real-time</p>
          </div>
        </div>

        {/* Share Ride Button */}
        <Button
          size="icon"
          variant="outline"
          className="w-10 h-10 rounded-xl border-2 hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-300"
          onClick={handleShareRide}
          title="Share Ride"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </header>

      {/* Map Area with Driver Approaching */}
      <div className="flex-1 relative">
        <MapComponent
          center={pickupLocation}
          zoom={14}
          origin={pickupLocation}
          destination={driverLocation}
          driverLocation={driverLocation}
          showDriverMarker={true}
          showRoute={false}
          className="w-full h-full"
        />

        {/* Premium ETA Badge on Map */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-yellow-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-xl font-black">{Math.ceil(eta)}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">ARRIVING IN</p>
                <p className="text-lg font-black text-gray-800">{Math.ceil(eta)} minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Badge */}
        <div className="absolute bottom-6 right-6 z-10">
          <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border border-green-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-green-700">Verified Driver</span>
          </div>
        </div>
      </div>

      {/* Premium Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t-2 border-gray-100 bg-white">
        <div className="p-6 space-y-5">
          {/* Driver Info Card */}
          <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center gap-4">
              {/* Driver Avatar */}
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white shadow-xl ring-2 ring-yellow-400">
                  <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-2xl font-black">
                    RK
                  </AvatarFallback>
                </Avatar>
                {/* Online Badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1">
                {/* Driver Name */}
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-yellow-600" />
                  <p className="font-black text-xl text-gray-900">Ravi Kumar</p>
                </div>
                
                {/* Vehicle Number */}
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-5 h-5 text-orange-600" />
                  <p className="font-bold text-gray-700">AP 39 AB 1234</p>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm font-bold text-gray-600 ml-1">4.8 (230 rides)</span>
                </div>
              </div>

              {/* Call Button */}
              <Button
                size="icon"
                className="w-14 h-14 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-0"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                }}
                onClick={handleCallDriver}
                title="Call Driver"
              >
                <Phone className="w-6 h-6" />
              </Button>
            </div>
          </Card>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl text-center border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-blue-700">On Time</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl text-center border border-green-200">
              <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-green-700">Verified</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl text-center border border-purple-200">
              <Star className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-purple-700">Top Rated</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleStartTrip}
              className="w-full h-16 text-lg font-black shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0"
              style={{
                background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)'
              }}
              size="lg"
            >
              <Zap className="w-6 h-6 mr-2" />
              Driver Arrived - Start Trip
            </Button>
            
            <Button
              onClick={() => navigate("/home")}
              variant="outline"
              className="w-full h-14 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 font-bold text-base rounded-xl transition-all duration-300"
            >
              Cancel Ride
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DriverAssignedScreen;
