import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Plus,
  Check,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: "upi" | "cash" | "card";
  name: string;
  details: string;
  icon: any;
  isDefault: boolean;
}

const PaymentMethodsScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "cash",
      name: "Cash",
      details: "Pay driver directly",
      icon: Wallet,
      isDefault: true
    },
    {
      id: "2",
      type: "upi",
      name: "Google Pay",
      details: "user@okaxis",
      icon: Smartphone,
      isDefault: false
    },
    {
      id: "3",
      type: "upi",
      name: "PhonePe",
      details: "9876543210@ybl",
      icon: Smartphone,
      isDefault: false
    }
  ]);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    
    toast({
      title: "Default payment method updated",
      description: "డిఫాల్ట్ చెల్లింపు పద్ధతి నవీకరించబడింది"
    });
  };

  const handleAddPayment = () => {
    toast({
      title: "Coming Soon!",
      description: "Payment integration will be available soon",
    });
  };

  const PaymentCard = ({ method }: { method: PaymentMethod }) => (
    <Card 
      className={`p-4 cursor-pointer transition-all ${
        method.isDefault ? 'border-primary border-2' : 'hover:bg-muted/50'
      }`}
      onClick={() => !method.isDefault && handleSetDefault(method.id)}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          method.type === 'cash' 
            ? 'bg-primary/10' 
            : method.type === 'upi'
            ? 'bg-secondary/10'
            : 'bg-muted'
        }`}>
          <method.icon className={`w-6 h-6 ${
            method.type === 'cash' 
              ? 'text-primary' 
              : method.type === 'upi'
              ? 'text-secondary'
              : 'text-muted-foreground'
          }`} />
        </div>
        
        <div className="flex-1">
          <p className="font-semibold">{method.name}</p>
          <p className="text-sm text-muted-foreground">{method.details}</p>
          {method.type === 'cash' && (
            <p className="text-xs text-muted-foreground mt-1">
              నగదు | ప్రత్యక్ష చెల్లింపు
            </p>
          )}
        </div>

        {method.isDefault ? (
          <div className="flex items-center gap-2 text-primary">
            <Check className="w-5 h-5" />
            <span className="text-sm font-semibold">Default</span>
          </div>
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Payment Methods</h1>
          <div className="w-10" />
        </div>
        <p className="text-center text-white/90 mt-2">చెల్లింపు పద్ధతులు</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Info Card */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-center">
            Select your preferred payment method for rides
          </p>
          <p className="text-xs text-center text-muted-foreground mt-1">
            రైడ్‌ల కోసం మీ ఇష్టమైన చెల్లింపు పద్ధతిని ఎంచుకోండి
          </p>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg mb-3">Available Methods</h2>
          {paymentMethods.map(method => (
            <PaymentCard key={method.id} method={method} />
          ))}
        </div>

        {/* Add Payment Method */}
        <Card 
          className="p-4 cursor-pointer hover:bg-primary/5 transition-colors border-dashed"
          onClick={handleAddPayment}
        >
          <div className="flex items-center gap-4 justify-center text-primary">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Add Payment Method</p>
              <p className="text-sm">చెల్లింపు పద్ధతిని జోడించండి</p>
            </div>
          </div>
        </Card>

        {/* UPI Options */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Quick UPI Apps</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Google Pay", color: "bg-blue-500" },
              { name: "PhonePe", color: "bg-purple-500" },
              { name: "Paytm", color: "bg-blue-600" }
            ].map((app, index) => (
              <Card 
                key={index}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleAddPayment}
              >
                <div className={`w-12 h-12 ${app.color} rounded-lg mb-2 mx-auto`}></div>
                <p className="text-xs text-center font-medium">{app.name}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Card Options */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Card Payment (Coming Soon)</h3>
          <Card 
            className="p-4 opacity-50 cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-muted-foreground">Credit/Debit Card</p>
                <p className="text-sm text-muted-foreground">Available soon</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info */}
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-center text-muted-foreground">
            Currently, cash payment is recommended. UPI and card payments will be enabled soon.
          </p>
          <p className="text-xs text-center text-muted-foreground mt-2">
            ప్రస్తుతం, నగదు చెల్లింపు సిఫార్సు చేయబడింది. UPI మరియు కార్డ్ చెల్లింపులు త్వరలో ప్రారంభించబడతాయి.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethodsScreen;
