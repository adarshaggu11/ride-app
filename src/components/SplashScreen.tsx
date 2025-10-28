import { useEffect, useState } from "react";
import { Zap, Star, Sparkles } from "lucide-react";

const SplashScreen = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 500);
  }, []);

  return (
    <div className="h-screen rainbow-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating Stars */}
      <div className="absolute inset-0 overflow-hidden">
        <Star className="absolute top-20 left-10 w-8 h-8 text-yellow-300 animate-bounce-fun" fill="currentColor" style={{ animationDelay: '0s' }} />
        <Star className="absolute top-40 right-16 w-6 h-6 text-pink-300 animate-bounce-fun" fill="currentColor" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute bottom-32 left-20 w-10 h-10 text-cyan-300 animate-wiggle" style={{ animationDelay: '0.3s' }} />
        <Star className="absolute bottom-40 right-24 w-7 h-7 text-purple-300 animate-bounce-fun" fill="currentColor" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute top-1/3 left-1/4 w-8 h-8 text-green-300 animate-wiggle" style={{ animationDelay: '0.7s' }} />
        <Star className="absolute top-1/2 right-1/3 w-9 h-9 text-orange-300 animate-bounce-fun" fill="currentColor" style={{ animationDelay: '0.2s' }} />
      </div>

      {/* Logo & Brand */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-pop-in">
        {/* Playful Logo */}
        <div className="relative">
          <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center animate-bounce-fun card-playful">
            <div className="text-7xl font-black text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 bg-clip-text">
              🚗
            </div>
          </div>
          <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-yellow-400 rounded-[1.5rem] shadow-xl flex items-center justify-center card-playful">
            <Zap className="w-8 h-8 text-white animate-wiggle" fill="white" />
          </div>
        </div>

        {/* Brand Name with Playful Font */}
        <div className="text-center">
          <h1 className="text-6xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
            <span className="inline-block animate-bounce-fun" style={{ animationDelay: '0s' }}>D</span>
            <span className="inline-block animate-bounce-fun" style={{ animationDelay: '0.1s' }}>r</span>
            <span className="inline-block animate-bounce-fun" style={{ animationDelay: '0.2s' }}>o</span>
            <span className="inline-block animate-bounce-fun" style={{ animationDelay: '0.3s' }}>p</span>
            <span className="inline-block animate-bounce-fun" style={{ animationDelay: '0.4s' }}>o</span>
            <span className="inline-block animate-bounce-fun" style={{ animationDelay: '0.5s' }}>u</span>
            <span className="inline-block animate-bounce-fun" style={{ animationDelay: '0.6s' }}>t</span>
          </h1>
          <div className="bg-white px-6 py-2 rounded-full shadow-lg">
            <p className="text-purple-600 text-lg font-black tracking-wide uppercase">
              🎮 Fun Rides Await!
            </p>
          </div>
        </div>

        {/* Playful Loading Animation */}
        <div className="flex gap-3 mt-6">
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>

      {/* Version Info with Fun Style */}
      <div className="absolute bottom-8 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
        <p className="text-white font-bold text-sm flex items-center gap-2">
          <Star className="w-4 h-4" fill="currentColor" />
          v1.0.0 • Super Fun Edition
          <Star className="w-4 h-4" fill="currentColor" />
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
