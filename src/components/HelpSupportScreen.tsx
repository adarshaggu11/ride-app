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

interface FAQ {
  question: string;
  questionTe: string;
  answer: string;
  answerTe: string;
}

const HelpSupportScreen = () => {
  const navigate = useNavigate();
  
  const faqs: FAQ[] = [
    {
      question: "How do I book a ride?",
      questionTe: "నేను రైడ్‌ను ఎలా బుక్ చేయాలి?",
      answer: "Enter your pickup and drop locations, confirm the fare, and we'll find a nearby auto for you within seconds!",
      answerTe: "మీ పికప్ మరియు డ్రాప్ లొకేషన్‌లను నమోదు చేయండి, ధరను నిర్ధారించండి, మరియు మేము సెకన్లలో మీకు సమీప ఆటోను కనుగొంటాము!"
    },
    {
      question: "How is the fare calculated?",
      questionTe: "ధర ఎలా లెక్కించబడుతుంది?",
      answer: "Fare is calculated based on distance: ₹20 base fare + ₹12 per kilometer. The exact fare is shown before booking.",
      answerTe: "దూరం ఆధారంగా ధర లెక్కించబడుతుంది: ₹20 బేస్ ఛార్జ్ + కిలోమీటరుకు ₹12. ఖచ్చితమైన ధర బుకింగ్‌కు ముందు చూపబడుతుంది."
    },
    {
      question: "Can I cancel my ride?",
      questionTe: "నేను నా రైడ్‌ను రద్దు చేయవచ్చా?",
      answer: "Yes, you can cancel before the driver arrives. No cancellation charges if cancelled within 2 minutes of booking.",
      answerTe: "అవును, డ్రైవర్ వచ్చేలోపు మీరు రద్దు చేయవచ్చు. బుకింగ్ తర్వాత 2 నిమిషాలలోపు రద్దు చేస్తే రద్దు ఛార్జీలు లేవు."
    },
    {
      question: "What payment methods are accepted?",
      questionTe: "ఏ చెల్లింపు పద్ధతులు అంగీకరించబడతాయి?",
      answer: "Currently, we accept Cash and UPI payments (Google Pay, PhonePe, Paytm). Card payment coming soon!",
      answerTe: "ప్రస్తుతం, మేము నగదు మరియు UPI చెల్లింపులను అంగీకరిస్తాము (Google Pay, PhonePe, Paytm). కార్డ్ చెల్లింపు త్వరలో!"
    },
    {
      question: "How do I contact my driver?",
      questionTe: "నేను నా డ్రైవర్‌ను ఎలా సంప్రదించాలి?",
      answer: "Once a driver is assigned, you'll see a call button on the ride screen to contact them directly.",
      answerTe: "డ్రైవర్ కేటాయించబడిన తర్వాత, వారిని నేరుగా సంప్రదించడానికి రైడ్ స్క్రీన్‌పై కాల్ బటన్ కనిపిస్తుంది."
    },
    {
      question: "Is my ride safe and tracked?",
      questionTe: "నా రైడ్ సురక్షితమా మరియు ట్రాక్ చేయబడుతుందా?",
      answer: "Yes! All rides are tracked in real-time. You can share your ride with family/friends for added safety. SOS button available in emergencies.",
      answerTe: "అవును! అన్ని రైడ్‌లు రియల్-టైమ్‌లో ట్రాక్ చేయబడతాయి. అదనపు భద్రత కోసం మీ రైడ్‌ను కుటుంబం/స్నేహితులతో పంచుకోవచ్చు. అత్యవసర పరిస్థితుల్లో SOS బటన్ అందుబాటులో ఉంది."
    },
    {
      question: "How do I rate my driver?",
      questionTe: "నేను నా డ్రైవర్‌ను ఎలా రేట్ చేయాలి?",
      answer: "After completing your ride, you'll be asked to rate your experience from 1-5 stars and optionally leave a review.",
      answerTe: "మీ రైడ్ పూర్తి చేసిన తర్వాత, 1-5 నక్షత్రాల నుండి మీ అనుభవాన్ని రేట్ చేయమని మరియు ఐచ్ఛికంగా సమీక్షను వదిలివేయమని అడగబడుతుంది."
    },
    {
      question: "What if I left something in the auto?",
      questionTe: "నేను ఆటోలో ఏదైనా మర్చిపోతే?",
      answer: "Contact our support team immediately with your ride details. We'll help you connect with the driver to retrieve your item.",
      answerTe: "మీ రైడ్ వివరాలతో వెంటనే మా సపోర్ట్ టీమ్‌ను సంప్రదించండి. మీ వస్తువును తిరిగి పొందడానికి డ్రైవర్‌తో కనెక్ట్ అవ్వడానికి మేము మీకు సహాయం చేస్తాము."
    }
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: "Call Support",
      titleTe: "సపోర్ట్‌కు కాల్ చేయండి",
      details: "+91 1800-123-4567",
      action: () => window.open("tel:+911800123456")
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
                    <p className="text-sm text-muted-foreground">{faq.questionTe}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <p className="text-sm mb-2">{faq.answer}</p>
                  <p className="text-sm text-muted-foreground">{faq.answerTe}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Quick Links */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Quick Links</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-primary hover:underline">
              Terms & Conditions
            </button>
            <button className="w-full text-left text-sm text-primary hover:underline">
              Privacy Policy
            </button>
            <button className="w-full text-left text-sm text-primary hover:underline">
              Refund Policy
            </button>
            <button className="w-full text-left text-sm text-primary hover:underline">
              Community Guidelines
            </button>
          </div>
        </Card>

        {/* Support Hours */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-center font-semibold">24/7 Support Available</p>
          <p className="text-xs text-center text-muted-foreground mt-1">
            24/7 మద్దతు అందుబాటులో ఉంది
          </p>
          <p className="text-xs text-center text-muted-foreground mt-2">
            We're here to help you anytime, anywhere!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupportScreen;
