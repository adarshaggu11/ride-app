import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";

const HomeScreen = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const navigate = useNavigate();

  const handleFindAuto = () => {
    if (!pickup || !drop) {
      return;
    }
    navigate("/confirm-ride", { state: { pickup, drop } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Area */}
      <div className="flex-1 bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="w-16 h-16 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Map will load here</p>
            <p className="text-xs text-muted-foreground">Google Maps Integration</p>
          </div>
        </div>
        
        {/* Current Location Button */}
        <button className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <Navigation className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Bottom Card */}
      <Card className="rounded-t-3xl shadow-2xl border-t">
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <Input
                placeholder="Pickup Location | పికప్ స్థానం"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="h-12 flex-1"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <Input
                placeholder="Drop Location | డ్రాప్ స్థానం"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                className="h-12 flex-1"
              />
            </div>
          </div>

          <Button
            onClick={handleFindAuto}
            disabled={!pickup || !drop}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            Find Auto | ఆటో వెతకండి
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
