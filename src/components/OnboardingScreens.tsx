import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Car, Shield, MapPin, Zap, Clock, Star } from "lucide-react";

interface OnboardingScreensProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Zap,
    title: "Free Auto Booking",
    titleTe: "ఉచిత ఆటో బుకింగ్",
    description: "Book autos instantly without any booking charges. Zero commissions, pure savings!",
    descriptionTe: "ఎటువంటి బుకింగ్ చార్జీలు లేకుండా తక్షణమే ఆటోలను బుక్ చేసుకోండి",
    color: "from-primary to-accent",
    bgPattern: "bg-gradient-to-br from-primary/10 to-accent/10",
  },
  {
    icon: Shield,
    title: "Verified & Safe Drivers",
    titleTe: "ధృవీకరించబడిన & సురక్షిత డ్రైవర్లు",
    description: "All drivers are background verified for your safety and peace of mind",
    descriptionTe: "అన్ని డ్రైవర్లు మీ భద్రత కోసం నేపథ్య ధృవీకరణ పొందారు",
    color: "from-green-500 to-emerald-500",
    bgPattern: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
  },
  {
    icon: MapPin,
    title: "Live Ride Tracking",
    titleTe: "లైవ్ రైడ్ ట్రాకింగ్",
    description: "Track your ride in real-time with accurate GPS location updates",
    descriptionTe: "ఖచ్చితమైన GPS లొకేషన్ అప్‌డేట్‌లతో రియల్ టైమ్‌లో మీ రైడ్‌ను ట్రాక్ చేయండి",
    color: "from-blue-500 to-cyan-500",
    bgPattern: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Clock,
    title: "Quick & Reliable",
    titleTe: "త్వరిత & విశ్వసనీయమైన",
    description: "Get a ride within minutes. Your time matters to us!",
    descriptionTe: "నిమిషాల్లో రైడ్ పొందండి. మీ సమయం మాకు ముఖ్యం!",
    color: "from-purple-500 to-pink-500",
    bgPattern: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
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
          {/* Icon Container with Gradient */}
          <div className="relative mx-auto w-fit">
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} rounded-full blur-2xl opacity-40 animate-pulse-glow`}></div>
            <div className={`relative bg-gradient-to-br ${slide.color} w-40 h-40 mx-auto rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-20 h-20 text-white drop-shadow-lg" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-5">
            <h2 className="text-4xl font-extrabold text-foreground leading-tight">
              {slide.title}
            </h2>
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {slide.titleTe}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-6 max-w-sm mx-auto">
              {slide.description}
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              {slide.descriptionTe}
            </p>
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
              Get Started | ప్రారంభించండి
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Next | తదుపరి 
              <ChevronRight className="w-5 h-5" />
            </span>
          )}
        </Button>

        {/* Swipe Hint */}
        <p className="text-center text-sm text-muted-foreground">
          Swipe to navigate • స్వైప్ చేయండి
        </p>
      </div>
    </div>
  );
};

export default OnboardingScreens;
