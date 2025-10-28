import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const SplashScreen = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 500);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-primary via-accent to-secondary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Logo & Brand */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Modern Logo */}
        <div className="relative">
          <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-pulse-glow">
            <div className="text-6xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              D
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent rounded-2xl shadow-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" fill="white" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            <span className="inline-block animate-scale-in">Drop</span>
            <span className="inline-block animate-scale-in text-white/90" style={{ animationDelay: '0.1s' }}>out</span>
          </h1>
          <p className="text-white/90 text-lg font-medium tracking-wide">
            Your Ride, Delivered
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex gap-2 mt-4">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Version Info */}
      <div className="absolute bottom-8 text-white/70 text-sm">
        v1.0.0 • Premium Edition
      </div>
    </div>
  );
};

export default SplashScreen;
