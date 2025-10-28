import { ChevronLeft, Shield, Lock, Eye, Database, Share2, Bell, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PrivacyPolicyScreen = () => {
  const navigate = useNavigate();

  const dataCollected = [
    {
      icon: Eye,
      title: "Personal Information",
      items: ["Name, phone number, email", "Profile photo (optional)", "Payment information"]
    },
    {
      icon: Database,
      title: "Location Data",
      items: ["Pickup and drop-off locations", "Real-time GPS during rides", "Saved addresses"]
    },
    {
      icon: Share2,
      title: "Usage Information",
      items: ["Ride history and preferences", "App interaction data", "Device information"]
    }
  ];

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, book a ride, or contact customer support. This includes your name, phone number, email address, payment information, and location data necessary for providing our ride-hailing services."
    },
    {
      title: "2. How We Use Your Information",
      content: "Your information is used to: provide and improve our services, process ride bookings and payments, match you with nearby drivers, enable communication between riders and drivers, ensure safety and security, send ride updates and notifications, and comply with legal obligations."
    },
    {
      title: "3. Location Data",
      content: "We collect precise location data when you use the app to connect you with nearby drivers and provide navigation. Location tracking continues during your ride for safety and service quality. You can control location permissions in your device settings, but this may limit app functionality."
    },
    {
      title: "4. Information Sharing",
      content: "We share your information with: Drivers (name, phone, pickup/drop locations), Payment processors (for transactions), Service providers (for analytics, customer support), Law enforcement (when legally required). We never sell your personal information to third parties."
    },
    {
      title: "5. Data Security",
      content: "We implement industry-standard security measures including encryption, secure servers, and access controls to protect your data. However, no method of transmission over the internet is 100% secure. Please use strong passwords and keep your account credentials confidential."
    },
    {
      title: "6. Data Retention",
      content: "We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Ride history is kept for 7 years for legal and tax purposes. Location data is anonymized after ride completion. You can request data deletion by contacting support."
    },
    {
      title: "7. Your Rights",
      content: "You have the right to: access your personal data, correct inaccurate information, delete your account and data, object to data processing, withdraw consent at any time, and port your data to another service. Contact us at privacy@dropout.in to exercise these rights."
    },
    {
      title: "8. Cookies & Analytics",
      content: "We use cookies and similar technologies to understand how you use our app, improve performance, and provide personalized experiences. Analytics help us identify bugs and optimize features. You can manage cookie preferences in your device settings."
    },
    {
      title: "9. Children's Privacy",
      content: "Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately so we can delete it."
    },
    {
      title: "10. Changes to Privacy Policy",
      content: "We may update this Privacy Policy from time to time. Changes will be posted in the app with an updated effective date. Continued use of our service after changes constitutes acceptance of the updated policy. We recommend reviewing this policy periodically."
    },
    {
      title: "11. Contact Us",
      content: "If you have questions about this Privacy Policy or our data practices, please contact us at: privacy@dropout.in or write to: Dropout Technologies Pvt. Ltd., Hyderabad, Telangana, India."
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
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-white/80">Last updated: October 28, 2025</p>
          </div>
          <Shield className="w-6 h-6" />
        </div>
      </div>

      {/* Privacy Commitment */}
      <div className="p-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">
                Your Privacy Matters
              </p>
              <p className="text-xs text-green-800">
                We are committed to protecting your privacy and being transparent about how we collect, use, and share your information.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Collection Overview */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-base mb-3">What Data We Collect</h3>
        <div className="space-y-3">
          {dataCollected.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{category.title}</h4>
                    <ul className="space-y-1">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="px-4 space-y-4">
        <h3 className="font-bold text-base">Detailed Privacy Policy</h3>
        {sections.map((section, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-bold text-base mb-2">{section.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {section.content}
            </p>
          </Card>
        ))}
      </div>

      {/* Your Rights */}
      <div className="px-4 mt-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Your Data Rights
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Eye className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Access and download your data anytime</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Update or correct your information</span>
            </div>
            <div className="flex items-start gap-2">
              <Trash2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Delete your account and data</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="px-4 mt-6">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 text-center">
          <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-sm font-semibold mb-2">
            Questions about your privacy?
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Contact us at privacy@dropout.in
          </p>
          <p className="text-xs text-muted-foreground">
            Version 1.0 • Effective from October 28, 2025
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyScreen;
