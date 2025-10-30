import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Car, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import DriverRegistrationScreen from "./DriverRegistrationScreen";

interface AuthScreenProps {
  onLogin: (user: { id: string; name: string; phone: string; avatar: string }) => void;
}

type UserType = "customer" | "driver";
type AuthStep = "phone" | "otp" | "name" | "driverRegistration";

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [userType, setUserType] = useState<UserType>("customer");
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [lastOtp, setLastOtp] = useState(""); // Store OTP for display
  const [otpVerified, setOtpVerified] = useState(false); // Track if OTP was verified
  const { toast } = useToast();

  useEffect(() => {
    if (otpSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [otpSent, countdown]);

  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSendOTP = async () => {
    if (!validatePhone(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian mobile number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (data.success) {
        // In development, show the OTP in toast
        if (data.otp) {
          console.log(`OTP for ${phone}: ${data.otp}`);
          setLastOtp(data.otp); // Store OTP for display
          toast({
            title: "OTP Sent Successfully",
            description: `Your OTP is: ${data.otp} (Development Mode)`,
            duration: 10000, // Show for 10 seconds
          });
        } else {
          toast({
            title: "OTP Sent Successfully!",
            description: `Verification code sent to +91 ${phone}`,
          });
        }

        setOtpSent(true);
        setStep("otp");
        setCountdown(30);
        setCanResend(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      
      // Show error - don't fall back to mock in production
      toast({
        title: "Connection Error",
        description: import.meta.env.DEV 
          ? "Could not connect to server. Using mock OTP: 123456 (Development Only)"
          : "Could not connect to server. Please check your internet connection and try again.",
        variant: "destructive"
      });
      
      // Only allow fallback to mock in development
      if (import.meta.env.DEV) {
        setOtpSent(true);
        setStep("otp");
        setCountdown(30);
        setCanResend(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setCanResend(false);
    setCountdown(30);
    handleSendOTP();
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // First, verify OTP
      const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp })
      });

      const data = await response.json();

      if (data.success) {
        // Check if user exists or is new
        if (data.user && data.user.name) {
          // Existing user - login directly
          localStorage.setItem('token', data.token);
          onLogin({
            id: data.user.id,
            name: data.user.name,
            phone: data.user.phone,
            avatar: data.user.avatar || "👤",
          });
          
          toast({
            title: "Login Successful!",
            description: "Welcome back!",
          });
        } else {
          // New user - collect name or go to driver registration
          if (userType === "customer") {
            setStep("name");
          } else {
            // Check if driver already registered
            try {
              const driverCheck = await fetch(`http://localhost:3000/api/drivers/phone/${phone}`);
              const driverData = await driverCheck.json();
              
              if (driverData.success) {
                // Driver exists, login
                localStorage.setItem('token', data.token);
                onLogin({
                  id: driverData.driver.id,
                  name: driverData.driver.name,
                  phone: driverData.driver.phone,
                  avatar: "",
                });
                
                toast({
                  title: "Login Successful!",
                  description: `Status: ${driverData.driver.status}`,
                });
              } else {
                // New driver - go to registration
                setStep("driverRegistration");
              }
            } catch (error) {
              // Driver not found - go to registration
              setStep("driverRegistration");
            }
          }
        }
      } else if (data.requiresName) {
        // Backend says name is required - go to name step
        setOtpVerified(true); // Mark OTP as verified
        if (userType === "customer") {
          setStep("name");
        } else {
          setStep("driverRegistration");
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: data.message || "Please enter the correct OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      
      // Development-only fallback
      if (import.meta.env.DEV && otp === "123456") {
        toast({
          title: "Development Mode",
          description: "Using mock login (server offline). This will not work in production.",
        });
        
        if (userType === "customer") {
          setStep("name");
        } else {
          setStep("driverRegistration");
        }
      } else {
        toast({
          title: "Connection Error",
          description: import.meta.env.DEV
            ? "Could not connect to server. Use OTP: 123456 in development mode."
            : "Could not verify OTP. Please check your internet connection and try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // If OTP already verified, just need to send name with OTP again
      const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp, name })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        
        const userData = {
          id: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          avatar: data.user.avatar || name.charAt(0).toUpperCase(),
        };

        toast({
          title: "Registration Successful!",
          description: "Welcome to Dropout!",
        });

        onLogin(userData);
      } else {
        toast({
          title: "Error",
          description: data.message || "Registration failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration Error:', error);
      
      // Fallback for development
      const userData = {
        id: `user_${Date.now()}`,
        name: name,
        phone: phone,
        avatar: name.charAt(0).toUpperCase(),
      };

      toast({
        title: "Mock Registration",
        description: "Using development mode (server offline)",
      });

      onLogin(userData);
    } finally {
      setLoading(false);
    }
  };

  const handleDriverRegistrationComplete = (driverData: any) => {
    const userData = {
      id: driverData.id,
      name: driverData.name,
      phone: driverData.phone,
      avatar: "",
    };

    toast({
      title: "Registration Successful!",
      description: "Your application is under review",
    });

    onLogin(userData);
  };

  if (step === "driverRegistration") {
    return <DriverRegistrationScreen phone={phone} onComplete={handleDriverRegistrationComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-black flex flex-col px-6 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-yellow-400 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-15 bg-orange-500 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full relative z-10">
        {/* Premium Logo Header */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="relative inline-block mb-4">
            {/* Logo Container with Animated Ring */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl flex items-center justify-center relative">
              {/* Rotating Ring */}
              <div className="absolute inset-0 w-full h-full">
                <div className="w-full h-full rounded-3xl border-2 border-dashed border-yellow-400/30 animate-spin-slow"></div>
              </div>
              
              {/* Zap Icon */}
              <Zap 
                className="w-12 h-12 relative z-10" 
                style={{
                  fill: 'url(#authZapGradient)',
                  strokeWidth: 0,
                }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="authZapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Pulse Effect */}
              <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-yellow-400/10 animate-ping"></div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white mb-2 tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            Dropout
          </h1>
          <p className="text-white/90 text-lg font-semibold">Your Ride, Your Way</p>

          {/* Feature Badges */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {[
              { icon: Shield, label: 'Secure' },
              { icon: Zap, label: 'Fast' },
              { icon: Clock, label: '24/7' }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <Icon className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-semibold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {step === "phone" && (
          <Tabs value={userType} onValueChange={(v) => setUserType(v as UserType)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-md border border-white/30">
              <TabsTrigger 
                value="customer" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <User className="w-4 h-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger 
                value="driver" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Car className="w-4 h-4" />
                Driver
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <Card className="p-6 shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-scale-in">
          {step === "phone" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {userType === "customer" ? "Book Your Ride" : "Partner with Us"}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Enter your mobile number to continue
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-semibold">Mobile Number</Label>
                <div className="flex gap-3">
                  <div className="w-16 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg">
                    +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="h-14 flex-1 text-lg font-semibold border-2 focus:border-yellow-500"
                    maxLength={10}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-muted-foreground font-medium">
                    We'll send you a secure verification code
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                className="w-full h-14 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                style={{
                  background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)',
                  color: 'white'
                }}
                disabled={loading || phone.length !== 10}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send OTP
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Enter OTP
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Code sent to <span className="font-bold text-foreground">+91 {phone}</span>
                </p>
                {lastOtp && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border-2 border-green-400 shadow-lg animate-slide-down">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-bold text-green-700 dark:text-green-300">
                        Your OTP Code
                      </p>
                    </div>
                    <p className="text-3xl font-black text-green-700 dark:text-green-300 text-center tracking-widest py-2">
                      {lastOtp}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 text-center mt-2 font-semibold">
                      ✓ Copy and paste this code above
                    </p>
                  </div>
                )}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-300 dark:border-blue-700">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Development Mode: Check notification or backend terminal
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="otp" className="text-base font-semibold">6-Digit OTP</Label>
                <Input
                  id="otp"
                  type="tel"
                  placeholder="● ● ● ● ● ●"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-14 text-center text-3xl tracking-widest font-black border-2 focus:border-yellow-500"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={handleResendOTP}
                    className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 hover:underline"
                  >
                    ↻ Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-muted-foreground font-medium">
                    Resend OTP in <span className="font-bold text-foreground">{countdown}s</span>
                  </p>
                )}
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full h-14 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                style={{
                  background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)',
                  color: 'white'
                }}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Verify OTP
                  </span>
                )}
              </Button>

              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setOtpSent(false);
                  setLastOtp("");
                }}
                className="w-full text-sm font-semibold text-muted-foreground hover:text-yellow-600 transition-colors"
              >
                ← Change Number
              </button>
            </div>
          )}

          {step === "name" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Welcome! 🎉
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Please tell us your name to complete registration
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 text-lg font-semibold border-2 focus:border-yellow-500"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-muted-foreground font-medium">
                    This will be displayed on your profile
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCompleteRegistration}
                className="w-full h-14 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                style={{
                  background: 'linear-gradient(135deg, #FCD34D 0%, #EA580C 100%)',
                  color: 'white'
                }}
                disabled={!name.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>
          )}
        </Card>

        <div className="mt-6 space-y-2">
          <p className="text-xs text-center text-white/80 font-medium">
            🔒 Secure & Encrypted Connection
          </p>
          <p className="text-xs text-center text-white/70">
            By continuing, you agree to our <span className="font-semibold underline">Terms</span> & <span className="font-semibold underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
