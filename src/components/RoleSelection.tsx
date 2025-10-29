import { useState } from 'react';
import { User, Car } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dropout</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Choose Your Role
          </h2>
          <p className="text-gray-600">
            Select how you want to use Dropout
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 mb-8">
          {/* Customer Card */}
          <button
            onClick={() => setSelected('customer')}
            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
              selected === 'customer'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selected === 'customer'
                    ? 'bg-yellow-500'
                    : 'bg-gray-100'
                }`}
              >
                <User
                  className={`w-7 h-7 ${
                    selected === 'customer' ? 'text-white' : 'text-gray-600'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  I'm a Customer
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Book rides, track drivers in real-time, and reach your destination safely
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  selected === 'customer'
                    ? 'border-yellow-500 bg-yellow-500'
                    : 'border-gray-300'
                }`}
              >
                {selected === 'customer' && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
            </div>
          </button>

          {/* Driver Card */}
          <button
            onClick={() => setSelected('driver')}
            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
              selected === 'driver'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selected === 'driver' ? 'bg-yellow-500' : 'bg-gray-100'
                }`}
              >
                <Car
                  className={`w-7 h-7 ${
                    selected === 'driver' ? 'text-white' : 'text-gray-600'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  I'm a Driver
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Accept ride requests, earn money, and manage your earnings with ease
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  selected === 'driver'
                    ? 'border-yellow-500 bg-yellow-500'
                    : 'border-gray-300'
                }`}
              >
                {selected === 'driver' && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mb-6">
          You can switch between roles anytime from your profile settings
        </p>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full py-4 rounded-lg font-semibold transition-all ${
            selected
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
