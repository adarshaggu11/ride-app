import React, { useState } from 'react';
import { 
  Car,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  DollarSign,
  Users,
  Navigation,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Calendar,
  Award,
  Target,
  Zap,
  AlertCircle,
  Settings,
  BarChart3,
  Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

interface RideRequest {
  id: string;
  passenger: {
    name: string;
    rating: number;
    avatar: string;
  };
  pickup: string;
  dropoff: string;
  distance: string;
  estimatedTime: string;
  fare: number;
  requestTime: string;
}

export const DriverDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'requests' | 'earnings' | 'stats'>('home');
  
  // Driver stats
  const [stats] = useState({
    todayEarnings: 1250,
    todayRides: 8,
    rating: 4.8,
    totalRides: 342,
    acceptanceRate: 95,
    onlineHours: 6.5,
    weeklyEarnings: 8400,
    monthlyEarnings: 34500
  });

  // Pending ride requests
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([
    {
      id: '1',
      passenger: {
        name: 'Priya Sharma',
        rating: 4.9,
        avatar: 'PS'
      },
      pickup: 'Banjara Hills, Road No. 12',
      dropoff: 'HITEC City, Phase 2',
      distance: '12.5 km',
      estimatedTime: '18 min',
      fare: 185,
      requestTime: '2 min ago'
    },
    {
      id: '2',
      passenger: {
        name: 'Rajesh Kumar',
        rating: 4.7,
        avatar: 'RK'
      },
      pickup: 'Gachibowli Metro Station',
      dropoff: 'Airport',
      distance: '24 km',
      estimatedTime: '35 min',
      fare: 450,
      requestTime: '1 min ago'
    }
  ]);

  // Recent completed rides
  const [recentRides] = useState([
    { id: 1, passenger: 'Sneha Reddy', fare: 120, rating: 5, time: '10:30 AM' },
    { id: 2, passenger: 'Amit Patel', fare: 85, rating: 5, time: '09:45 AM' },
    { id: 3, passenger: 'Meera Joshi', fare: 200, rating: 4, time: '08:20 AM' }
  ]);

  // Weekly earnings data
  const weeklyData = [
    { day: 'Mon', earnings: 1200 },
    { day: 'Tue', earnings: 1100 },
    { day: 'Wed', earnings: 1350 },
    { day: 'Thu', earnings: 1150 },
    { day: 'Fri', earnings: 1400 },
    { day: 'Sat', earnings: 1650 },
    { day: 'Sun', earnings: 550 }
  ];

  const maxEarnings = Math.max(...weeklyData.map(d => d.earnings));

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    toast({
      title: !isOnline ? "🟢 You're Online!" : "🔴 You're Offline",
      description: !isOnline ? "You'll start receiving ride requests" : "You won't receive new requests",
    });
  };

  const handleAcceptRide = (rideId: string) => {
    const ride = rideRequests.find(r => r.id === rideId);
    setRideRequests(rideRequests.filter(r => r.id !== rideId));
    
    toast({
      title: "✅ Ride Accepted!",
      description: `Navigating to pickup location: ${ride?.pickup}`,
    });
  };

  const handleRejectRide = (rideId: string) => {
    setRideRequests(rideRequests.filter(r => r.id !== rideId));
    
    toast({
      title: "Ride Rejected",
      description: "Looking for next ride request...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>
            <p className="text-indigo-100 text-sm">Manage your rides & earnings</p>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Online/Offline Toggle */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-green-500' : 'bg-slate-400'
              }`}>
                {isOnline ? <Zap className="w-6 h-6 text-white" /> : <AlertCircle className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="font-bold text-lg">{isOnline ? "You're Online" : "You're Offline"}</h3>
                <p className="text-sm text-indigo-100">
                  {isOnline ? 'Receiving ride requests' : 'Go online to accept rides'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isOnline}
                onChange={handleToggleOnline}
                className="sr-only peer" 
              />
              <div className="w-16 h-9 bg-slate-400 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">₹{stats.todayEarnings}</p>
            <p className="text-xs text-indigo-100">Today</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Car className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.todayRides}</p>
            <p className="text-xs text-indigo-100">Rides</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.onlineHours}h</p>
            <p className="text-xs text-indigo-100">Online</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4">
          {[
            { id: 'home', label: 'Home', icon: Map },
            { id: 'requests', label: 'Requests', icon: Users, badge: rideRequests.length },
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
            { id: 'stats', label: 'Stats', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-xl font-semibold text-sm transition-all relative ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-1" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 pb-24">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* Performance Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-indigo-600" />
                Your Performance
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <Star className="w-8 h-8 text-green-600 mb-2 fill-green-600" />
                  <p className="text-3xl font-bold text-green-600">{stats.rating}</p>
                  <p className="text-sm text-green-700">Driver Rating</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-3xl font-bold text-blue-600">{stats.acceptanceRate}%</p>
                  <p className="text-sm text-blue-700">Acceptance Rate</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <Car className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-3xl font-bold text-purple-600">{stats.totalRides}</p>
                  <p className="text-sm text-purple-700">Total Rides</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                  <Target className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-3xl font-bold text-orange-600">₹{stats.weeklyEarnings}</p>
                  <p className="text-sm text-orange-700">This Week</p>
                </div>
              </div>
            </div>

            {/* Recent Rides */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" />
                Recent Rides
              </h2>
              
              <div className="space-y-3">
                {recentRides.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {ride.passenger[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{ride.passenger}</p>
                        <p className="text-sm text-slate-600">{ride.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₹{ride.fare}</p>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-yellow-500" />
                        <span className="text-xs font-semibold">{ride.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left">
                <Map className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="font-bold mb-1">Demand Map</h3>
                <p className="text-sm text-slate-600">See hotspots</p>
              </button>
              
              <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left">
                <Calendar className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-bold mb-1">Schedule</h3>
                <p className="text-sm text-slate-600">Plan your day</p>
              </button>
            </div>
          </div>
        )}

        {/* Ride Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4 animate-fade-in">
            {!isOnline && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">You're Offline</h3>
                <p className="text-slate-600 mb-4">Go online to start receiving ride requests</p>
                <button
                  onClick={handleToggleOnline}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Go Online Now
                </button>
              </div>
            )}

            {isOnline && rideRequests.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center">
                <Users className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">No Ride Requests</h3>
                <p className="text-slate-600">You'll be notified when passengers request rides nearby</p>
              </div>
            )}

            {isOnline && rideRequests.map((request, index) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Request Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {request.passenger.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{request.passenger.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{request.passenger.rating}</span>
                        <span className="text-xs text-slate-400 ml-1">• {request.requestTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">₹{request.fare}</p>
                    <p className="text-xs text-slate-600">{request.distance}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="space-y-3 mb-4 bg-slate-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600">Pickup</p>
                      <p className="font-semibold">{request.pickup}</p>
                    </div>
                  </div>
                  <div className="border-l-2 border-dashed border-slate-300 ml-1.5 h-6 flex items-center pl-8">
                    <span className="text-xs text-slate-500">~{request.estimatedTime}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600">Drop-off</p>
                      <p className="font-semibold">{request.dropoff}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAcceptRide(request.id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept Ride
                  </button>
                  <button
                    onClick={() => handleRejectRide(request.id)}
                    className="px-6 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-600 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6 animate-fade-in">
            {/* Earnings Summary */}
            <div className="bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-6">Total Earnings</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-green-100 text-sm mb-1">Today</p>
                  <p className="text-3xl font-bold">₹{stats.todayEarnings}</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm mb-1">This Week</p>
                  <p className="text-3xl font-bold">₹{stats.weeklyEarnings}</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm mb-1">This Month</p>
                  <p className="text-3xl font-bold">₹{stats.monthlyEarnings}</p>
                </div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                This Week's Earnings
              </h2>
              
              <div className="space-y-3">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-600 w-12">{day.day}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full flex items-center justify-end px-3"
                        style={{ width: `${(day.earnings / maxEarnings) * 100}%` }}
                      >
                        <span className="text-white font-bold text-sm">₹{day.earnings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Next Payout</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Available Balance</p>
                    <p className="text-3xl font-bold text-indigo-600">₹{stats.weeklyEarnings}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-indigo-600" />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">Next payout on <span className="font-semibold">Friday, Nov 1</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Performance Metrics
              </h2>
              
              <div className="space-y-4">
                {[
                  { label: 'Average Rating', value: `${stats.rating}/5.0`, color: 'bg-yellow-500', percentage: (stats.rating / 5) * 100 },
                  { label: 'Acceptance Rate', value: `${stats.acceptanceRate}%`, color: 'bg-green-500', percentage: stats.acceptanceRate },
                  { label: 'Completion Rate', value: '98%', color: 'bg-blue-500', percentage: 98 },
                  { label: 'Cancellation Rate', value: '2%', color: 'bg-red-500', percentage: 2 }
                ].map((metric, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">{metric.label}</span>
                      <span className="text-sm font-bold">{metric.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${metric.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Weekly Goals
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Complete 50 rides</span>
                    <span className="text-sm font-bold text-purple-600">36/50</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Bonus: ₹500</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Earn ₹10,000</span>
                    <span className="text-sm font-bold text-green-600">₹8,400/₹10,000</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                    <div className="bg-green-600 h-full rounded-full" style={{ width: '84%' }}></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Bonus: ₹300</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
