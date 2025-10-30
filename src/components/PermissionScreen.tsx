import { useState } from 'react';
import { MapPin, Bell, Camera, Phone, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { requestLocationPermission } from '../services/locationService';
import { requestCameraPermission } from '../services/cameraService';
import { requestLocalNotificationPermission } from '../services/localNotificationService';
import { safeGetJSON, safeSetJSON, safeSetItem, safeRemoveItem } from '../utils/safeStorage';

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: typeof MapPin;
  required: boolean;
  granted: boolean;
}

interface PermissionScreenProps {
  onComplete: () => void;
}

export const PermissionScreen = ({ onComplete }: PermissionScreenProps) => {
  // Load saved permission state from localStorage
  const loadSavedPermissions = (): Permission[] => {
    return safeGetJSON<Permission[]>('permission_state', [
      {
        id: 'location',
        title: 'Location Access',
        description: 'Required to show nearby drivers and navigate to your destination',
        icon: MapPin,
        required: true,
        granted: false,
      },
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Get updates about your rides and driver arrivals',
        icon: Bell,
        required: true,
        granted: false,
      },
      {
        id: 'camera',
        title: 'Camera Access',
        description: 'Upload profile photo and documents',
        icon: Camera,
        required: false,
        granted: false,
      },
      {
        id: 'phone',
        title: 'Phone Access',
        description: 'Call driver or support directly from the app',
        icon: Phone,
        required: false,
        granted: false,
      },
    ]);
  };

  const [permissions, setPermissions] = useState<Permission[]>(loadSavedPermissions());

  // Load saved current step
  const loadCurrentStep = (): number => {
    const saved = safeGetJSON<number>('permission_step', 0);
    return saved || 0;
  };

  const [currentStep, setCurrentStep] = useState(loadCurrentStep());

  const handleGrantPermission = async (permissionId: string) => {
    try {
      let granted = false;

      if (permissionId === 'location') {
        // Use Capacitor Geolocation plugin for proper permission handling
        granted = await requestLocationPermission();
      } else if (permissionId === 'notifications') {
        // Use Capacitor LocalNotifications for Android 13+ permission handling
        granted = await requestLocalNotificationPermission();
      } else if (permissionId === 'camera') {
        // Use Capacitor Camera plugin for proper permission handling
        granted = await requestCameraPermission();
      } else if (permissionId === 'phone') {
        // Phone permission doesn't need explicit request - handled by tel: links
        granted = true;
      }

      // Update permissions state
      const updatedPermissions = permissions.map(p =>
        p.id === permissionId ? { ...p, granted } : p
      );
      
      setPermissions(updatedPermissions);
      
      // CRITICAL: Save to localStorage immediately (before Android restarts app)
      safeSetJSON('permission_state', updatedPermissions);

      // Move to next permission
      if (currentStep < permissions.length - 1) {
        const nextStep = currentStep + 1;
        safeSetJSON('permission_step', nextStep);
        setTimeout(() => setCurrentStep(nextStep), 300);
      } else {
        // All permissions done
        safeSetJSON('permission_step', 0);
      }
    } catch (error) {
      console.error('Permission error:', error);
      // Mark as not granted on error
      const updatedPermissions = permissions.map(p =>
        p.id === permissionId ? { ...p, granted: false } : p
      );
      setPermissions(updatedPermissions);
      safeSetJSON('permission_state', updatedPermissions);
    }
  };

  const handleSkip = () => {
    if (currentStep < permissions.length - 1) {
      const nextStep = currentStep + 1;
      safeSetJSON('permission_step', nextStep);
      setCurrentStep(nextStep);
    } else {
      handleContinue();
    }
  };

  const handleContinue = () => {
    const requiredGranted = permissions
      .filter(p => p.required)
      .every(p => p.granted);

    if (requiredGranted) {
      // Clear permission state (no longer needed)
      safeRemoveItem('permission_state');
      safeRemoveItem('permission_step');
      safeSetItem('permissions_requested', 'true');
      onComplete();
    } else {
      alert('Please grant required permissions to continue');
    }
  };

  const currentPermission = permissions[currentStep];
  const Icon = currentPermission.icon;
  const requiredGranted = permissions
    .filter(p => p.required)
    .every(p => p.granted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-black flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-yellow-400 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-15 bg-orange-500 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>

      {/* Premium Header */}
      <div className="px-6 pt-8 pb-6 relative z-10 animate-slide-down">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-xl flex items-center justify-center relative">
              <Zap 
                className="w-6 h-6" 
                style={{
                  fill: 'url(#permZapGradient)',
                  strokeWidth: 0,
                }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="permZapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Dropout</h1>
              <p className="text-white/80 text-xs font-semibold">Permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-sm font-bold text-white">
              {currentStep + 1}/{permissions.length}
            </span>
          </div>
        </div>

        {/* Premium Progress Bar */}
        <div className="relative w-full h-2 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${((currentStep + 1) / permissions.length) * 100}%`,
              background: 'linear-gradient(90deg, #FCD34D, #EA580C)',
              boxShadow: '0 0 20px rgba(252, 211, 77, 0.6)'
            }}
          >
            {/* Shimmer Effect */}
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s linear infinite'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Premium Content */}
      <div className="flex-1 px-6 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          {/* Animated Icon Container */}
          <div className="relative mx-auto mb-8 w-32 h-32 animate-scale-in">
            {/* Rotating Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/30 animate-spin-slow"></div>
            <div className="absolute inset-3 rounded-full border-2 border-dotted border-white/20 animate-spin-reverse"></div>
            
            {/* Icon Background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/95 to-gray-100/95 backdrop-blur-sm shadow-2xl flex items-center justify-center">
              <Icon className="w-14 h-14 text-yellow-600" strokeWidth={2} />
            </div>

            {/* Pulse Effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black text-white text-center mb-4 tracking-tight animate-slide-up" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)', animationDelay: '0.1s' }}>
            {currentPermission.title}
          </h2>

          {/* Required Badge */}
          {currentPermission.required && (
            <div className="flex justify-center mb-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-xs font-black text-white">Required Permission</span>
              </div>
            </div>
          )}

          {/* Description Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-gray-700 text-center leading-relaxed font-medium">
              {currentPermission.description}
            </p>
          </div>

          {/* Status */}
          {currentPermission.granted && (
            <div className="text-center mb-6 animate-bounce-slow">
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-xl">
                <CheckCircle className="w-6 h-6" fill="currentColor" />
                <span className="font-black">Permission Granted ✓</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Actions */}
      <div className="px-6 pb-8 space-y-4 relative z-10">
        {!currentPermission.granted && (
          <button
            onClick={() => handleGrantPermission(currentPermission.id)}
            className="w-full py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)',
              color: 'white'
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Allow {currentPermission.title}
            </span>
          </button>
        )}

        {!currentPermission.required && (
          <button
            onClick={handleSkip}
            className="w-full py-4 rounded-2xl font-semibold border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
          >
            Skip for Now
          </button>
        )}

        {currentStep === permissions.length - 1 && requiredGranted && (
          <button
            onClick={handleContinue}
            className="w-full py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)',
              color: 'white'
            }}
          >
            <span className="flex items-center justify-center gap-2">
              Continue to App
              <ArrowRight className="w-5 h-5" />
            </span>
          </button>
        )}
      </div>

      {/* Permission List Preview */}
      <div className="px-6 pb-8 relative z-10">
        <div className="flex justify-center gap-2">
          {permissions.map((permission, index) => (
            <div
              key={permission.id}
              className={`transition-all duration-300 rounded-full ${
                index < currentStep
                  ? 'w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg'
                  : index === currentStep
                  ? 'w-8 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg'
                  : 'w-3 h-3 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
