import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Star, IndianRupee, Zap, MapPin, Clock, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TripCompletedScreen = () => {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please rate your experience",
        description: "Your rating helps us improve our service",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you for your feedback!",
      description: "Your rating has been submitted successfully",
    });

    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex flex-col items-center justify-center px-6 py-8">
      <div className="max-w-md w-full space-y-6">
        {/* Premium Success Header */}
        <div className="text-center">
          {/* Animated Success Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Outer Ring - Rotating */}
            <div className="absolute inset-0 border-4 border-dashed border-green-400 rounded-full animate-spin-slow"></div>
            
            {/* Inner Circle - Success */}
            <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
            </div>

            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-orange-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Trip Completed!
          </h2>
          <p className="text-gray-600 font-semibold text-lg">Thank you for riding with Dropout</p>
        </div>

        {/* Premium Fare Card */}
        <Card className="p-8 space-y-6 shadow-2xl border-2 border-gray-100">
          {/* Total Fare Display */}
          <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200">
            <p className="text-sm font-bold text-gray-600 mb-3">TOTAL FARE</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <IndianRupee className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <span className="text-6xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">80</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-yellow-300 inline-block">
              <p className="text-xs font-bold text-gray-700">💵 Cash Payment</p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-gray-600">Distance</span>
              </div>
              <span className="font-black text-gray-900">5.2 km</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-bold text-gray-600">Duration</span>
              </div>
              <span className="font-black text-gray-900">18 min</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-bold text-gray-600">Driver</span>
              </div>
              <span className="font-black text-gray-900">Ravi Kumar</span>
            </div>
          </div>

          {/* Rating Section */}
          <div className="pt-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <p className="text-center font-black text-lg mb-4 text-gray-800">Rate Your Experience</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 rounded-full transform"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-12 h-12 transition-all duration-300 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm font-bold text-purple-700 mt-3 animate-fade-in">
                {rating === 5 ? "⭐ Excellent!" : rating === 4 ? "👍 Great!" : rating === 3 ? "😊 Good" : ""}
              </p>
            )}
          </div>

          {/* Premium Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-16 text-lg font-black shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)'
            }}
            size="lg"
          >
            <Zap className="w-6 h-6 mr-2" />
            Submit & Go Home
          </Button>
        </Card>

        {/* Thank You Badge */}
        <div className="text-center">
          <p className="text-sm text-gray-500 font-semibold">
            Hope to see you again soon! 🚗✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripCompletedScreen;
