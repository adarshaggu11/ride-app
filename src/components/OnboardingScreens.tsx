import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap } from "lucide-react";

interface OnboardingScreensProps {
  onComplete: () => void;
}

const OnboardingScreens = ({ onComplete }: OnboardingScreensProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: "Welcome to Dropout", description: "Your trusted ride-sharing platform" },
    { title: "Safe & Secure", description: "All drivers are verified" },
    { title: "Track Your Ride", description: "Real-time GPS tracking" },
    { title: "Ready to Go?", description: "Let's get started!" },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col">
      {currentSlide < slides.length - 1 && (
        <div className="absolute top-6 right-6 z-10">
          <Button onClick={() => onComplete()} variant="ghost" className="text-white hover:text-white/80">
            Skip
          </Button>
        </div>
      )}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="text-center space-y-8 max-w-md">
          <div className="mx-auto w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white">{slide.title}</h2>
          <p className="text-xl text-white/90">{slide.description}</p>
           <div className="flex justify-center gap-3 pt-8">
             {slides.map((_, index) => (
               <div key={index} className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
             ))}
           </div>
        </div>
      </div>
      <div className="px-8 pb-8">
        <Button onClick={handleNext} className="w-full h-14 text-lg font-bold bg-white text-blue-600 hover:bg-white/90" size="lg">
          {currentSlide === slides.length - 1 ? "Get Started" : <span className="flex items-center gap-2">Continue <ChevronRight className="w-5 h-5" /></span>}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingScreens;
