import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MapPin, User, Car } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MapComponent from "./MapComponent";

const DriverAssignedScreen = () => {
  const navigate = useNavigate();
  const { rideId } = useParams();
  const [pickupLocation] = useState({ lat: 17.385, lng: 78.486 });
  const [driverLocation, setDriverLocation] = useState({ lat: 17.375, lng: 78.476 });
  const [eta, setEta] = useState(2);

  // Simulate driver approaching
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        lat: prev.lat + (pickupLocation.lat - prev.lat) * 0.15,
        lng: prev.lng + (pickupLocation.lng - prev.lng) * 0.15,
      }));
      setEta((prev) => Math.max(0, prev - 0.2));
    }, 1000);

    return () => clearInterval(interval);
  }, [pickupLocation]);

  const handleStartTrip = () => {
    navigate(`/trip-ongoing/${rideId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Area with Driver Approaching */}
      <div className="flex-1 relative">
        <MapComponent
          center={pickupLocation}
          zoom={14}
          origin={pickupLocation}
          destination={driverLocation}
          driverLocation={driverLocation}
          showDriverMarker={true}
          showRoute={false}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              {Math.ceil(eta)}
            </div>
            <p className="text-muted-foreground">Driver reaching in</p>
            <p className="text-3xl font-bold text-primary">{Math.ceil(eta)} minutes</p>
            <p className="text-sm text-muted-foreground">డ్రైవర్ {Math.ceil(eta)} నిమిషాల్లో చేరుకుంటున్నారు</p>
          </div>

          <Card className="p-4 bg-muted/50">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary">
                <AvatarFallback className="bg-primary text-white text-xl">
                  RK
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p className="font-bold text-lg">Ravi Kumar</p>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground">AP 39 AB 1234</p>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-secondary text-sm">★</span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">4.8</span>
                </div>
              </div>

              <Button
                size="icon"
                className="w-12 h-12 rounded-full"
                onClick={() => window.open("tel:+919876543210")}
              >
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          <div className="space-y-2">
            <Button
              onClick={handleStartTrip}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              Driver Arrived | డ్రైవర్ చేరుకున్నారు
            </Button>
            
            <Button
              onClick={() => navigate("/home")}
              variant="outline"
              className="w-full h-12"
            >
              Cancel Ride | రైడ్ రద్దు చేయండి
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DriverAssignedScreen;
