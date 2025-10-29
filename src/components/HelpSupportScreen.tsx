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
  HelpCircle
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
      titleTe: "సపోర్ట్‌కు కాల్ చేయండి",
      details: "+91 1800-123-4567",
      action: handleCallSupport
    },
    {
      icon: Mail,
      title: "Email Us",
      titleTe: "మాకు ఇమెయిల్ చేయండి",
      details: "support@manauto.com",
      action: () => window.open("mailto:support@manauto.com")
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      titleTe: "లైవ్ చాట్",
      details: "Chat with us 24/7",
      action: () => alert("Live chat coming soon!")
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Help & Support</h1>
          <div className="w-10" />
        </div>
        <p className="text-center text-white/90">సహాయం & మద్దతు</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Contact Options */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Contact Us</h2>
          {contactOptions.map((option, index) => (
            <Card 
              key={index}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={option.action}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.titleTe}</p>
                  <p className="text-xs text-primary mt-1">{option.details}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Frequently Asked Questions</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">తరచుగా అడిగే ప్రశ్నలు</p>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <p className="font-semibold">{faq.question}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <p className="text-sm">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Quick Links */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Quick Links</h3>
          <div className="space-y-2">
            <button 
              className="w-full text-left text-sm text-primary hover:underline"
              onClick={() => navigate("/terms")}
            >
              Terms & Conditions
            </button>
            <button 
              className="w-full text-left text-sm text-primary hover:underline"
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </button>
            <button 
              className="w-full text-left text-sm text-primary hover:underline"
              onClick={() => navigate("/about")}
            >
              About Dropout
            </button>
          </div>
        </Card>

        {/* Support Hours */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-center font-semibold">24/7 Support Available</p>
          <p className="text-xs text-center text-muted-foreground mt-2">
            We're here to help you anytime, anywhere!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupportScreen;
