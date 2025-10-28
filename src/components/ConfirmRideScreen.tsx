import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, IndianRupee } from "lucide-react";
import MapComponent from "./MapComponent";

const ConfirmRideScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickup, drop, pickupCoords, dropCoords } = location.state || { 
    pickup: "", 
    drop: "",
    pickupCoords: { lat: 17.385, lng: 78.486 },
    dropCoords: { lat: 17.447, lng: 78.379 }
  };
  
  const [pickupLocation] = useState(pickupCoords || { lat: 17.385, lng: 78.486 });
  const [dropLocation] = useState(dropCoords || { lat: 17.447, lng: 78.379 });
  const [distance, setDistance] = useState("5.2 km");
  const [duration, setDuration] = useState("15 min");
  const [fare, setFare] = useState(80);

  // Calculate real distance and fare
  useEffect(() => {
    if (window.google?.maps && pickupLocation && dropLocation) {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [pickupLocation],
        destinations: [dropLocation],
        travelMode: google.maps.TravelMode.DRIVING,
      }, (response, status) => {
        if (status === 'OK' && response?.rows[0]?.elements[0]) {
          const element = response.rows[0].elements[0];
          if (element.status === 'OK') {
            setDistance(element.distance.text);
            setDuration(element.duration.text);
            
            // Calculate fare: ₹20 base + ₹12/km
            const distanceKm = element.distance.value / 1000;
            const calculatedFare = Math.round(20 + (distanceKm * 12));
            setFare(calculatedFare);
          }
        }
      });
    }
  }, [pickupLocation, dropLocation]);

  const handleConfirm = () => {
    navigate("/searching", {
      state: {
        pickup,
        drop,
        pickupCoords: pickupLocation,
        dropCoords: dropLocation,
        distance,
        duration,
        fare
      }
    });
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Map Area with Route Preview */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent
          center={pickupLocation}
          zoom={13}
          showRoute={true}
          origin={pickupLocation}
          destination={dropLocation}
          showDriverMarker={false}
          showUserLocation={false}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t flex-shrink-0">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Confirm Your Ride</h2>
            <p className="text-lg font-semibold text-primary">మీ రైడ్‌ను నిర్ధారించండి</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Pickup</p>
                <p className="font-semibold">{pickup}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-destructive rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Drop</p>
                <p className="font-semibold">{drop}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Distance</span>
              </div>
              <p className="text-xl font-bold">{distance}</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Time</span>
              </div>
              <p className="text-xl font-bold">{duration}</p>
            </Card>
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Fare</p>
                <p className="text-xs text-muted-foreground">అంచనా ధర</p>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold text-primary">{fare}</span>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleConfirm}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            Confirm Booking | బుకింగ్ నిర్ధారించండి
          </Button>

          <button
            onClick={() => navigate(-1)}
            className="w-full text-center text-muted-foreground hover:text-foreground"
          >
            Change Location | స్థానం మార్చండి
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmRideScreen;
