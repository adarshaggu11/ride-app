import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Car,
  Bike,
  Home,
  Briefcase,
  Repeat,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

interface ScheduledRide {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  vehicleType: 'bike' | 'auto' | 'car';
  isRecurring: boolean;
  recurringDays?: string[];
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export const ScheduledRidesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // New booking form state
  const [newRide, setNewRide] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    vehicleType: 'auto' as 'bike' | 'auto' | 'car',
    isRecurring: false,
    recurringDays: [] as string[]
  });

  // Mock scheduled rides
  const [rides, setRides] = useState<ScheduledRide[]>([
    {
      id: '1',
      pickup: 'Banjara Hills, Hyderabad',
      destination: 'HITEC City Office',
      date: '2025-10-29',
      time: '09:00 AM',
      vehicleType: 'auto',
      isRecurring: true,
      recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      price: 85,
      status: 'upcoming'
    },
    {
      id: '2',
      pickup: 'Home',
      destination: 'Inorbit Mall',
      date: '2025-10-30',
      time: '06:00 PM',
      vehicleType: 'car',
      isRecurring: false,
      price: 120,
      status: 'upcoming'
    },
    {
      id: '3',
      pickup: 'Jubilee Hills',
      destination: 'Airport',
      date: '2025-10-25',
      time: '05:00 AM',
      vehicleType: 'car',
      isRecurring: false,
      price: 450,
      status: 'completed'
    }
  ]);

  const vehicleIcons = {
    bike: Bike,
    auto: Car,
    car: Car
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBookRide = () => {
    if (!newRide.pickup || !newRide.destination || !newRide.date || !newRide.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const ride: ScheduledRide = {
      id: Date.now().toString(),
      ...newRide,
      price: newRide.vehicleType === 'bike' ? 49 : newRide.vehicleType === 'auto' ? 85 : 120,
      status: 'upcoming'
    };

    setRides([ride, ...rides]);
    setShowBookingForm(false);
    setNewRide({
      pickup: '',
      destination: '',
      date: '',
      time: '',
      vehicleType: 'auto',
      isRecurring: false,
      recurringDays: []
    });

    toast({
      title: "Ride Scheduled",
      description: `Your ride is booked for ${formatDate(newRide.date)} at ${newRide.time}`,
    });
  };

  const handleCancelRide = (id: string) => {
    setRides(rides.map(ride => 
      ride.id === id ? { ...ride, status: 'cancelled' as const } : ride
    ));
    
    toast({
      title: "Ride Cancelled",
      description: "Your scheduled ride has been cancelled. Full refund will be processed.",
    });
  };

  const handleDeleteRide = (id: string) => {
    setRides(rides.filter(ride => ride.id !== id));
    toast({
      title: "Ride Deleted",
      description: "Scheduled ride has been removed",
    });
  };

  const toggleRecurringDay = (day: string) => {
    if (newRide.recurringDays.includes(day)) {
      setNewRide({
        ...newRide,
        recurringDays: newRide.recurringDays.filter(d => d !== day)
      });
    } else {
      setNewRide({
        ...newRide,
        recurringDays: [...newRide.recurringDays, day]
      });
    }
  };

  const upcomingRides = rides.filter(r => r.status === 'upcoming');
  const pastRides = rides.filter(r => r.status === 'completed' || r.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">Scheduled Rides</h1>
            <p className="text-purple-100 text-sm">Book rides in advance</p>
          </div>
          <button
            onClick={() => setShowBookingForm(true)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {[
            { id: 'upcoming', label: 'Upcoming', count: upcomingRides.length },
            { id: 'past', label: 'Past Rides', count: pastRides.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-purple-100' : 'bg-white/20'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 pb-24">
        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
              {/* Form Header */}
              <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Schedule New Ride</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    value={newRide.pickup}
                    onChange={(e) => setNewRide({ ...newRide, pickup: e.target.value })}
                    placeholder="Enter pickup address"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  {/* Quick Locations */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setNewRide({ ...newRide, pickup: 'Home' })}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center gap-1"
                    >
                      <Home className="w-3 h-3" />
                      Home
                    </button>
                    <button
                      onClick={() => setNewRide({ ...newRide, pickup: 'Office' })}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center gap-1"
                    >
                      <Briefcase className="w-3 h-3" />
                      Office
                    </button>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={newRide.destination}
                    onChange={(e) => setNewRide({ ...newRide, destination: e.target.value })}
                    placeholder="Enter destination"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newRide.date}
                      onChange={(e) => setNewRide({ ...newRide, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time *
                    </label>
                    <input
                      type="time"
                      value={newRide.time}
                      onChange={(e) => setNewRide({ ...newRide, time: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Vehicle Type *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'bike', name: 'Bike', price: 49 },
                      { type: 'auto', name: 'Auto', price: 85 },
                      { type: 'car', name: 'Car', price: 120 }
                    ].map((vehicle) => (
                      <button
                        key={vehicle.type}
                        onClick={() => setNewRide({ ...newRide, vehicleType: vehicle.type as any })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          newRide.vehicleType === vehicle.type
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <Car className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-semibold text-sm">{vehicle.name}</p>
                        <p className="text-xs text-slate-600">₹{vehicle.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recurring Ride Toggle */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">Recurring Ride</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newRide.isRecurring}
                        onChange={(e) => setNewRide({ ...newRide, isRecurring: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-8 bg-slate-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {newRide.isRecurring && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Select days:</p>
                      <div className="flex flex-wrap gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleRecurringDay(day)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                              newRide.recurringDays.includes(day)
                                ? 'bg-purple-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleBookRide}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                >
                  <Check className="w-5 h-5 inline mr-2" />
                  Schedule Ride
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rides List */}
        <div className="space-y-4">
          {activeTab === 'upcoming' && (
            <>
              {upcomingRides.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center">
                  <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-2">No Scheduled Rides</h3>
                  <p className="text-slate-600 mb-6">Book your first scheduled ride and plan ahead!</p>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Schedule a Ride
                  </button>
                </div>
              ) : (
                upcomingRides.map((ride, index) => {
                  const VehicleIcon = vehicleIcons[ride.vehicleType];
                  return (
                    <div
                      key={ride.id}
                      className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Ride Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <VehicleIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg capitalize">{ride.vehicleType}</h3>
                            <p className="text-sm text-slate-600">{formatDate(ride.date)} • {ride.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">₹{ride.price}</p>
                          {ride.isRecurring && (
                            <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full mt-1">
                              <Repeat className="w-3 h-3" />
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Route */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-600">Pickup</p>
                            <p className="font-semibold">{ride.pickup}</p>
                          </div>
                        </div>
                        <div className="border-l-2 border-dashed border-slate-300 ml-1.5 h-4"></div>
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-600">Destination</p>
                            <p className="font-semibold">{ride.destination}</p>
                          </div>
                        </div>
                      </div>

                      {/* Recurring Days */}
                      {ride.isRecurring && ride.recurringDays && (
                        <div className="bg-purple-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-slate-700 mb-2">Repeats on:</p>
                          <div className="flex flex-wrap gap-2">
                            {ride.recurringDays.map((day) => (
                              <span key={day} className="px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-xs font-semibold">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancelRide(ride.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'past' && (
            <>
              {pastRides.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center">
                  <Clock className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-2">No Past Rides</h3>
                  <p className="text-slate-600">Your completed rides will appear here</p>
                </div>
              ) : (
                pastRides.map((ride, index) => {
                  const VehicleIcon = vehicleIcons[ride.vehicleType];
                  return (
                    <div
                      key={ride.id}
                      className="bg-white rounded-2xl p-5 shadow-md opacity-75"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                            <VehicleIcon className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-bold capitalize">{ride.vehicleType}</h3>
                            <p className="text-sm text-slate-600">{formatDate(ride.date)} • {ride.time}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ride.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-slate-600">{ride.pickup} → {ride.destination}</p>
                        <button
                          onClick={() => handleDeleteRide(ride.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {!showBookingForm && (
        <button
          onClick={() => setShowBookingForm(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all flex items-center justify-center z-40"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};
