import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Trophy,
  Wallet,
  Star,
  TrendingUp,
  MessageCircle,
  Mail,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReferralScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState("DROPOUT2025");
  
  // Mock data - replace with real API
  const [stats] = useState({
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 4,
    totalEarnings: 800,
    pendingEarnings: 400
  });

  const [referrals] = useState([
    { id: 1, name: "Rajesh Kumar", status: "completed", reward: 100, date: "2 days ago", avatar: "RK" },
    { id: 2, name: "Priya Sharma", status: "completed", reward: 100, date: "5 days ago", avatar: "PS" },
    { id: 3, name: "Amit Patel", status: "pending", reward: 100, date: "1 week ago", avatar: "AP" },
    { id: 4, name: "Sneha Reddy", status: "completed", reward: 100, date: "2 weeks ago", avatar: "SR" },
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: "Vikram Singh", referrals: 45, earnings: 4500 },
    { rank: 2, name: "Ananya Gupta", referrals: 38, earnings: 3800 },
    { rank: 3, name: "You", referrals: 12, earnings: 800, isCurrentUser: true },
    { rank: 4, name: "Ravi Kumar", referrals: 10, earnings: 700 },
    { rank: 5, name: "Meera Joshi", referrals: 8, earnings: 600 },
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: "Code Copied!",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const message = `Join Dropout and get ₹50 off on your first ride! Use my referral code: ${referralCode}`;
    const url = `https://dropout.app/ref/${referralCode}`;
    
    let shareUrl = "";
    switch(platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + " " + url)}`;
        break;
      case "sms":
        shareUrl = `sms:?body=${encodeURIComponent(message + " " + url)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Join Dropout&body=${encodeURIComponent(message + " " + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/profile")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-black">Refer & Earn</h1>
            <p className="text-sm text-white/90">Invite friends, earn rewards! 🎁</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Gift className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="p-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">₹100 + ₹50</h2>
              <p className="text-white/90 text-sm">Per successful referral</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Gift className="w-8 h-8" />
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-sm leading-relaxed">
              <strong>You get ₹100</strong> when friend completes first ride<br/>
              <strong>Friend gets ₹50</strong> off on their first ride
            </p>
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalReferrals}</p>
            <p className="text-xs text-muted-foreground">Total Referrals</p>
          </Card>
          <Card className="p-4 text-center">
            <Wallet className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">₹{stats.totalEarnings}</p>
            <p className="text-xs text-muted-foreground">Total Earned</p>
          </Card>
          <Card className="p-4 text-center">
            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.successfulReferrals}</p>
            <p className="text-xs text-muted-foreground">Successful</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">₹{stats.pendingEarnings}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </Card>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="px-4 mb-6">
        <Card className="p-5">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Your Referral Code
          </h3>
          <div className="flex gap-2 mb-4">
            <Input
              value={referralCode}
              readOnly
              className="flex-1 text-center text-lg font-bold text-primary bg-blue-50 border-blue-200"
            />
            <Button
              onClick={handleCopyCode}
              variant={copied ? "default" : "outline"}
              className="px-6"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Share via:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleShare("whatsapp")}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                onClick={() => handleShare("sms")}
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                SMS
              </Button>
              <Button
                onClick={() => handleShare("email")}
                variant="outline"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Referral History */}
      <div className="px-4 mb-6">
        <h3 className="font-bold mb-3">Recent Referrals</h3>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <Card key={referral.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {referral.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">{referral.name}</h4>
                  <p className="text-sm text-muted-foreground">{referral.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${referral.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                    ₹{referral.reward}
                  </p>
                  <p className={`text-xs font-semibold ${referral.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                    {referral.status === 'completed' ? 'Earned' : 'Pending'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-4 mb-6">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Top Referrers This Month
        </h3>
        <Card className="overflow-hidden">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center gap-4 p-4 border-b last:border-b-0 ${
                user.isCurrentUser ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                user.rank === 3 ? 'bg-orange-400 text-orange-900' :
                'bg-gray-200 text-gray-600'
              }`}>
                {user.rank === 1 && <Trophy className="w-5 h-5" />}
                {user.rank !== 1 && `#${user.rank}`}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold ${user.isCurrentUser ? 'text-blue-600' : ''}`}>
                  {user.name} {user.isCurrentUser && '(You)'}
                </h4>
                <p className="text-sm text-muted-foreground">{user.referrals} referrals</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">₹{user.earnings}</p>
                <p className="text-xs text-muted-foreground">earned</p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* How it Works */}
      <div className="px-4">
        <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            How It Works
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold">Share your code</p>
                <p className="text-sm text-muted-foreground">Send your unique referral code to friends</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold">Friend signs up</p>
                <p className="text-sm text-muted-foreground">They use your code and get ₹50 off</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-semibold">You both earn!</p>
                <p className="text-sm text-muted-foreground">Get ₹100 when they complete first ride</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReferralScreen;
