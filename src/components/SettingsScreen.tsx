import { ChevronLeft, ChevronRight, Bell, Globe, Moon, MapPin, Shield, CreditCard, Volume2 } from "lucide-react";
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
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/profile")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm text-white/80">Manage your preferences</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="p-4 space-y-6">
        {settingsSections.map((section, index) => (
          <div key={index}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
              {section.title}
            </h2>
            <Card className="divide-y">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className={`p-4 ${item.type === "link" ? "cursor-pointer hover:bg-muted/50" : ""}`}
                    onClick={() => item.type === "link" && item.route && navigate(item.route)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      {item.type === "toggle" && item.onChange && (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      )}
                      {item.type === "link" && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        ))}

        {/* App Info */}
        <Card className="p-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Dropout</h3>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">
              © 2025 Dropout. All rights reserved.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;
