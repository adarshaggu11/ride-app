import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, AlertCircle } from "lucide-react";
import MapComponent from "./MapComponent";

const TripOngoingScreen = () => {
  const navigate = useNavigate();
  const { rideId } = useParams();
  const [driverLocation, setDriverLocation] = useState({ lat: 17.385, lng: 78.486 });
  const [destination] = useState({ lat: 17.447, lng: 78.379 });

  useEffect(() => {
    // Simulate trip completion after 10 seconds (increased for demo)
    const timer = setTimeout(() => {
      navigate(`/trip-completed/${rideId}`);
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate, rideId]);

  // Simulate live driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        // Move driver slightly towards destination
        lat: prev.lat + (destination.lat - prev.lat) * 0.1,
        lng: prev.lng + (destination.lng - prev.lng) * 0.1,
      }));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [destination]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Area with Live Tracking */}
      <div className="flex-1 relative">
        <MapComponent
          center={driverLocation}
          zoom={14}
          showRoute={true}
          origin={driverLocation}
          destination={destination}
          driverLocation={driverLocation}
          showDriverMarker={true}
          className="w-full h-full"
        />

        {/* SOS Button */}
        <button className="absolute top-6 right-6 bg-destructive text-white px-4 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          SOS
        </button>
      </div>

      {/* Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t">
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Trip Ongoing</h2>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="w-12 h-12 rounded-full"
                onClick={() => window.open("tel:+919876543210")}
              >
                <Phone className="w-5 h-5" />
              </Button>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-destructive rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-semibold">Arriving Soon...</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Distance Left</p>
                  <p className="text-lg font-bold">1.2 km</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ETA</p>
                  <p className="text-lg font-bold">5 min</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-4 bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                RK
              </div>
              <div className="flex-1">
                <p className="font-bold">Ravi Kumar</p>
                <p className="text-sm text-muted-foreground">AP 39 AB 1234</p>
              </div>
            </div>
          </Card>

          <div className="bg-secondary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Safety First</p>
            <p className="text-xs text-muted-foreground">
              Your ride is being tracked. Use SOS button in emergency.
            </p>
            <p className="text-xs text-muted-foreground">
              Your ride is being tracked. Use SOS button in case of emergency.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TripOngoingScreen;
