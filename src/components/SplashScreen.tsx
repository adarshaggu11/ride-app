import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const SplashScreen = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-yellow-400 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className={`text-center space-y-8 relative z-10 transition-all duration-1000 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Logo Container with Glass Effect */}
        <div className="relative mx-auto">
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl animate-pulse-glow"></div>
          <div className="relative w-32 h-32 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <Zap className="w-16 h-16 text-primary fill-primary animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* App Name with Gradient Text */}
        <div className="space-y-3">
          <h1 className="text-6xl font-extrabold text-secondary tracking-tight">
            Drop<span className="text-white">out</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-12 bg-white/40 rounded-full"></div>
            <p className="text-2xl font-semibold text-white/90">Your Ride, Your Way</p>
            <div className="h-1 w-12 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-lg text-secondary/80 font-medium max-w-xs mx-auto">
          Fast. Reliable. Zero Booking Fees.
        </p>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2 pt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/60 text-sm font-medium">Powered by Modern Technology</p>
      </div>
    </div>
  );
};

export default SplashScreen;
