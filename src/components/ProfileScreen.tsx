import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  History, 
  CreditCard, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronRight,
  Wallet,
  Star,
  Award,
  Info,
  Gift,
  Shield,
  Calendar,
  Users,
  Car,
  Zap,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileScreenProps {
  user: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const ProfileScreen = ({ user, onLogout }: ProfileScreenProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats] = useState({
    totalRides: 42,
    rating: 4.8,
    rewardPoints: 150
  });

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from your account",
    });
    onLogout();
    navigate("/auth");
  };

  const menuItems = [
    {
      icon: Car,
      label: "Driver Mode",
      route: "/driver-dashboard",
      badge: "EARN"
    },
    {
      icon: Wallet,
      label: "Wallet & Earnings",
      route: "/wallet"
    },
    {
      icon: Gift,
      label: "Refer & Earn",
      route: "/referral",
      badge: "₹100"
    },
    {
      icon: Calendar,
      label: "Scheduled Rides",
      route: "/scheduled-rides"
    },
    {
      icon: Users,
      label: "Ride Sharing",
      route: "/carpool",
      badge: "50% OFF"
    },
    {
      icon: Shield,
      label: "Emergency & Safety",
      route: "/emergency",
      badge: "SOS"
    },
    {
      icon: History,
      label: "Ride History",
      route: "/ride-history"
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      route: "/payment-methods"
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      route: "/saved-addresses"
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      route: "/help-support"
    },
    {
      icon: Settings,
      label: "Settings",
      route: "/settings"
    },
    {
      icon: Info,
      label: "About",
      route: "/about"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Premium Header with Gradient */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 pb-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-xl"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <h1 className="text-xl font-black">My Profile</h1>
            </div>
            <div className="w-10" />
          </div>

          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-28 h-28 mx-auto border-4 border-white shadow-2xl ring-4 ring-yellow-300/50">
                <AvatarFallback className="bg-gradient-to-br from-white to-yellow-100 text-yellow-700 text-4xl font-black">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Verified Badge */}
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-green-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </div>
            <h2 className="text-3xl font-black mb-2">{user.name}</h2>
            <p className="text-white/90 flex items-center justify-center gap-2 font-semibold">
              <Phone className="w-4 h-4" />
              {user.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="px-6 -mt-14 mb-6 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-xl">
            <History className="w-7 h-7 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-black text-blue-700">{stats.totalRides}</p>
            <p className="text-xs font-bold text-blue-800">Rides</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 shadow-xl">
            <Star className="w-7 h-7 text-yellow-600 mx-auto mb-2 fill-yellow-400" />
            <p className="text-3xl font-black text-yellow-700">{stats.rating}</p>
            <p className="text-xs font-bold text-yellow-800">Rating</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
            <Award className="w-7 h-7 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-black text-purple-700">{stats.rewardPoints}</p>
            <p className="text-xs font-bold text-purple-800">Points</p>
          </Card>
        </div>
      </div>

      {/* Premium Menu Items */}
      <div className="px-6 space-y-3 pb-8">
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className="p-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-gray-100"
            onClick={() => navigate(item.route)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <item.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="font-black text-gray-900">{item.label}</p>
              </div>
              {item.badge && (
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-black rounded-lg shadow-md">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        ))}

        {/* Premium Logout Button */}
        <Card
          className="p-4 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50"
          onClick={handleLogout}
        >
            <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LogOut className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="font-black text-red-700">Logout</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Premium Footer */}
      <div className="text-center pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-lg border border-gray-200">
          <Zap className="w-4 h-4 text-yellow-600" />
          <p className="text-xs font-bold text-gray-700">© 2025 Dropout • v1.0.0 • Made in India 🇮🇳</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
