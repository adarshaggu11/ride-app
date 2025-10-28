import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronRight, 
  ChevronLeft,
  MapPin, 
  IndianRupee, 
  Calendar,
  Clock,
  Car,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Ride {
  id: string;
  date: string;
  time: string;
  pickup: string;
  drop: string;
  distance: string;
  fare: number;
  driver: string;
  vehicle: string;
  status: "completed" | "cancelled";
  rating?: number;
}

const RideHistoryScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data
  const [rides] = useState<Ride[]>([
    {
      id: "RIDE001",
      date: "Oct 28, 2025",
      time: "10:30 AM",
      pickup: "Madhapur, Hyderabad",
      drop: "Hitech City, Hyderabad",
      distance: "5.2 km",
      fare: 80,
      driver: "Ravi Kumar",
      vehicle: "AP 39 AB 1234",
      status: "completed",
      rating: 5
    },
    {
      id: "RIDE002",
      date: "Oct 27, 2025",
      time: "06:15 PM",
      pickup: "Banjara Hills, Hyderabad",
      drop: "Jubilee Hills, Hyderabad",
      distance: "3.8 km",
      fare: 65,
      driver: "Suresh Reddy",
      vehicle: "TS 09 UA 5678",
      status: "completed",
      rating: 4
    },
    {
      id: "RIDE003",
      date: "Oct 26, 2025",
      time: "02:45 PM",
      pickup: "Kukatpally, Hyderabad",
      drop: "KPHB, Hyderabad",
      distance: "7.5 km",
      fare: 110,
      driver: "Ramesh Naidu",
      vehicle: "AP 28 BC 9012",
      status: "completed",
      rating: 5
    },
    {
      id: "RIDE004",
      date: "Oct 25, 2025",
      time: "09:00 AM",
      pickup: "Gachibowli, Hyderabad",
      drop: "Kondapur, Hyderabad",
      distance: "4.2 km",
      fare: 70,
      driver: "Venkat Rao",
      vehicle: "TS 10 AB 3456",
      status: "cancelled",
    },
    {
      id: "RIDE005",
      date: "Oct 24, 2025",
      time: "05:30 PM",
      pickup: "Ameerpet, Hyderabad",
      drop: "SR Nagar, Hyderabad",
      distance: "2.8 km",
      fare: 50,
      driver: "Krishna Prasad",
      vehicle: "AP 39 CD 7890",
      status: "completed",
      rating: 4
    }
  ]);

  const completedRides = rides.filter(r => r.status === "completed");
  const cancelledRides = rides.filter(r => r.status === "cancelled");

  const filteredRides = rides.filter(ride =>
    ride.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ride.drop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ride.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RideCard = ({ ride }: { ride: Ride }) => (
    <Card 
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate(`/ride-details/${ride.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-lg">₹{ride.fare}</p>
          <p className="text-xs text-muted-foreground">{ride.date} • {ride.time}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          ride.status === "completed" 
            ? "bg-primary/10 text-primary" 
            : "bg-destructive/10 text-destructive"
        }`}>
          {ride.status === "completed" ? "Completed" : "Cancelled"}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-primary rounded-full mt-1.5"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">{ride.pickup}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-destructive rounded-full mt-1.5"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">{ride.drop}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{ride.distance}</span>
          <span>•</span>
          <span>{ride.driver}</span>
          <span>•</span>
          <span>{ride.vehicle}</span>
        </div>
        {ride.rating && (
          <div className="flex items-center gap-1">
            {[...Array(ride.rating)].map((_, i) => (
              <span key={i} className="text-secondary text-sm">★</span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Ride History</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search rides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-muted/30">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{rides.length}</p>
            <p className="text-xs text-muted-foreground">Total Rides</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              ₹{rides.reduce((sum, r) => sum + r.fare, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {completedRides.length > 0 
                ? (completedRides.reduce((sum, r) => sum + (r.rating || 0), 0) / completedRides.length).toFixed(1)
                : "0.0"
              }
            </p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="px-6 py-4">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="all">
            All ({rides.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedRides.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledRides.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-0">
          {filteredRides.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No rides found</p>
            </div>
          ) : (
            filteredRides.map(ride => <RideCard key={ride.id} ride={ride} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-0">
          {completedRides.map(ride => <RideCard key={ride.id} ride={ride} />)}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-3 mt-0">
          {cancelledRides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cancelled rides</p>
            </div>
          ) : (
            cancelledRides.map(ride => <RideCard key={ride.id} ride={ride} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RideHistoryScreen;
