import { useEffect, useState } from "react";
import { Zap, TrendingUp, Shield, MapPin } from "lucide-react";

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content immediately for smooth fade-in
    requestAnimationFrame(() => setShowContent(true));

    // Smooth progress animation using requestAnimationFrame
    let startTime: number | null = null;
    const duration = 2500; // 2.5 seconds

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(progressPercent);

      if (progressPercent < 100) {
        requestAnimationFrame(animateProgress);
      }
    };

    requestAnimationFrame(animateProgress);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Particles - Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Gradient Orbs with will-change */}
        <div 
          className="absolute top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, #FCD34D 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
            willChange: 'opacity, transform'
          }}
        ></div>
        <div 
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
            animation: 'pulse 5s ease-in-out infinite 1s',
            willChange: 'opacity, transform'
          }}
        ></div>

        {/* Optimized Floating Dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${4 + i}px`,
              height: `${4 + i}px`,
              left: `${15 + i * 14}%`,
              top: `${10 + i * 12}%`,
              animation: `float ${5 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
              willChange: 'transform'
            }}
          />
        ))}

        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div 
        className={`relative z-10 flex flex-col items-center gap-6 px-6 transition-all duration-700 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        
        {/* Premium Logo Container */}
        <div className="relative">
          {/* Rotating Ring - Smooth rotation */}
          <div className="absolute inset-0 w-36 h-36 -m-4">
            <div 
              className="w-full h-full rounded-full border-2 border-dashed border-white/30"
              style={{
                animation: 'spin-slow 20s linear infinite',
                willChange: 'transform'
              }}
            ></div>
          </div>
          
          {/* Logo Box with Shadow */}
          <div 
            className="relative w-28 h-28 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
            style={{ willChange: 'transform' }}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl"></div>
            
            {/* Zap Icon with Gradient */}
            <div className="relative">
              <Zap 
                className="w-16 h-16" 
                style={{
                  fill: 'url(#zapGradient)',
                  strokeWidth: 0,
                  animation: 'pulse 2s ease-in-out infinite',
                  willChange: 'opacity'
                }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="zapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Pulse Ring Effect - Optimized */}
          <div 
            className="absolute inset-0 w-28 h-28 rounded-3xl bg-white/10"
            style={{
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              willChange: 'transform, opacity'
            }}
          ></div>
        </div>

        {/* Brand Name with Premium Typography */}
        <div 
          className="text-center space-y-2 transition-all duration-500 delay-100"
          style={{ willChange: 'opacity, transform' }}
        >
          <h1 
            className="text-6xl font-black text-white tracking-tight" 
            style={{ 
              textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(252, 211, 77, 0.3)' 
            }}
          >
            Dropout
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-white/60 transition-all duration-500"></div>
            <p className="text-white/90 text-lg font-semibold tracking-wide">
              Your Ride, Your Way
            </p>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-white/60 transition-all duration-500"></div>
          </div>
        </div>

        {/* Animated Feature Icons */}
        <div 
          className={`flex items-center gap-4 mt-4 transition-all duration-700 delay-300 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { icon: TrendingUp, label: 'Fast', delay: 0 },
            { icon: Shield, label: 'Safe', delay: 0.1 },
            { icon: MapPin, label: 'Track', delay: 0.2 }
          ].map(({ icon: Icon, label, delay }, index) => (
            <div 
              key={label}
              className="flex flex-col items-center gap-1"
              style={{
                animation: `bounce-slow 3s ease-in-out infinite ${delay}s`,
                willChange: 'transform'
              }}
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-white/70 font-semibold">{label}</span>
            </div>
          ))}
        </div>

        {/* Modern Progress Bar */}
        <div 
          className={`w-64 mt-6 space-y-2 transition-all duration-700 delay-500 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="relative h-2 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
            <div 
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(252,211,77,0.9), rgba(255,255,255,0.9))',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                willChange: 'width'
              }}
            >
              {/* Shimmer Effect */}
              <div 
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s linear infinite'
                }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-white/70 text-xs font-semibold px-1">
            <span>Loading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div 
        className={`absolute bottom-8 flex flex-col items-center gap-2 transition-all duration-700 delay-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
          <div 
            className="w-2 h-2 bg-green-400 rounded-full"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
              willChange: 'opacity'
            }}
          ></div>
          <span>Secure & Verified</span>
        </div>
        <p className="text-white/50 text-xs font-semibold">Version 1.0.0 • Made in India 🇮🇳</p>
      </div>
    </div>
  );
};

export default SplashScreen;
