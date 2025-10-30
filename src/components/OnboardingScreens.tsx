import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Car, Shield, MapPin, Zap, Clock, Star, TrendingUp, DollarSign, Heart } from "lucide-react";

interface OnboardingScreensProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book bikes, autos, or cars instantly with just a few taps. Zero booking fees!",
    color: "from-yellow-400 to-orange-500",
    bgColor: "#FCD34D",
    secondaryColor: "#F59E0B",
    illustration: "/images/auto-icon.svg",
    stats: ["4.8★ Rating", "50K+ Rides", "100% Safe"],
    features: ["Zero Waiting", "Quick Booking", "Instant Confirmation"]
  },
  {
    icon: Shield,
    title: "100% Safe & Secure",
    description: "All drivers are thoroughly verified and trained for your safety and comfort",
    color: "from-yellow-400 to-orange-600",
    bgColor: "#FCD34D",
    secondaryColor: "#EA580C",
    illustration: "/images/bike-icon.svg",
    stats: ["Verified Drivers", "24/7 Support", "SOS Feature"],
    features: ["Background Checked", "Licensed Drivers", "Fully Insured"]
  },
  {
    icon: MapPin,
    title: "Live GPS Tracking",
    description: "Track your ride in real-time with accurate GPS and share your location with loved ones",
    color: "from-amber-400 to-yellow-600",
    bgColor: "#FBBF24",
    secondaryColor: "#CA8A04",
    illustration: "/images/car-icon.svg",
    stats: ["Real-time GPS", "Route Optimization", "ETA Updates"],
    features: ["Share Live Location", "Smart Routes", "Accurate ETA"]
  },
  {
    icon: DollarSign,
    title: "Best Prices Guaranteed",
    description: "Transparent pricing with no hidden charges. Choose from bikes, autos, and cars",
    color: "from-orange-400 to-yellow-600",
    bgColor: "#FB923C",
    secondaryColor: "#CA8A04",
    illustration: "/images/auto-icon.svg",
    stats: ["Zero Commission", "Best Rates", "Cashless Rides"],
    features: ["Bikes from ₹49", "Autos from ₹85", "Cars from ₹120"]
  },
];

