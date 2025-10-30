import { useState } from 'react';
import { User, Car, Zap, TrendingUp, DollarSign, Shield, ArrowRight } from 'lucide-react';
import { safeSetItem } from '../utils/safeStorage';

interface RoleSelectionProps {
  onRoleSelect: (role: 'customer' | 'driver') => void;
}

export const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const [selected, setSelected] = useState<'customer' | 'driver' | null>(null);

  const handleContinue = () => {
    if (selected) {
      safeSetItem('user_role', selected);
      onRoleSelect(selected);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-black flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-yellow-400 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-15 bg-orange-500 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>

      {/* Premium Logo Header */}
      <div className="px-6 pt-8 pb-4 relative z-10 animate-slide-down">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-xl flex items-center justify-center relative">
            <Zap 
              className="w-7 h-7" 
              style={{
                fill: 'url(#roleZapGradient)',
                strokeWidth: 0,
              }}
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="roleZapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-yellow-400/30 animate-spin-slow"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Dropout</h1>
            <p className="text-white/80 text-xs font-semibold">Choose Your Role</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col justify-center relative z-10">
        <div className="mb-10 text-center animate-fade-in">
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            Choose Your Role
          </h2>
          <p className="text-white/90 text-lg font-semibold">
            Select how you want to use Dropout
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-5 mb-8 animate-scale-in">
          {/* Customer Card */}
          <button
            onClick={() => setSelected('customer')}
            className={`w-full p-6 rounded-2xl border-2 transition-all text-left shadow-xl hover:scale-105 transform duration-300 ${
              selected === 'customer'
                ? 'border-yellow-400 bg-white shadow-2xl'
                : 'border-white/30 bg-white/90 backdrop-blur-sm hover:border-white/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 ${
                  selected === 'customer'
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 scale-110'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}
              >
                <User
                  className={`w-8 h-8 ${
                    selected === 'customer' ? 'text-white' : 'text-gray-600'
                  }`}
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  I'm a Customer
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-medium mb-3">
                  Book rides, track drivers in real-time, and reach your destination safely
                </p>
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Zap, text: 'Quick Booking' },
                    { icon: Shield, text: 'Safe Rides' },
                    { icon: TrendingUp, text: 'Live Tracking' }
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
                      <Icon className="w-3 h-3 text-yellow-600" />
                      <span className="text-[10px] font-semibold text-yellow-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 ${
                  selected === 'customer'
                    ? 'border-yellow-500 bg-yellow-500 shadow-lg'
                    : 'border-gray-300'
                }`}
              >
                {selected === 'customer' && (
                  <div className="w-3.5 h-3.5 bg-white rounded-full" />
                )}
              </div>
            </div>
          </button>

          {/* Driver Card */}
          <button
            onClick={() => setSelected('driver')}
            className={`w-full p-6 rounded-2xl border-2 transition-all text-left shadow-xl hover:scale-105 transform duration-300 ${
              selected === 'driver'
                ? 'border-yellow-400 bg-white shadow-2xl'
                : 'border-white/30 bg-white/90 backdrop-blur-sm hover:border-white/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 ${
                  selected === 'driver' 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 scale-110' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}
              >
                <Car
                  className={`w-8 h-8 ${
                    selected === 'driver' ? 'text-white' : 'text-gray-600'
                  }`}
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  I'm a Driver
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-medium mb-3">
                  Accept ride requests, earn money, and manage your earnings with ease
                </p>
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: DollarSign, text: 'Earn More' },
                    { icon: TrendingUp, text: 'Growth' },
                    { icon: Shield, text: 'Verified' }
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
                      <Icon className="w-3 h-3 text-yellow-600" />
                      <span className="text-[10px] font-semibold text-yellow-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 ${
                  selected === 'driver'
                    ? 'border-yellow-500 bg-yellow-500 shadow-lg'
                    : 'border-gray-300'
                }`}
              >
                {selected === 'driver' && (
                  <div className="w-3.5 h-3.5 bg-white rounded-full" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-white/80 mb-6 font-medium">
          💡 You can switch between roles anytime from settings
        </p>
      </div>

      {/* Premium Continue Button */}
      <div className="px-6 pb-8 relative z-10">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl ${
            selected
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-3xl transform hover:scale-105'
              : 'bg-white/30 backdrop-blur-sm text-white/50 cursor-not-allowed'
          }`}
        >
          {selected ? (
            <span className="flex items-center justify-center gap-2">
              Continue as {selected === 'customer' ? 'Customer' : 'Driver'}
              <ArrowRight className="w-5 h-5" />
            </span>
          ) : (
            'Select a role to continue'
          )}
        </button>
      </div>
    </div>
  );
};
