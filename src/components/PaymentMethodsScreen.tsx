import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Wallet, Check, AlertCircle } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "cash";
  name: string;
  details: string;
  icon: any;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const navigate = useNavigate();

  const paymentMethod: PaymentMethod = {
    id: "1",
    type: "cash",
    name: "Cash Payment",
    details: "Pay driver directly after ride completion",
    icon: Wallet,
    isDefault: true
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Payment Method</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Cash Payment Only</h3>
              <p className="text-sm text-blue-700 mt-1">
                This app only accepts cash payments. Pay your driver directly after the ride is completed.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-primary border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{paymentMethod.name}</h3>
              <p className="text-sm text-muted-foreground">{paymentMethod.details}</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">How Cash Payment Works</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="text-sm">Complete your ride as usual</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="text-sm">Check the fare on the app</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="text-sm">Pay the driver in cash</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Benefits of Cash Payment</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-sm">No transaction fees</p>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-sm">Instant payment to driver</p>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-sm">Direct support to your driver</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
