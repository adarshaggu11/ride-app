import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  MapPin,
  Cloud,
  CreditCard,
  MessageSquare,
  Smartphone,
  Zap
} from "lucide-react";
import { pushNotificationService } from "@/services/pushNotificationService";
import { firebaseConfig } from "@/config/firebase";
import { useState, useEffect } from "react";

const SetupStatusScreen = () => {
  const navigate = useNavigate();
  const [notificationStatus, setNotificationStatus] = useState<any>(null);

  useEffect(() => {
    const status = pushNotificationService.getStatus();
    setNotificationStatus(status);
  }, []);

  const mapsConfigured = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "";
  const vapidConfigured = Boolean(import.meta.env.VITE_FIREBASE_VAPID_KEY);

  const services = [
    {
      name: "Google Maps API",
      icon: MapPin,
      status: mapsConfigured ? "configured" : "missing",
      description: "Location services, routing, and place search",
      envKey: "VITE_GOOGLE_MAPS_API_KEY",
      setupUrl: "https://console.cloud.google.com/",
      priority: "critical"
    },
    {
      name: "Firebase",
      icon: Cloud,
      status: notificationStatus?.firebase?.configured ? "configured" : "missing",
      description: "Push notifications, analytics, and crash reporting",
      envKey: "VITE_FIREBASE_API_KEY (+ 5 more keys)",
      setupUrl: "https://console.firebase.google.com/",
      priority: "high",
      missingKeys: notificationStatus?.firebase?.missingKeys
    },
    {
      name: "Web Push (VAPID)",
      icon: Smartphone,
      status: vapidConfigured ? "configured" : (notificationStatus?.permission === 'granted' ? 'partial' : 'missing'),
      description: "Required for Firebase Web Push tokens",
      envKey: "VITE_FIREBASE_VAPID_KEY",
      setupUrl: "https://console.firebase.google.com/project/_/settings/cloudmessaging",
      priority: "high"
    },
    {
      name: "SMS Gateway",
      icon: MessageSquare,
      status: import.meta.env.VITE_TWILIO_ACCOUNT_SID ? "configured" : "missing",
      description: "Twilio for OTP and notifications",
      envKey: "VITE_TWILIO_ACCOUNT_SID",
      setupUrl: "https://www.twilio.com/console",
      priority: "medium"
    },
    {
      name: "Push Notifications",
      icon: Smartphone,
      status: notificationStatus?.browserSupport ? 
        (notificationStatus?.permission === 'granted' ? 'configured' : 'partial') : 
        'missing',
      description: "Browser push notifications for ride updates",
      envKey: "Browser permission required",
      setupUrl: null,
      priority: "medium"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "configured":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "partial":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "configured":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            ✓ Configured
          </span>
        );
      case "partial":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            ⚠ Partial
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            ✗ Not Configured
          </span>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-l-4 border-l-red-500";
      case "high":
        return "border-l-4 border-l-orange-500";
      default:
        return "border-l-4 border-l-blue-500";
    }
  };

  const testPushNotification = async () => {
    const granted = await pushNotificationService.requestPermission();
    if (granted) {
      await pushNotificationService.sendTestNotification();
      // Refresh status
      const status = pushNotificationService.getStatus();
      setNotificationStatus(status);
    }
  };

  const configuredCount = services.filter(s => s.status === "configured").length;
  const totalCount = services.length;
  const percentage = Math.round((configuredCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-b sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-orange-600 fill-orange-600" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-black">Setup Status</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Overall Progress */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{percentage}%</h2>
              <p className="text-sm text-gray-600">Configuration Complete</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {configuredCount}/{totalCount}
              </p>
              <p className="text-xs text-gray-600">Services Ready</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </Card>

        {/* Services List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Services Configuration</h3>
          
          {services.map((service, index) => (
            <Card key={index} className={`p-4 ${getPriorityColor(service.priority)}`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-6 h-6 text-gray-700" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(service.status)}
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(service.status)}
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {service.priority === "critical" ? "🔴 Critical" : 
                       service.priority === "high" ? "🟠 High Priority" : 
                       "🔵 Optional"}
                    </span>
                  </div>

                  {service.status !== "configured" && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Environment Variable:
                      </p>
                      <code className="text-xs text-primary font-mono">
                        {service.envKey}
                      </code>
                      
                      {service.missingKeys && service.missingKeys.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-red-600 font-medium">Missing keys:</p>
                          <ul className="text-xs text-red-600 ml-4 mt-1">
                            {service.missingKeys.map((key: string, i: number) => (
                              <li key={i}>• {key}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {service.setupUrl && (
                        <a 
                          href={service.setupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-2 inline-block"
                        >
                          Get API Key →
                        </a>
                      )}

                      {service.name === "Push Notifications" && service.status === "partial" && (
                        <Button
                          size="sm"
                          className="mt-2 w-full"
                          onClick={testPushNotification}
                        >
                          Test Notification
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Setup Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">📚 Setup Instructions</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. Get API keys from the service provider websites</p>
            <p>2. Add them to your <code className="bg-blue-100 px-1 rounded">.env</code> file</p>
            <p>3. Restart the development server</p>
            <p>4. Refresh this page to see updated status</p>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <p className="text-xs font-medium text-gray-700 mb-1">Example .env entry:</p>
            <code className="text-xs text-gray-800 block">
              VITE_FIREBASE_API_KEY=your_api_key_here
            </code>
          </div>
        </Card>

        {/* Current Status Summary */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Current Status Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Google Maps:</span>
              {mapsConfigured ? (
                <span className="font-medium text-green-600">✓ Ready</span>
              ) : (
                <span className="font-medium text-red-600">✗ Not Configured</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Backend API:</span>
              {backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1') ? (
                <span className="font-medium text-yellow-600">⚠ Localhost</span>
              ) : backendUrl ? (
                <span className="font-medium text-green-600">✓ {backendUrl}</span>
              ) : (
                <span className="font-medium text-red-600">✗ Not Set</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Firebase:</span>
              <span className="font-medium text-red-600">
                {notificationStatus?.firebase?.configured ? '✓ Ready' : '✗ Not Configured'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAPID (Web Push):</span>
              {vapidConfigured ? (
                <span className="font-medium text-green-600">✓ Set</span>
              ) : (
                <span className="font-medium text-red-600">✗ Missing</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payments:</span>
              <span className="font-medium text-red-600">✗ Not Configured</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SetupStatusScreen;
