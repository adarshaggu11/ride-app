import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Car, Shield, MapPin } from "lucide-react";

interface OnboardingScreensProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Car,
    title: "Free Auto Booking",
    titleTe: "ఉచిత ఆటో బుకింగ్",
    description: "Book autos instantly without any booking charges",
    descriptionTe: "ఎటువంటి బుకింగ్ చార్జీలు లేకుండా తక్షణమే ఆటోలను బుక్ చేసుకోండి",
  },
  {
    icon: Shield,
    title: "Fast & Trustworthy Drivers",
    titleTe: "వేగవంతమైన & విశ్వసనీయ డ్రైవర్లు",
    description: "Verified drivers ready to serve you",
    descriptionTe: "మీకు సేవ చేయడానికి ధృవీకరించబడిన డ్రైవర్లు సిద్ధంగా ఉన్నారు",
  },
  {
    icon: MapPin,
    title: "Live Ride Tracking",
    titleTe: "లైవ్ రైడ్ ట్రాకింగ్",
    description: "Track your ride in real-time for safety",
    descriptionTe: "భద్రత కోసం మీ రైడ్‌ను రియల్ టైమ్‌లో ట్రాక్ చేయండి",
  },
];

const OnboardingScreens = ({ onComplete }: OnboardingScreensProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="bg-primary/10 w-32 h-32 mx-auto rounded-full flex items-center justify-center">
            <Icon className="w-16 h-16 text-primary" />
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              {slide.title}
            </h2>
            <p className="text-xl font-semibold text-primary">
              {slide.titleTe}
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              {slide.description}
            </p>
            <p className="text-base text-muted-foreground">
              {slide.descriptionTe}
            </p>
          </div>

          <div className="flex justify-center gap-2 pt-4">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-3">
        <Button
          onClick={handleNext}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {currentSlide === slides.length - 1 ? (
            <>Get Started | ప్రారంభించండి</>
          ) : (
            <>
              Next | తదుపరి <ChevronRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
        
        {currentSlide < slides.length - 1 && (
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full h-12 text-base"
          >
            Skip | దాటవేయండి
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreens;
