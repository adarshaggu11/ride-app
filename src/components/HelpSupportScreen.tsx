import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  Zap,
  ArrowLeft,
  Shield
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { callSupport } from "@/services/phoneService";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  question: string;
  answer: string;
}

const HelpSupportScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCallSupport = async () => {
    try {
      await callSupport();
      toast({
        title: "Calling Support",
        description: "Connecting you to customer support...",
      });
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Unable to call support. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const faqs: FAQ[] = [
    {
      question: "How do I book a ride?",
      answer: "Enter your pickup and drop locations, confirm the fare, and we'll find a nearby auto for you within seconds!"
    },
    {
      question: "How is the fare calculated?",
      answer: "Fare is calculated based on distance: ₹20 base fare + ₹12 per kilometer. The exact fare is shown before booking."
    },
    {
      question: "Can I cancel my ride?",
      answer: "Yes, you can cancel before the driver arrives. No cancellation charges if cancelled within 2 minutes of booking."
    },
    {
      question: "What payment methods are accepted?",
      answer: "Currently, we accept Cash and UPI payments (Google Pay, PhonePe, Paytm). Card payment coming soon!"
    },
    {
      question: "How do I contact my driver?",
      answer: "Once a driver is assigned, you'll see a call button on the ride screen to contact them directly."
    },
    {
      question: "Is my ride safe and tracked?",
      answer: "Yes! All rides are tracked in real-time. You can share your ride with family/friends for added safety. SOS button available in emergencies."
    },
    {
      question: "How do I rate my driver?",
      answer: "After completing your ride, you'll be asked to rate your experience from 1-5 stars and optionally leave a review."
    },
    {
      question: "What if I left something in the auto?",
      answer: "Contact our support team immediately with your ride details. We'll help you connect with the driver to retrieve your item."
    }
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: "Call Support",
      details: "+91 1800-123-4567",
      action: handleCallSupport
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "support@dropout.app",
      action: () => window.open("mailto:support@dropout.app")
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      details: "Chat with us 24/7",
      action: () => alert("Live chat coming soon!")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black">Help & Support</h1>
        </div>
        <p className="text-center text-white/90 font-semibold">We're here to help 24/7</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Premium Contact Options */}
        <div className="space-y-3">
          <h2 className="font-black text-lg text-gray-900">Contact Us</h2>
          {contactOptions.map((option, index) => (
            <Card 
              key={index}
              className="p-5 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-gray-100"
              onClick={option.action}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <option.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900">{option.title}</p>
                  <p className="text-xs text-gray-600 font-bold mt-1">{option.details}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        {/* Premium FAQs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-yellow-600" />
            <h2 className="font-black text-lg text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-2 border-gray-100 rounded-2xl px-5 shadow-md hover:shadow-lg transition-shadow">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="text-left">
                    <p className="font-black text-gray-900">{faq.question}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <p className="text-sm text-gray-700 font-semibold leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Premium Quick Links */}
        <Card className="p-5 space-y-4 border-2 border-gray-100 shadow-lg">
          <h3 className="font-black text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Quick Links
          </h3>
          <div className="space-y-3">
            <button 
              className="w-full text-left text-sm font-bold text-yellow-600 hover:text-orange-600 transition-colors p-3 bg-yellow-50 hover:bg-orange-50 rounded-xl"
              onClick={() => navigate("/terms")}
            >
              Terms & Conditions →
            </button>
            <button 
              className="w-full text-left text-sm font-bold text-yellow-600 hover:text-orange-600 transition-colors p-3 bg-yellow-50 hover:bg-orange-50 rounded-xl"
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy →
            </button>
            <button 
              className="w-full text-left text-sm font-bold text-yellow-600 hover:text-orange-600 transition-colors p-3 bg-yellow-50 hover:bg-orange-50 rounded-xl"
              onClick={() => navigate("/about")}
            >
              About Dropout →
            </button>
          </div>
        </Card>

        {/* Premium Support Hours */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-green-600" />
            <p className="text-base text-center font-black text-green-800">24/7 Support Available</p>
          </div>
          <p className="text-sm text-center text-green-700 font-semibold">
            We're here to help you anytime, anywhere!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupportScreen;
