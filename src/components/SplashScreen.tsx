import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const SplashScreen = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 500);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        {/* Professional Logo */}
        <div className="relative">
          <div className="w-28 h-28 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
            <Zap className="w-14 h-14 text-blue-600" fill="currentColor" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Dropout
          </h1>
          <p className="text-white/80 text-lg font-medium">
            Your Ride, Delivered
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>

      {/* Version Info */}
      <div className="absolute bottom-8 text-white/60 text-sm font-medium">
        Version 1.0.0
      </div>
    </div>
  );
};

export default SplashScreen;
