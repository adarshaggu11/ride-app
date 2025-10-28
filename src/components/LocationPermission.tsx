import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

const LocationPermission = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          navigate("/home");
        },
        () => {
          navigate("/home");
        }
      );
    } else {
      navigate("/home");
    }
  };

  const handleDeny = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <MapPin className="w-12 h-12 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Enable Location
          </h2>
          <p className="text-xl font-semibold text-primary mb-4">
            స్థానం ప్రారంభించండి
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <p className="text-center text-muted-foreground">
            We need your location to show nearby autos and provide accurate ride tracking.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            సమీపంలోని ఆటోలను చూపించడానికి మరియు ఖచ్చితమైన రైడ్ ట్రాకింగ్ అందించడానికి మాకు మీ స్థానం అవసరం.
          </p>

          <div className="space-y-3 pt-4">
            <Button
              onClick={handleAllow}
              className="w-full h-12 text-lg font-semibold"
            >
              Allow Location | అనుమతించండి
            </Button>
            
            <Button
              onClick={handleDeny}
              variant="outline"
              className="w-full h-12 text-lg"
            >
              Deny | తిరస్కరించండి
            </Button>
          </div>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          You can change this permission anytime in your device settings
        </p>
      </div>
    </div>
  );
};

export default LocationPermission;
