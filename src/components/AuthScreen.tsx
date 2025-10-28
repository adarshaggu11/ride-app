import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Car, ArrowRight } from "lucide-react";
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
          console.log(`📱 OTP for ${phone}: ${data.otp}`);
          setLastOtp(data.otp); // Store OTP for display
          toast({
            title: "OTP Sent Successfully! 🎉",
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
      toast({
        title: "Connection Error",
        description: "Could not connect to server. Using mock OTP: 123456",
        variant: "destructive"
      });
      
      // Fallback to mock for development
      setOtpSent(true);
      setStep("otp");
      setCountdown(30);
      setCanResend(false);
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
                  avatar: "🚗",
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
      
      // Fallback to mock for development
      if (otp === "123456") {
        toast({
          title: "Mock Login",
          description: "Using development mode (server offline)",
        });
        
        if (userType === "customer") {
          setStep("name");
        } else {
          setStep("driverRegistration");
        }
      } else {
        toast({
          title: "Connection Error",
          description: "Could not connect to server. Use OTP: 123456",
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
      avatar: "🚗",
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
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-yellow-400 flex flex-col px-6 py-8">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-primary">D</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dropout</h1>
          <p className="text-muted-foreground">Your Ride, Your Way</p>
        </div>

        {step === "phone" && (
          <Tabs value={userType} onValueChange={(v) => setUserType(v as UserType)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="driver" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Driver
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <Card className="p-6 shadow-lg">
          {step === "phone" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {userType === "customer" ? "Book Your Ride" : "Partner with Us"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your mobile number to continue
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="flex gap-2">
                  <div className="w-16 h-12 bg-muted rounded-md flex items-center justify-center font-semibold">
                    +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="h-12 flex-1"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send you a verification code
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                className="w-full h-12 text-lg font-semibold"
                disabled={loading || phone.length !== 10}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Enter OTP</h2>
                <p className="text-sm text-muted-foreground">
                  Code sent to +91 {phone}
                </p>
                <p className="text-xs text-muted-foreground">
                  +91 {phone} కి కోడ్ పంపబడింది
                </p>
                {lastOtp && (
                  <div className="mt-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500">
                    <p className="text-sm font-bold text-green-700 dark:text-green-300 text-center">
                      🔐 Your OTP: <span className="text-2xl tracking-widest">{lastOtp}</span>
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 text-center mt-1">
                      Copy and paste this code above
                    </p>
                  </div>
                )}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    💡 Development Mode: Check the notification above or the backend terminal
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
                <Input
                  id="otp"
                  type="tel"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-12 text-center text-2xl tracking-widest"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={handleResendOTP}
                    className="text-sm text-primary hover:underline font-semibold"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in {countdown}s
                  </p>
                )}
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full h-12 text-lg font-semibold"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP | ధృవీకరించండి"}
              </Button>

              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setOtpSent(false);
                  setLastOtp(""); // Clear stored OTP
                }}
                className="w-full text-sm text-muted-foreground hover:text-primary"
              >
                Change Number | నంబర్ మార్చండి
              </button>
            </div>
          )}

          {step === "name" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Welcome!</h2>
                <p className="text-sm text-muted-foreground">
                  Please tell us your name | దయచేసి మీ పేరు చెప్పండి
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name | పూర్తి పేరు</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleCompleteRegistration}
                className="w-full h-12 text-lg font-semibold"
                disabled={!name.trim()}
              >
                Continue | కొనసాగండి
              </Button>
            </div>
          )}
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
        <p className="text-xs text-center text-muted-foreground">
          కొనసాగడం ద్వారా, మీరు మా నిబంధనలు & గోప్యతా విధానానికి అంగీకరిస్తున్నారు
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
