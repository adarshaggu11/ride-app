import { ChevronLeft, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TermsScreen = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using the Dropout mobile application and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      title: "2. Use of Service",
      content: "Dropout provides a ride-hailing platform that connects passengers with drivers. The service is available to users who are 18 years of age or older. You agree to use the service only for lawful purposes and in accordance with these Terms."
    },
    {
      title: "3. User Account",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account."
    },
    {
      title: "4. Ride Booking & Cancellation",
      content: "All ride bookings are subject to availability of drivers in your area. Cancellation charges may apply if you cancel after 2 minutes of booking or after driver assignment. The fare displayed before booking is final and includes all applicable charges."
    },
    {
      title: "5. Payment Terms",
      content: "Payment can be made through Cash or UPI (Google Pay, PhonePe, Paytm). All payments are due immediately upon completion of the ride. In case of payment disputes, please contact our support team within 24 hours."
    },
    {
      title: "6. Driver Conduct",
      content: "All drivers are independent contractors and not employees of Dropout. Drivers must maintain valid licenses, insurance, and vehicle documentation. Any issues with driver behavior should be reported immediately through the app."
    },
    {
      title: "7. User Conduct",
      content: "Users must treat drivers with respect and follow local laws. Prohibited activities include: harassment, violence, property damage, smoking in vehicles, or any illegal activity. Violation may result in account suspension or termination."
    },
    {
      title: "8. Safety & Security",
      content: "While we implement safety measures including driver verification and ride tracking, Dropout cannot guarantee absolute safety. Users are encouraged to use SOS features and share ride details with trusted contacts for added security."
    },
    {
      title: "9. Liability Limitation",
      content: "Dropout acts as a technology platform and is not liable for actions of drivers or third parties. We are not responsible for any direct, indirect, incidental, or consequential damages arising from use of our service, except where prohibited by law."
    },
    {
      title: "10. Data & Privacy",
      content: "Your use of Dropout is also governed by our Privacy Policy. We collect and process personal data in accordance with applicable data protection laws. Location data is used for ride matching and tracking purposes only."
    },
    {
      title: "11. Intellectual Property",
      content: "All content, features, and functionality of the Dropout app including logos, designs, and software are owned by Dropout Technologies Pvt. Ltd. and protected by copyright, trademark, and other intellectual property laws."
    },
    {
      title: "12. Modifications to Terms",
      content: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service after changes constitutes acceptance of the modified terms."
    },
    {
      title: "13. Termination",
      content: "We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion."
    },
    {
      title: "14. Governing Law",
      content: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana."
    },
    {
      title: "15. Contact Information",
      content: "For questions about these Terms, please contact us at: legal@dropout.in or write to us at Dropout Technologies Pvt. Ltd., Hyderabad, Telangana, India."
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
            <h1 className="text-xl font-bold">Terms & Conditions</h1>
            <p className="text-sm text-white/80">Last updated: October 28, 2025</p>
          </div>
          <FileText className="w-6 h-6" />
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Important Notice
              </p>
              <p className="text-xs text-blue-800">
                Please read these terms carefully before using our service. By using Dropout, you agree to these terms and conditions.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Terms Content */}
      <div className="px-4 space-y-4">
        {sections.map((section, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-bold text-base mb-2">{section.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {section.content}
            </p>
          </Card>
        ))}
      </div>

      {/* Agreement Footer */}
      <div className="px-4 mt-6">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 text-center">
          <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-sm font-semibold mb-2">
            By using Dropout, you agree to these Terms & Conditions
          </p>
          <p className="text-xs text-muted-foreground">
            Version 1.0 • Effective from October 28, 2025
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TermsScreen;