const OnboardingScreens = ({ onComplete }: OnboardingScreensProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  // Auto-play animation for icons
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setSlideDirection(null);
      }, 150);
    }
    
    if (isRightSwipe && currentSlide > 0) {
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setSlideDirection(null);
      }, 150);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${slide.bgColor}15 0%, ${slide.secondaryColor}10 100%)`
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={containerRef}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${slide.bgColor} 0%, transparent 70%)`,
            animationDuration: '3s'
          }}
        ></div>
        <div 
          className="absolute bottom-20 left-10 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${slide.secondaryColor} 0%, transparent 70%)`,
            animationDuration: '4s',
            animationDelay: '1s'
          }}
        ></div>
        
        {/* Floating Dots Animation */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: slide.bgColor,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 3 + 4}s`
            }}
          />
        ))}
      </div>

      {/* Premium Header with Logo */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between">
        {/* Animated Logo */}
        <div className="flex items-center gap-3 animate-slide-down">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${slide.bgColor}, ${slide.secondaryColor})`,
              boxShadow: `0 4px 20px ${slide.bgColor}50`
            }}
          >
            <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 
              className="text-xl font-black tracking-tight"
              style={{
                background: `linear-gradient(135deg, ${slide.bgColor}, ${slide.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Dropout
            </h1>
            <div className="flex items-center gap-1.5">
              <div 
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: slide.bgColor }}
              ></div>
              <span className="text-[10px] font-semibold text-muted-foreground">
                {currentSlide + 1} of {slides.length}
              </span>
            </div>
          </div>
        </div>

        {/* Skip Button */}
        {currentSlide < slides.length - 1 && (
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground font-semibold backdrop-blur-sm bg-background/30 rounded-full px-6 animate-fade-in"
          >
            Skip
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div 
          className={`w-full max-w-md space-y-6 transition-all duration-500 ${
            slideDirection === 'left' ? 'animate-slide-out-left' : 
            slideDirection === 'right' ? 'animate-slide-out-right' : 
            'animate-scale-in'
          }`}
          key={currentSlide}
        >
          {/* Illustration Container with Premium Animation */}
          <div className="relative mx-auto w-full max-w-xs">
            {/* Animated Loading Ring - Premium Effect */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <div 
                className="w-full h-full rounded-full animate-spin-slow"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, ${slide.bgColor} 90deg, transparent 180deg)`,
                  opacity: 0.3
                }}
              ></div>
            </div>
            
            <div 
              className="relative aspect-square rounded-full flex items-center justify-center animate-float"
              style={{
                background: `linear-gradient(135deg, ${slide.bgColor}20 0%, ${slide.secondaryColor}15 100%)`,
                boxShadow: `0 20px 60px ${slide.bgColor}40, 0 0 0 1px ${slide.bgColor}20`,
                animationDuration: '6s'
              }}
            >
              {/* Rotating Ring Effect */}
              <div 
                className="absolute inset-0 rounded-full animate-spin-slow border-2 border-dashed opacity-20"
                style={{ borderColor: slide.bgColor }}
              ></div>
              <div 
                className="absolute inset-4 rounded-full animate-spin-reverse border-2 border-dotted opacity-15"
                style={{ borderColor: slide.secondaryColor }}
              ></div>
              
              {/* Pulse Circles for Loading Effect */}
              <div 
                className="absolute inset-8 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${slide.bgColor}10, transparent)`,
                  animationDuration: '2s'
                }}
              ></div>
              
              {/* Icon Illustration with Loading Animation */}
              <img 
                src={slide.illustration}
                alt={slide.title}
                className={`w-2/3 h-2/3 object-contain transition-all duration-500 ${
                  isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'
                }`}
                style={{
                  filter: `drop-shadow(0 10px 30px ${slide.bgColor}60)`
                }}
              />
              
              {/* Sparkle Effects - Premium Touch */}
              {isVisible && (
                <>
                  <div 
                    className="absolute top-8 right-8 w-2 h-2 rounded-full animate-ping"
                    style={{ background: slide.bgColor }}
                  ></div>
                  <div 
                    className="absolute bottom-12 left-12 w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ 
                      background: slide.secondaryColor,
                      animationDelay: '0.5s'
                    }}
                  ></div>
                  <div 
                    className="absolute top-16 left-8 w-1 h-1 rounded-full animate-ping"
                    style={{ 
                      background: slide.bgColor,
                      animationDelay: '1s'
                    }}
                  ></div>
                </>
              )}
            </div>
            
            {/* Floating Icon Badge with Pulse Effect */}
            <div 
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 animate-bounce-slow"
              style={{
                background: `linear-gradient(135deg, ${slide.bgColor} 0%, ${slide.secondaryColor} 100%)`,
                boxShadow: `0 10px 40px ${slide.bgColor}60, 0 0 0 3px ${slide.bgColor}20`
              }}
            >
              <Icon className="w-10 h-10 text-white drop-shadow-lg" strokeWidth={2.5} />
              {/* Animated Border Ring */}
              <div 
                className="absolute inset-0 rounded-3xl border-2 border-white/40 animate-ping"
                style={{ animationDuration: '3s' }}
              ></div>
            </div>
          </div>

          {/* Text Content with Stagger Animation */}
          <div className="text-center space-y-4 pt-10">
            <h2 
              className="text-4xl font-black text-foreground leading-tight animate-slide-up"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              {slide.title}
            </h2>
            <p 
              className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              {slide.description}
            </p>
            
            {/* Feature Stats with Slide-in Animation */}
            <div className="flex items-center justify-center flex-wrap gap-3 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {slide.stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-md shadow-lg transform hover:scale-105 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${slide.bgColor}25, ${slide.secondaryColor}20)`,
                    border: `1px solid ${slide.bgColor}30`
                  }}
                >
                  <Star className="w-3.5 h-3.5" style={{ color: slide.bgColor }} />
                  <span className="text-xs font-bold text-foreground">{stat}</span>
                </div>
              ))}
            </div>

            {/* Feature List with Premium Cards */}
            <div className="grid grid-cols-3 gap-3 pt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {slide.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${slide.bgColor}15, ${slide.secondaryColor}10)`,
                    border: `1px solid ${slide.bgColor}20`,
                    boxShadow: `0 4px 12px ${slide.bgColor}15`
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${slide.bgColor}, ${slide.secondaryColor})`
                    }}
                  >
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-center text-foreground leading-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Progress Indicators with Loading Bar */}
          <div className="flex flex-col items-center gap-4 pt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {/* Dot Indicators */}
            <div className="flex justify-center items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-all duration-500 transform relative overflow-hidden ${
                    index === currentSlide
                      ? "w-10 h-3 shadow-lg"
                      : "w-3 h-3 hover:scale-125"
                  }`}
                  style={{
                    background: index === currentSlide 
                      ? `linear-gradient(90deg, ${slide.bgColor}, ${slide.secondaryColor})`
                      : '#E5E7EB'
                  }}
                >
                  {/* Shimmer effect on active indicator */}
                  {index === currentSlide && (
                    <div 
                      className="absolute inset-0 opacity-50"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s linear infinite'
                      }}
                    ></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Loading Progress Bar */}
            <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentSlide + 1) / slides.length) * 100}%`,
                  background: `linear-gradient(90deg, ${slide.bgColor}, ${slide.secondaryColor})`,
                  boxShadow: `0 0 10px ${slide.bgColor}60`
                }}
              ></div>
            </div>
          </div>

          {/* Social Proof Badge (First Slide Only) */}
          {currentSlide === 0 && (
            <div 
              className="flex items-center justify-center gap-6 pt-6 px-6 py-4 rounded-2xl backdrop-blur-md mx-auto max-w-sm animate-slide-up"
              style={{
                background: `linear-gradient(135deg, ${slide.bgColor}20, ${slide.secondaryColor}15)`,
                border: `1px solid ${slide.bgColor}30`,
                boxShadow: `0 10px 30px ${slide.bgColor}20`,
                animationDelay: '0.5s'
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-black text-foreground">4.8</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold">Rating</p>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div className="text-center">
                <p className="text-xl font-black text-foreground mb-1">50K+</p>
                <p className="text-[10px] text-muted-foreground font-semibold">Happy Riders</p>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span className="text-xl font-black text-foreground">100%</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold">Safe Rides</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Action Button */}
      <div className="px-6 pb-8 space-y-3 relative z-10">
        <Button
          onClick={handleNext}
          className="w-full h-16 text-lg font-black shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${slide.bgColor} 0%, ${slide.secondaryColor} 100%)`,
            boxShadow: `0 10px 40px ${slide.bgColor}60, 0 0 0 1px ${slide.bgColor}40`
          }}
          size="lg"
        >
          {currentSlide === slides.length - 1 ? (
            <span className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Get Started Now
              <ChevronRight className="w-6 h-6" />
            </span>
          ) : (
            <span className="flex items-center gap-3">
              Continue Your Journey
              <ChevronRight className="w-6 h-6" />
            </span>
          )}
        </Button>
        
        {/* Swipe Indicator */}
        <p className="text-center text-xs text-muted-foreground animate-pulse">
          Swipe left or right to explore
        </p>
      </div>
    </div>
  );
};

export default OnboardingScreens;
