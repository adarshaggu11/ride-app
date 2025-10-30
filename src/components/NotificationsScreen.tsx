import { Bell, ChevronLeft, Check, Gift, MapPin, Star, AlertCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Notification {
  id: string;
  type: "ride" | "promo" | "alert" | "achievement";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
}

const NotificationsScreen = () => {
  const navigate = useNavigate();

  const notifications: Notification[] = [
    {
      id: "1",
      type: "ride",
      title: "Ride Completed",
      message: "Your ride to Hitech City has been completed. Total fare: ₹120",
      time: "2 hours ago",
      read: false,
      icon: Check
    },
    {
      id: "2",
      type: "promo",
      title: "Special Offer!",
      message: "Get 20% off on your next 3 rides. Use code: RIDE20",
      time: "5 hours ago",
      read: false,
      icon: Gift
    },
    {
      id: "3",
      type: "achievement",
      title: "Milestone Achieved!",
      message: "Congratulations! You've completed 10 rides. Here's ₹50 bonus credit.",
      time: "1 day ago",
      read: true,
      icon: Star
    },
    {
      id: "4",
      type: "alert",
      title: "Payment Reminder",
      message: "Complete your pending payment of ₹85 for ride #R1234",
      time: "2 days ago",
      read: true,
      icon: AlertCircle
    },
    {
      id: "5",
      type: "ride",
      title: "Driver Assigned",
      message: "Your driver Rajesh is on the way. Arriving in 5 minutes.",
      time: "3 days ago",
      read: true,
      icon: MapPin
    }
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ride":
        return "bg-blue-50 border-blue-200";
      case "promo":
        return "bg-green-50 border-green-200";
      case "achievement":
        return "bg-purple-50 border-purple-200";
      case "alert":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-muted";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "ride":
        return "text-blue-600";
      case "promo":
        return "text-green-600";
      case "achievement":
        return "text-purple-600";
      case "alert":
        return "text-orange-600";
      default:
        return "text-muted-foreground";
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
            onClick={() => navigate("/home")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-black">Notifications</h1>
            <p className="text-sm text-white/90">Stay updated with your rides</p>
          </div>
          {/* Notification Badge */}
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bell className="w-5 h-5" />
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                {notifications.filter(n => !n.read).length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer hover:shadow-xl transition-all duration-300 ${
                  !notification.read ? "border-l-4 border-l-orange-500 shadow-md" : ""
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getIconColor(notification.type)} bg-gradient-to-br from-white to-gray-50 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-bold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2.5 h-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full animate-pulse shadow-lg"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2 font-medium">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
            <h3 className="text-lg font-black mb-2">No Notifications</h3>
            <p className="text-muted-foreground">You're all caught up! 🎉</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {notifications.length > 0 && (
        <div className="px-4 mt-4">
          <Button 
            variant="outline" 
            className="w-full h-14 font-semibold border-2 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:border-orange-300 transition-all"
          >
            <Check className="w-5 h-5 mr-2" />
            Mark All as Read
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;
