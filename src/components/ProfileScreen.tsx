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
  Star,
  Award
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
      description: "విజయవంతంగా లాగ్ అవుట్ అయ్యారు",
    });
    onLogout();
    navigate("/auth");
  };

  const menuItems = [
    {
      icon: History,
      label: "Ride History",
      labelTe: "రైడ్ చరిత్ర",
      route: "/ride-history"
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      labelTe: "చెల్లింపు పద్ధతులు",
      route: "/payment-methods"
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      labelTe: "సేవ్ చేసిన చిరునామాలు",
      route: "/saved-addresses"
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      labelTe: "సహాయం & మద్దతు",
      route: "/help-support"
    },
    {
      icon: Settings,
      label: "Settings",
      labelTe: "సెట్టింగ్‌లు",
      route: "/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate("/home")}
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </Button>
          <h1 className="text-xl font-bold">Profile | ప్రొఫైల్</h1>
          <div className="w-10" />
        </div>

        <div className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white">
            <AvatarFallback className="bg-white text-primary text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-white/90 flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            {user.phone}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-10 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <History className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalRides}</p>
            <p className="text-xs text-muted-foreground">Rides</p>
          </Card>
          <Card className="p-4 text-center">
            <Star className="w-6 h-6 text-secondary mx-auto mb-2 fill-secondary" />
            <p className="text-2xl font-bold">{stats.rating}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </Card>
          <Card className="p-4 text-center">
            <Award className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.rewardPoints}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </Card>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 space-y-3">
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate(item.route)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.labelTe}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        ))}

        {/* Logout Button */}
        <Card
          className="p-4 cursor-pointer hover:bg-destructive/10 transition-colors border-destructive/20"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-destructive">Logout</p>
              <p className="text-sm text-destructive/70">లాగ్ అవుట్</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Version Info */}
      <p className="text-center text-xs text-muted-foreground mt-8 mb-6">
        Mana Auto Oka Ride v1.0.0
      </p>
    </div>
  );
};

export default ProfileScreen;
