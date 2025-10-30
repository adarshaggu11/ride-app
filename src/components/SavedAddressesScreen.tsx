import { ChevronLeft, MapPin, Home, Briefcase, Heart, Plus, Edit2, Trash2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  icon: typeof MapPin;
  type: "home" | "work" | "favorite" | "other";
}

const SavedAddressesScreen = () => {
  const navigate = useNavigate();
  const [addresses] = useState<SavedAddress[]>([
    {
      id: "1",
      label: "Home",
      address: "123, Jubilee Hills, Hyderabad, Telangana 500033",
      icon: Home,
      type: "home"
    },
    {
      id: "2",
      label: "Office",
      address: "Tower A, Hitech City, Hyderabad, Telangana 500081",
      icon: Briefcase,
      type: "work"
    },
    {
      id: "3",
      label: "Favorite Cafe",
      address: "10 Downing Street, Banjara Hills, Hyderabad 500034",
      icon: Heart,
      type: "favorite"
    }
  ]);

  const getAddressColor = (type: string) => {
    switch (type) {
      case "home":
        return "bg-blue-50 border-blue-200";
      case "work":
        return "bg-purple-50 border-purple-200";
      case "favorite":
        return "bg-pink-50 border-pink-200";
      default:
        return "bg-muted";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "home":
        return "text-blue-600 bg-blue-100";
      case "work":
        return "text-purple-600 bg-purple-100";
      case "favorite":
        return "text-pink-600 bg-pink-100";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/profile")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-black">Saved Addresses</h1>
            <p className="text-sm text-white/90">Quick access to your places</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm"
            onClick={() => {/* TODO: Add new address */}}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Addresses List */}
      <div className="p-4 space-y-3">
        {addresses.length > 0 ? (
          addresses.map((address) => {
            const Icon = address.icon;
            return (
              <Card
                key={address.id}
                className={`p-4 cursor-pointer hover:shadow-xl transition-all duration-300 ${getAddressColor(address.type)} border-l-4`}
                style={{ borderLeftColor: address.type === 'home' ? '#2563eb' : address.type === 'work' ? '#9333ea' : '#ec4899' }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getIconColor(address.type)} shadow-md`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-1">{address.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {address.address}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 bg-white/50 hover:bg-white hover:scale-110 transition-all shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Edit address
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 bg-red-50 text-destructive hover:text-destructive hover:bg-red-100 hover:scale-110 transition-all shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Delete address
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
            <h3 className="text-lg font-black mb-2">No Saved Addresses</h3>
            <p className="text-muted-foreground mb-6">Add your frequent locations for quick access</p>
            <Button 
              className="h-12 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
              onClick={() => {/* TODO: Add address */}}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Address
            </Button>
          </div>
        )}
      </div>

      {/* Add New Address Button */}
      {addresses.length > 0 && (
        <div className="px-4 mt-4">
          <Button
            className="w-full h-14 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold shadow-lg"
            onClick={() => {/* TODO: Add new address */}}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Address
          </Button>
        </div>
      )}

      {/* Quick Tips */}
      <Card className="m-4 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200 shadow-lg">
        <h4 className="font-black mb-2 flex items-center gap-2 text-orange-600">
          <MapPin className="w-5 h-5" />
          Quick Tip
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Save your frequently visited places like Home, Office, Gym etc. for faster booking! 🚀
        </p>
      </Card>
    </div>
  );
};

export default SavedAddressesScreen;
