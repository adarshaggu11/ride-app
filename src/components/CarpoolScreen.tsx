import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  ChevronLeft,
  Filter,
  UserCheck,
  Shield,
  Leaf,
  TrendingDown,
  Calendar,
  MessageCircle,
  Phone,
  Navigation,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

interface CarpoolRide {
  id: string;
  driver: {
    name: string;
    rating: number;
    totalRides: number;
    avatar: string;
    verified: boolean;
  };
  route: {
    from: string;
    to: string;
    distance: string;
  };
  timing: {
    departureTime: string;
    date: string;
    flexWindow: string;
  };
  pricing: {
    totalFare: number;
    perPerson: number;
    savings: number;
  };
  capacity: {
    total: number;
    available: number;
  };
  preferences: {
    femaleOnly: boolean;
    verified: boolean;
    noSmoking: boolean;
  };
  co2Saved: number;
}

export const CarpoolScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'find' | 'my-rides' | 'offer'>('find');
  const [filters, setFilters] = useState({
    femaleOnly: false,
    verifiedOnly: false,
    maxPrice: 200,
    timeWindow: 'any'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock carpool rides
  const [availableRides, setAvailableRides] = useState<CarpoolRide[]>([
    {
      id: '1',
      driver: {
        name: 'Priya Sharma',
        rating: 4.9,
        totalRides: 234,
        avatar: 'PS',
        verified: true
      },
      route: {
        from: 'Banjara Hills',
        to: 'HITEC City',
        distance: '12.5 km'
      },
      timing: {
        departureTime: '09:00 AM',
        date: 'Tomorrow',
        flexWindow: '±15 min'
      },
      pricing: {
        totalFare: 120,
        perPerson: 40,
        savings: 45
      },
      capacity: {
        total: 3,
        available: 2
      },
      preferences: {
        femaleOnly: true,
        verified: true,
        noSmoking: true
      },
      co2Saved: 2.3
    },
    {
      id: '2',
      driver: {
        name: 'Rajesh Kumar',
        rating: 4.7,
        totalRides: 156,
        avatar: 'RK',
        verified: true
      },
      route: {
        from: 'Gachibowli',
        to: 'Secunderabad',
        distance: '18 km'
      },
      timing: {
        departureTime: '08:30 AM',
        date: 'Today',
        flexWindow: '±10 min'
      },
      pricing: {
        totalFare: 180,
        perPerson: 60,
        savings: 60
      },
      capacity: {
        total: 3,
        available: 1
      },
      preferences: {
        femaleOnly: false,
        verified: true,
        noSmoking: true
      },
      co2Saved: 3.1
    },
    {
      id: '3',
      driver: {
        name: 'Sneha Reddy',
        rating: 4.8,
        totalRides: 189,
        avatar: 'SR',
        verified: true
      },
      route: {
        from: 'Jubilee Hills',
        to: 'Financial District',
        distance: '15 km'
      },
      timing: {
        departureTime: '07:45 AM',
        date: 'Today',
        flexWindow: '±20 min'
      },
      pricing: {
        totalFare: 150,
        perPerson: 50,
        savings: 50
      },
      capacity: {
        total: 3,
        available: 2
      },
      preferences: {
        femaleOnly: true,
        verified: true,
        noSmoking: true
      },
      co2Saved: 2.7
    }
  ]);

  const handleJoinRide = (rideId: string) => {
    const ride = availableRides.find(r => r.id === rideId);
    if (ride) {
      toast({
        title: "Request Sent",
        description: `Your carpool request has been sent to ${ride.driver.name}. You'll be notified once confirmed.`,
      });
    }
  };

  const handleOfferRide = () => {
    toast({
      title: "Coming Soon!",
      description: "Ride offering feature will be available in the next update",
    });
  };

  const totalSavings = availableRides.reduce((sum, ride) => sum + ride.pricing.savings, 0);
  const totalCO2Saved = availableRides.reduce((sum, ride) => sum + ride.co2Saved, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">Ride Sharing</h1>
            <p className="text-green-100 text-sm">Save money, reduce emissions</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">₹{totalSavings}</p>
            <p className="text-xs text-green-100">Avg Savings</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Leaf className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">{totalCO2Saved.toFixed(1)} kg</p>
            <p className="text-xs text-green-100">CO₂ Saved</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {[
            { id: 'find', label: 'Find Rides', icon: Users },
            { id: 'my-rides', label: 'My Rides', icon: Calendar },
            { id: 'offer', label: 'Offer Ride', icon: UserCheck }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-green-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 shadow-lg border-b animate-slide-up">
          <h3 className="font-bold mb-3">Filters</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Female Only</span>
              <input 
                type="checkbox" 
                checked={filters.femaleOnly}
                onChange={(e) => setFilters({ ...filters, femaleOnly: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Verified Drivers Only</span>
              <input 
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
            </label>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Price: ₹{filters.maxPrice}</label>
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="10"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>
          </div>
        </div>
      )}

      <div className="p-6 pb-24">
        {/* Find Rides Tab */}
        {activeTab === 'find' && (
          <div className="space-y-4 animate-fade-in">
            {availableRides.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center">
                <Users className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">No Rides Available</h3>
                <p className="text-slate-600">Check back later or offer your own ride!</p>
              </div>
            ) : (
              availableRides.map((ride, index) => (
                <div
                  key={ride.id}
                  className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Driver Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg relative">
                        {ride.driver.avatar}
                        {ride.driver.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{ride.driver.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{ride.driver.rating}</span>
                          </div>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">{ride.driver.totalRides} rides</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col gap-1">
                      {ride.preferences.femaleOnly && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-semibold">
                          👩 Female Only
                        </span>
                      )}
                      {ride.preferences.noSmoking && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                          No Smoking
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Route */}
                  <div className="space-y-3 mb-4 bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600">Pickup</p>
                        <p className="font-semibold">{ride.route.from}</p>
                      </div>
                    </div>
                    <div className="border-l-2 border-dashed border-slate-300 ml-1.5 h-6 flex items-center pl-8">
                      <span className="text-xs text-slate-500">{ride.route.distance}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600">Drop-off</p>
                        <p className="font-semibold">{ride.route.to}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timing & Pricing Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Timing */}
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-600">Departure</span>
                      </div>
                      <p className="font-bold text-lg">{ride.timing.departureTime}</p>
                      <p className="text-xs text-slate-600">{ride.timing.date} {ride.timing.flexWindow}</p>
                    </div>

                    {/* Pricing */}
                    <div className="bg-green-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-600">Per Person</span>
                      </div>
                      <p className="font-bold text-lg text-green-600">₹{ride.pricing.perPerson}</p>
                      <p className="text-xs text-green-700">
                        <TrendingDown className="w-3 h-3 inline" /> Save ₹{ride.pricing.savings}
                      </p>
                    </div>
                  </div>

                  {/* Capacity & Environmental Impact */}
                  <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-yellow-50 to-teal-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-semibold">
                        {ride.capacity.available} of {ride.capacity.total} seats available
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-700">
                      <Leaf className="w-4 h-4" />
                      <span className="text-xs font-semibold">{ride.co2Saved} kg CO₂ saved</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleJoinRide(ride.id)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      Join Ride - ₹{ride.pricing.perPerson}
                    </button>
                    <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                      <MessageCircle className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                      <Navigation className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Benefits Banner */}
            <div className="bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-2xl p-6 mt-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6" />
                Why Carpool?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold mb-1">50%</p>
                  <p className="text-sm text-green-100">Average Savings</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">60%</p>
                  <p className="text-sm text-green-100">CO₂ Reduction</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">2.5x</p>
                  <p className="text-sm text-green-100">More Social</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">100%</p>
                  <p className="text-sm text-green-100">Verified Drivers</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Rides Tab */}
        {activeTab === 'my-rides' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-12 text-center">
              <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">No Active Carpools</h3>
              <p className="text-slate-600 mb-6">Find and join rides to see them here</p>
              <button
                onClick={() => setActiveTab('find')}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Browse Available Rides
              </button>
            </div>
          </div>
        )}

        {/* Offer Ride Tab */}
        {activeTab === 'offer' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Offer a Ride</h3>
                <p className="text-slate-600">Share your journey and earn money while helping the environment</p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: DollarSign, title: 'Earn Money', desc: 'Cover your fuel costs and earn extra' },
                  { icon: Leaf, title: 'Go Green', desc: 'Reduce carbon emissions together' },
                  { icon: Shield, title: 'Safe & Secure', desc: 'All riders are verified' },
                  { icon: Users, title: 'Make Friends', desc: 'Meet interesting people on your route' }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold">{benefit.title}</h4>
                      <p className="text-sm text-slate-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleOfferRide}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
              >
                Start Offering Rides
              </button>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Requirements to Offer Rides</h3>
              <div className="space-y-3">
                {[
                  'Valid driving license',
                  'Vehicle registration documents',
                  'Insurance papers',
                  'Minimum 4.5 star rating',
                  'Complete verification process'
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
