import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Wallet, TrendingUp, DollarSign, Gift, Star, Clock, MapPin, Plus, Zap, IndianRupee } from "lucide-react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  time: string;
}

interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  distance: string;
  duration: string;
  earnings: number;
  status: "online" | "offline";
}

const WalletScreen = () => {
  const navigate = useNavigate();
  const [balance] = useState(856.78);
  const [todayEarnings] = useState(92.07);
  
  const transactions: Transaction[] = [
    { id: "1", type: "credit", amount: 125, description: "Ride payment received", date: "Today", time: "10:30 AM" },
    { id: "2", type: "debit", amount: 50, description: "Fuel expense", date: "Today", time: "9:15 AM" },
    { id: "3", type: "credit", amount: 200, description: "Bonus credited", date: "Yesterday", time: "6:45 PM" },
    { id: "4", type: "credit", amount: 85, description: "Ride payment received", date: "Yesterday", time: "2:30 PM" },
  ];

  const driversNearby: Driver[] = [
    { id: "1", name: "Ethan Carter", avatar: "EC", rating: 5.0, distance: "2 km", duration: "5 min", earnings: 250, status: "online" },
    { id: "2", name: "Noah Smith", avatar: "NS", rating: 5.0, distance: "3 km", duration: "8 min", earnings: 320, status: "online" },
    { id: "3", name: "Logan Wilson", avatar: "LW", rating: 5.0, distance: "1.5 km", duration: "4 min", earnings: 180, status: "online" },
    { id: "4", name: "Mason Davis", avatar: "MD", rating: 5.0, distance: "4 km", duration: "10 min", earnings: 290, status: "online" },
    { id: "5", name: "Lucas Thompson", avatar: "LT", rating: 5.0, distance: "2.5 km", duration: "6 min", earnings: 210, status: "online" },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex flex-col overflow-hidden">
      {/* Premium Header */}
      <div className="bg-white shadow-lg p-4 flex items-center gap-3 flex-shrink-0 border-b-2 border-gray-100 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-xl hover:bg-yellow-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Wallet className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h1 className="font-black text-base bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Wallet & Earnings
          </h1>
          <p className="text-xs text-muted-foreground font-semibold">Manage your finances</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Premium Balance Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Balance */}
            <Card className="p-5 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5" />
                <p className="text-xs font-bold opacity-90">Total Balance</p>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <IndianRupee className="w-6 h-6" />
                <p className="text-3xl font-black">{(balance * 83).toFixed(0)}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 text-xs font-bold w-full shadow-lg"
              >
                Withdraw
              </Button>
            </Card>

            {/* Today's Earnings */}
            <Card className="p-5 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5" />
                <p className="text-xs font-bold opacity-90">Today Earning</p>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <IndianRupee className="w-6 h-6" />
                <p className="text-3xl font-black">{(todayEarnings * 83).toFixed(0)}</p>
              </div>
              <p className="text-xs opacity-90 font-semibold">↑ 12% from yesterday</p>
            </Card>
          </div>

          {/* Premium Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black text-sm">Send</p>
                  <p className="text-xs text-gray-600 font-semibold">Transfer money</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black text-sm">Add Money</p>
                  <p className="text-xs text-gray-600 font-semibold">Top up wallet</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Premium Today's Activity */}
          <Card className="p-5 border-2 border-gray-100 shadow-lg">
            <h3 className="font-black mb-4 flex items-center gap-2 text-gray-900">
              <Clock className="w-5 h-5 text-yellow-600" />
              Today's Activity
            </h3>
            <div className="flex items-center justify-between text-sm mb-4">
              <div>
                <p className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">8</p>
                <p className="text-xs text-gray-600 font-bold">Rides completed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-green-600">4.9</p>
                <div className="flex items-center gap-1 justify-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <p className="text-xs text-gray-600 font-bold">Rating</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-blue-600">32</p>
                <p className="text-xs text-gray-600 font-bold">Kilometers</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full h-11 font-bold border-2 hover:bg-yellow-50 hover:border-yellow-400" 
              size="sm"
            >
              View All Activity
            </Button>
          </Card>

          {/* Premium Drivers Nearby */}
          <Card className="p-5 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black flex items-center gap-2 text-gray-900">
                <MapPin className="w-5 h-5 text-yellow-600" />
                Drivers Nearby
              </h3>
              <Button variant="link" size="sm" className="text-yellow-600 font-bold">
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {driversNearby.slice(0, 5).map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-yellow-200"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg">
                    {driver.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-gray-900">{driver.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {driver.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {driver.duration}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-black text-sm">{driver.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-bold">
                      ₹{(driver.earnings * 83).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Premium Recent Transactions */}
          <Card className="p-5 border-2 border-gray-100 shadow-lg">
            <h3 className="font-black mb-4 flex items-center gap-2 text-gray-900">
              <Gift className="w-5 h-5 text-yellow-600" />
              Recent Transactions
            </h3>
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border-2 border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg ${
                      transaction.type === "credit"
                        ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                        : "bg-gradient-to-br from-red-500 to-pink-500 text-white"
                    }`}>
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-600 font-semibold">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <p className={`font-black text-base ${
                    transaction.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}₹{(transaction.amount * 83).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletScreen;
