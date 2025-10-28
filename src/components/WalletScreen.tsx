import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Wallet, TrendingUp, DollarSign, Gift, Star, Clock, MapPin, Plus } from "lucide-react";

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
    <div className="h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="glass shadow-lg p-4 flex items-center gap-3 flex-shrink-0 border-b z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-bold text-lg">Wallet & Earnings</h1>
          <p className="text-xs text-muted-foreground">Manage your finances</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary font-semibold"
        >
          History
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Balance */}
            <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4" />
                <p className="text-xs font-medium opacity-90">Total Balance</p>
              </div>
              <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 text-white hover:bg-white/20 h-7 text-xs"
              >
                Withdraw
              </Button>
            </Card>

            {/* Today's Earnings */}
            <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                <p className="text-xs font-medium opacity-90">Today Earning</p>
              </div>
              <p className="text-2xl font-bold">${todayEarnings.toFixed(2)}</p>
              <p className="text-xs opacity-75 mt-1">↑ 12% from yesterday</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Send</p>
                  <p className="text-xs text-muted-foreground">Transfer money</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Add Complete</p>
                  <p className="text-xs text-muted-foreground">Top up wallet</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Today's Activity */}
          <Card className="p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Today's Activity
            </h3>
            <div className="flex items-center justify-between text-sm mb-4">
              <div>
                <p className="text-2xl font-bold text-primary">8</p>
                <p className="text-xs text-muted-foreground">Rides completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">4.9</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">32km</p>
                <p className="text-xs text-muted-foreground">Distance</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              View All
            </Button>
          </Card>

          {/* Drivers Nearby (Like the image) */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Drivers Nearby
              </h3>
              <Button variant="link" size="sm" className="text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {driversNearby.slice(0, 5).map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {driver.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{driver.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

                  {/* Rating & Status */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-sm">{driver.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ${driver.earnings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              Recent Transactions
            </h3>
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "credit"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {transaction.type === "credit" ? "+" : "-"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${
                    transaction.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
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
