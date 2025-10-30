import { ChevronLeft, ChevronRight, Bell, Globe, Moon, MapPin, Shield, CreditCard, Volume2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Receive ride updates and offers",
          type: "toggle",
          value: notifications,
          onChange: setNotifications
        },
        {
          icon: MapPin,
          label: "Location Tracking",
          description: "Allow app to track your location",
          type: "toggle",
          value: locationTracking,
          onChange: setLocationTracking
        },
        {
          icon: Volume2,
          label: "Sound Effects",
          description: "Play sounds for notifications",
          type: "toggle",
          value: soundEffects,
          onChange: setSoundEffects
        },
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Enable dark theme",
          type: "toggle",
          value: darkMode,
          onChange: setDarkMode
        }
      ]
    },
    {
      title: "Account",
      items: [
        {
          icon: Globe,
          label: "Language",
          description: "English",
          type: "link",
          route: "/settings/language"
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          description: "Manage your data",
          type: "link",
          route: "/settings/privacy"
        },
        {
          icon: CreditCard,
          label: "Payment Settings",
          description: "Manage payment methods",
          type: "link",
          route: "/payment-methods"
        }
      ]
    }
  ];

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
            <h1 className="text-xl font-black">Settings</h1>
            <p className="text-sm text-white/90">Manage your preferences</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="p-4 space-y-6">
        {settingsSections.map((section, index) => (
          <div key={index}>
            <h2 className="text-sm font-black text-muted-foreground mb-3 px-2 tracking-wide uppercase">
              {section.title}
            </h2>
            <Card className="divide-y shadow-lg overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className={`p-4 transition-all ${item.type === "link" ? "cursor-pointer hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50" : ""}`}
                    onClick={() => item.type === "link" && item.route && navigate(item.route)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      {item.type === "toggle" && item.onChange && (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      )}
                      {item.type === "link" && (
                        <ChevronRight className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        ))}

        {/* App Info */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200 shadow-lg">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <Zap className="w-8 h-8 text-white fill-white" />
            </div>
            <h3 className="font-black text-xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Dropout</h3>
            <p className="text-sm text-muted-foreground font-semibold">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">
              © 2025 Dropout. All rights reserved.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-orange-600">Made in India 🇮🇳</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;
