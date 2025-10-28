import { ChevronLeft, Zap, Shield, Users, Heart, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AboutScreen = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Cities", value: "25+", icon: TrendingUp },
    { label: "Happy Rides", value: "1M+", icon: Heart },
    { label: "Rating", value: "4.8", icon: Star }
  ];

  const features = [
    {
      icon: Zap,
      title: "Zero Booking Fee",
      description: "Unlike competitors, we don't charge any booking fees. What you see is what you pay!"
    },
    {
      icon: Shield,
      title: "100% Safe & Verified",
      description: "All drivers are background checked and verified for your safety and peace of mind."
    },
    {
      icon: Heart,
      title: "Built for India",
      description: "Designed specifically for Indian roads and traffic conditions with local insights."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-accent to-secondary text-white p-4 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/profile")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">About Dropout</h1>
          </div>
        </div>

        {/* Logo & Brand */}
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-12 h-12 text-primary" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black mb-2">Dropout</h2>
          <p className="text-white/90 text-lg">Your Ride, Delivered</p>
          <p className="text-white/70 text-sm mt-2">Version 1.0.0</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-10 mb-6">
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Mission */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-3">Our Mission</h3>
        <Card className="p-4">
          <p className="text-muted-foreground leading-relaxed">
            To revolutionize urban mobility in India by providing the most affordable, safe, and reliable ride-hailing service. 
            We believe transportation should be accessible to everyone without hidden fees or surge pricing nightmares.
          </p>
        </Card>
      </div>

      {/* Features */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-3">Why Choose Us?</h3>
        <div className="space-y-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Company Info */}
      <div className="px-4 mb-6">
        <Card className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold mb-1">Company</h4>
            <p className="text-sm text-muted-foreground">Dropout Technologies Pvt. Ltd.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Headquarters</h4>
            <p className="text-sm text-muted-foreground">Hyderabad, Telangana, India</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Founded</h4>
            <p className="text-sm text-muted-foreground">2025</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Contact</h4>
            <p className="text-sm text-muted-foreground">support@dropout.in</p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="px-4">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 text-center">
          <Heart className="w-8 h-8 text-primary mx-auto mb-2" fill="currentColor" />
          <p className="text-sm text-muted-foreground">
            Made with ❤️ in India
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 Dropout. All rights reserved.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AboutScreen;
