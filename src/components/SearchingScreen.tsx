import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car } from "lucide-react";

const SearchingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate finding a driver after 3 seconds
    const timer = setTimeout(() => {
      // Generate a mock ride ID
      const rideId = `ride_${Date.now()}`;
      navigate(`/driver-assigned/${rideId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Area */}
      <div className="flex-1 bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse">
            <Car className="w-20 h-20 text-primary mx-auto mb-4" />
          </div>
        </div>
      </div>

      {/* Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t">
        <div className="p-6 space-y-6 text-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Finding Auto...</h2>
            <p className="text-lg font-semibold text-primary">ఆటో వెతుకుతోంది...</p>
          </div>

          <div className="py-6">
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>

          <p className="text-muted-foreground">
            Please wait while we find the nearest auto for you
          </p>
          <p className="text-sm text-muted-foreground">
            మీ కోసం సమీప ఆటోను కనుగొనే వరకు దయచేసి వేచి ఉండండి
          </p>

          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="w-full h-12"
          >
            Cancel | రద్దు చేయండి
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SearchingScreen;
