import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car, Zap, MapPin, Clock, Shield } from "lucide-react";

const SearchingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate finding a driver after 3 seconds
    const timer = setTimeout(() => {
      // Generate a mock ride ID
      const rideId = `ride_${Date.now()}`;
      navigate(`/driver-assigned/${rideId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
              Finding Your Ride
            </p>
            <p className="text-xs text-muted-foreground font-semibold">Hold tight, we're on it!</p>
          </div>
        </div>
      </header>

      {/* Map Area with Premium Animation */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Center Animation */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative">
            {/* Rotating Ring 1 - Dashed */}
            <div className="absolute inset-0 border-4 border-dashed border-yellow-400 rounded-full w-48 h-48 animate-spin-slow"></div>
            
            {/* Rotating Ring 2 - Dotted (Reverse) */}
            <div className="absolute inset-0 border-4 border-dotted border-orange-400 rounded-full w-48 h-48" style={{ animation: 'spin 15s linear infinite reverse' }}></div>

            {/* Center Car Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl flex items-center justify-center transform animate-pulse">
                <Car className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Pulsing Dots on Map */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-green-500 rounded-full shadow-lg animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-yellow-500 rounded-full shadow-lg animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-orange-500 rounded-full shadow-lg animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Premium Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t-2 border-gray-100 bg-white">
        <div className="p-6 space-y-6 text-center">
          {/* Main Heading */}
          <div>
            <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Finding Your Ride...
            </h2>
            <p className="text-base font-bold text-gray-700">Searching for nearby drivers</p>
          </div>

          {/* Animated Progress Dots */}
          <div className="py-4">
            <div className="flex justify-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 py-2">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
              <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-green-700">Verified</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-blue-700">Fast</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
              <MapPin className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-purple-700">Nearby</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 font-semibold">
            Hang tight! We're connecting you with the best driver nearby
          </p>

          {/* Premium Cancel Button */}
          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="w-full h-14 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 font-bold text-base rounded-xl transition-all duration-300 hover:scale-105"
          >
            Cancel Search
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SearchingScreen;
