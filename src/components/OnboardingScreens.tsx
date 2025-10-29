import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Car, Shield, MapPin, Zap, Clock, Star } from "lucide-react";

interface OnboardingScreensProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book bikes, autos, or cars instantly with just a few taps. Zero booking fees!",
    color: "from-primary to-accent",
    bgPattern: "bg-gradient-to-br from-primary/10 to-accent/10",
    stats: ["4.8★ Rating", "50K+ Rides", "100% Safe"]
  },
  {
    icon: Shield,
    title: "Verified Drivers",
    description: "All drivers are thoroughly verified and trained for your safety and comfort",
    color: "from-green-500 to-emerald-500",
    bgPattern: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
    stats: ["Background Checked", "Licensed", "Insured"]
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    description: "Track your ride in real-time with accurate GPS and share your location with loved ones",
    color: "from-blue-500 to-cyan-500",
    bgPattern: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
    stats: ["Real-time GPS", "Route Optimization", "ETA Updates"]
  },
  {
    icon: Car,
    title: "Multiple Ride Options",
    description: "Choose from bikes, autos, and cars based on your comfort and budget",
    color: "from-purple-500 to-pink-500",
    bgPattern: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
    stats: ["Bikes from ₹49", "Autos from ₹85", "Cars from ₹120"]
  },
];

const OnboardingScreens = ({ onComplete }: OnboardingScreensProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

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
      }, 100);
    }
    
    if (isRightSwipe && currentSlide > 0) {
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setSlideDirection(null);
      }, 100);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setSlideDirection(null);
      }, 100);
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
      className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={containerRef}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 -right-20 w-72 h-72 rounded-full ${slide.bgPattern} blur-3xl opacity-50 animate-float`}></div>
        <div className={`absolute -bottom-20 -left-20 w-96 h-96 rounded-full ${slide.bgPattern} blur-3xl opacity-50 animate-float`} style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Skip Button */}
      {currentSlide < slides.length - 1 && (
        <div className="absolute top-6 right-6 z-10">
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground font-semibold"
          >
            Skip
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div 
          className={`w-full max-w-md space-y-8 transition-all duration-500 ${
            slideDirection === 'left' ? 'animate-slide-in-right' : 
            slideDirection === 'right' ? 'animate-slide-in-left' : 
            'animate-scale-in'
          }`}
          key={currentSlide}
        >
          {/* Hero Icon - No Images */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className={`aspect-square rounded-3xl bg-gradient-to-br ${slide.color} p-12 shadow-2xl flex items-center justify-center`}>
              <Icon className="w-32 h-32 text-white drop-shadow-2xl animate-float" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-5 pt-8">
            <h2 className="text-4xl font-extrabold text-foreground leading-tight">
              {slide.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mt-6 max-w-sm mx-auto">
              {slide.description}
            </p>
            
            {/* Feature Stats */}
            <div className="flex items-center justify-center gap-4 pt-6">
              {slide.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 backdrop-blur-sm">
                  <span className="text-xs font-semibold text-foreground">{stat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 pt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? `w-12 bg-gradient-to-r ${slide.color}`
                    : "w-2.5 bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>

          {/* Features Badge */}
          {currentSlide === 0 && (
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-lg font-bold text-foreground">4.8</span>
                </div>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">10K+</p>
                <p className="text-xs text-muted-foreground">Rides</p>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Safe</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-8 space-y-4 relative z-10">
        <Button
          onClick={handleNext}
          className={`w-full h-16 text-lg font-bold bg-gradient-to-r ${slide.color} hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1`}
          size="lg"
        >
          {currentSlide === slides.length - 1 ? (
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Get Started Now
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue
              <ChevronRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingScreens;
