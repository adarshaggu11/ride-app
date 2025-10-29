import { useState } from 'react';
import { MapPin, Bell, Camera, Phone } from 'lucide-react';
import { requestLocationPermission } from '../services/locationService';
import { requestCameraPermission } from '../services/cameraService';
import { requestLocalNotificationPermission } from '../services/localNotificationService';

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
    const saved = localStorage.getItem('permission_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved permissions:', error);
      }
    }
    
    return [
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
    ];
  };

  const [permissions, setPermissions] = useState<Permission[]>(loadSavedPermissions());

  // Load saved current step
  const loadCurrentStep = (): number => {
    const saved = localStorage.getItem('permission_step');
    return saved ? parseInt(saved, 10) : 0;
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
      localStorage.setItem('permission_state', JSON.stringify(updatedPermissions));

      // Move to next permission
      if (currentStep < permissions.length - 1) {
        const nextStep = currentStep + 1;
        localStorage.setItem('permission_step', nextStep.toString());
        setTimeout(() => setCurrentStep(nextStep), 300);
      } else {
        // All permissions done
        localStorage.setItem('permission_step', '0');
      }
    } catch (error) {
      console.error('Permission error:', error);
      // Mark as not granted on error
      const updatedPermissions = permissions.map(p =>
        p.id === permissionId ? { ...p, granted: false } : p
      );
      setPermissions(updatedPermissions);
      localStorage.setItem('permission_state', JSON.stringify(updatedPermissions));
    }
  };

  const handleSkip = () => {
    if (currentStep < permissions.length - 1) {
      const nextStep = currentStep + 1;
      localStorage.setItem('permission_step', nextStep.toString());
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
      localStorage.removeItem('permission_state');
      localStorage.removeItem('permission_step');
      localStorage.setItem('permissions_requested', 'true');
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dropout</h1>
          <span className="text-sm text-gray-500">
            {currentStep + 1}/{permissions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / permissions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon className="w-12 h-12 text-yellow-500" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            {currentPermission.title}
          </h2>

          {/* Required Badge */}
          {currentPermission.required && (
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Required
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            {currentPermission.description}
          </p>

          {/* Status */}
          {currentPermission.granted && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Permission Granted
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-8 space-y-3">
        {!currentPermission.granted && (
          <button
            onClick={() => handleGrantPermission(currentPermission.id)}
            className="w-full bg-yellow-500 text-gray-900 font-semibold py-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Allow {currentPermission.title}
          </button>
        )}

        {!currentPermission.required && (
          <button
            onClick={handleSkip}
            className="w-full bg-white text-gray-700 font-medium py-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
        )}

        {currentStep === permissions.length - 1 && requiredGranted && (
          <button
            onClick={handleContinue}
            className="w-full bg-yellow-500 text-gray-900 font-semibold py-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Continue to App
          </button>
        )}
      </div>

      {/* Permission List Preview */}
      <div className="px-6 pb-6">
        <div className="flex justify-center gap-2">
          {permissions.map((permission, index) => (
            <div
              key={permission.id}
              className={`w-2 h-2 rounded-full transition-colors ${
                index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-yellow-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
