import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Wallet, Check, AlertCircle, Zap, ArrowLeft, IndianRupee, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black">Payment Method</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-blue-900 mb-2">Cash Payment Only</h3>
              <p className="text-sm text-blue-700 font-semibold leading-relaxed">
                This app only accepts cash payments. Pay your driver directly after the ride is completed.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-4 border-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl">
              <IndianRupee className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-gray-900">{paymentMethod.name}</h3>
              <p className="text-sm text-gray-700 font-semibold">{paymentMethod.details}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-gray-100 shadow-lg">
          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            How Cash Payment Works
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center text-base font-black flex-shrink-0 shadow-lg">1</div>
              <div className="flex-1 pt-2">
                <p className="text-sm font-bold text-gray-900">Complete your ride as usual</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center text-base font-black flex-shrink-0 shadow-lg">2</div>
              <div className="flex-1 pt-2">
                <p className="text-sm font-bold text-gray-900">Check the fare on the app</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center text-base font-black flex-shrink-0 shadow-lg">3</div>
              <div className="flex-1 pt-2">
                <p className="text-sm font-bold text-gray-900">Pay the driver in cash</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Benefits of Cash Payment
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
              <p className="text-sm font-bold text-gray-900">No transaction fees</p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
              <p className="text-sm font-bold text-gray-900">Instant payment to driver</p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
              <p className="text-sm font-bold text-gray-900">Direct support to your driver</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
