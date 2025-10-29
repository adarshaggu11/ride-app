import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Star, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TripCompletedScreen = () => {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please rate your experience",
        description: "Your rating helps us improve our service",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you for your feedback!",
      description: "Your rating has been submitted successfully",
    });

    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Trip Completed!</h2>
          <p className="text-muted-foreground">Thank you for riding with us</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Fare</p>
            <div className="flex items-center justify-center gap-1">
              <IndianRupee className="w-8 h-8 text-primary" />
              <span className="text-5xl font-bold text-primary">80</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Please pay the driver directly in cash
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Distance</span>
              <span className="font-semibold">5.2 km</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="font-semibold">18 min</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Driver</span>
              <span className="font-semibold">Ravi Kumar</span>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-center font-semibold mb-4">Rate Your Experience</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? "fill-secondary text-secondary"
                        : "text-border hover:text-secondary/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            Submit & Go Home
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default TripCompletedScreen;
