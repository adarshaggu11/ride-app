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
  Search,
  Zap,
  Star,
  ArrowLeft
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
      className="p-5 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-gray-100"
      onClick={() => navigate(`/ride-details/${ride.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <IndianRupee className="w-5 h-5 text-yellow-600" />
            <p className="font-black text-2xl text-gray-900">{ride.fare}</p>
          </div>
          <p className="text-xs text-gray-600 font-semibold">{ride.date} • {ride.time}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-md ${
          ride.status === "completed" 
            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
            : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
        }`}>
          {ride.status === "completed" ? "Completed" : "Cancelled"}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mt-1 ring-4 ring-green-400/30"></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">{ride.pickup}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mt-1 ring-4 ring-orange-400/30"></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">{ride.drop}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-600 font-semibold">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {ride.distance}
          </span>
          <span>•</span>
          <span>{ride.driver}</span>
        </div>
        {ride.rating && (
          <div className="flex items-center gap-1">
            {[...Array(ride.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 sticky top-0 z-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Clock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black flex-1">Ride History</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Premium Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search rides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white border-0 text-gray-900 placeholder:text-gray-500 font-semibold rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Premium Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg">
            <p className="text-3xl font-black text-blue-700">{rides.length}</p>
            <p className="text-xs font-bold text-blue-800">Total Rides</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center justify-center gap-1">
              <IndianRupee className="w-4 h-4 text-purple-700" />
              <p className="text-3xl font-black text-purple-700">{rides.reduce((sum, r) => sum + r.fare, 0)}</p>
            </div>
            <p className="text-xs font-bold text-purple-800">Total Spent</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 shadow-lg">
            <p className="text-3xl font-black text-yellow-700">
              {completedRides.length > 0 
                ? (completedRides.reduce((sum, r) => sum + (r.rating || 0), 0) / completedRides.length).toFixed(1)
                : "0.0"
              }
            </p>
            <p className="text-xs font-bold text-yellow-800">Avg Rating</p>
          </Card>
        </div>
      </div>

      {/* Premium Tabs */}
      <Tabs defaultValue="all" className="px-6 pb-6">
        <TabsList className="w-full grid grid-cols-3 mb-6 h-12 bg-white shadow-lg">
          <TabsTrigger value="all" className="font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white">
            All ({rides.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
            Completed ({completedRides.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            Cancelled ({cancelledRides.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-0">
          {filteredRides.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Car className="w-10 h-10 text-white" />
              </div>
              <p className="text-gray-600 font-bold">No rides found</p>
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
            <div className="text-center py-16">
              <p className="text-gray-600 font-bold">No cancelled rides</p>
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
