import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  Car, 
  FileText, 
  Camera,
  CheckCircle2,
  ChevronLeft,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DriverRegistrationScreenProps {
  phone: string;
  onComplete: (driverData: any) => void;
}

const DriverRegistrationScreen = ({ phone, onComplete }: DriverRegistrationScreenProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    vehicleType: "auto",
    vehicleNumber: "",
    vehicleModel: "",
    drivingLicense: "",
    aadharNumber: "",
    vehicleRC: "",
    insuranceNumber: "",
    profilePhoto: null as File | null,
    vehiclePhoto: null as File | null,
    licensePhoto: null as File | null,
    rcPhoto: null as File | null
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (file) {
      toast({
        title: "File uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.vehicleType) {
        toast({
          title: "Missing Information",
          description: "Please fill all required fields",
          variant: "destructive"
        });
        return false;
      }
    } else if (step === 2) {
      if (!formData.vehicleNumber || !formData.drivingLicense) {
        toast({
          title: "Missing Information",
          description: "Please provide vehicle and license details",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Convert files to base64 if needed (or use FormData for file upload)
      const response = await fetch('http://localhost:3000/api/drivers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          name: formData.name,
          email: formData.email,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          vehicleModel: formData.vehicleModel,
          drivingLicense: formData.drivingLicense,
          aadharNumber: formData.aadharNumber,
          vehicleRC: formData.vehicleRC,
          vehicleInsurance: formData.insuranceNumber,
          // Note: In production, upload files to cloud storage and send URLs
          profilePhoto: formData.profilePhoto?.name,
          vehiclePhoto: formData.vehiclePhoto?.name,
          licensePhoto: formData.licensePhoto?.name,
          rcPhoto: formData.rcPhoto?.name,
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Registration Submitted!",
          description: data.message || "Your application is under review. We'll notify you once approved.",
        });

        const driverData = {
          id: data.driver.id,
          phone: data.driver.phone,
          name: data.driver.name,
          status: data.driver.status
        };

        setTimeout(() => {
          onComplete(driverData);
        }, 1500);
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Could not submit registration",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Driver Registration Error:', error);
      
      // Fallback for development
      toast({
        title: "Mock Registration",
        description: "Using development mode (server offline). Application submitted!",
      });

      const driverData = {
        id: `driver_${Date.now()}`,
        phone,
        name: formData.name,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        status: "pending_approval"
      };

      setTimeout(() => {
        onComplete(driverData);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Driver Registration</h1>
          <div className="w-10" />
        </div>
        <p className="text-center text-white/90">డ్రైవర్ రిజిస్ట్రేషన్</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                s === step ? 'bg-white text-primary' : 
                s < step ? 'bg-white/30 text-white' : 
                'bg-white/10 text-white/50'
              }`}>
                {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 ${s < step ? 'bg-white/30' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Personal Information</h2>
              <p className="text-sm text-muted-foreground">వ్యక్తిగత సమాచారం</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={phone}
                  disabled
                  className="mt-2 bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Vehicle Type *</Label>
                <RadioGroup
                  value={formData.vehicleType}
                  onValueChange={(value) => handleInputChange("vehicleType", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="auto" id="auto" />
                    <Label htmlFor="auto" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Car className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-semibold">Auto Rickshaw</p>
                          <p className="text-xs text-muted-foreground">3-wheeler auto</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="bike" id="bike" />
                    <Label htmlFor="bike" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Bike className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-semibold">Bike</p>
                          <p className="text-xs text-muted-foreground">2-wheeler motorcycle</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="profilePhoto">Profile Photo (Optional)</Label>
                <div className="mt-2">
                  <label htmlFor="profilePhoto" className="flex items-center gap-3 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {formData.profilePhoto ? formData.profilePhoto.name : "Upload profile photo"}
                      </p>
                      <p className="text-xs text-muted-foreground">JPG, PNG (Max 5MB)</p>
                    </div>
                  </label>
                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload("profilePhoto", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Vehicle & License Details */}
        {step === 2 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Vehicle & License Details</h2>
              <p className="text-sm text-muted-foreground">వాహనం & లైసెన్స్ వివరాలు</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                <Input
                  id="vehicleNumber"
                  placeholder="AP 39 AB 1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange("vehicleNumber", e.target.value.toUpperCase())}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  id="vehicleModel"
                  placeholder="Bajaj RE, TVS King, etc."
                  value={formData.vehicleModel}
                  onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="drivingLicense">Driving License Number *</Label>
                <Input
                  id="drivingLicense"
                  placeholder="AP1234567890123"
                  value={formData.drivingLicense}
                  onChange={(e) => handleInputChange("drivingLicense", e.target.value.toUpperCase())}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="aadharNumber">Aadhar Number</Label>
                <Input
                  id="aadharNumber"
                  placeholder="1234 5678 9012"
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                  className="mt-2"
                  maxLength={14}
                />
              </div>

              <div>
                <Label htmlFor="vehicleRC">Vehicle RC Number *</Label>
                <Input
                  id="vehicleRC"
                  placeholder="RC123456789"
                  value={formData.vehicleRC}
                  onChange={(e) => handleInputChange("vehicleRC", e.target.value.toUpperCase())}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="insuranceNumber">Insurance Number</Label>
                <Input
                  id="insuranceNumber"
                  placeholder="Insurance policy number"
                  value={formData.insuranceNumber}
                  onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Document Upload */}
        {step === 3 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
              <p className="text-sm text-muted-foreground">పత్రాలను అప్‌లోడ్ చేయండి</p>
            </div>

            <div className="space-y-4">
              {[
                { id: "vehiclePhoto", label: "Vehicle Photo *", icon: Car },
                { id: "licensePhoto", label: "Driving License Photo *", icon: FileText },
                { id: "rcPhoto", label: "RC Book Photo *", icon: FileText }
              ].map((doc) => (
                <div key={doc.id}>
                  <Label htmlFor={doc.id}>{doc.label}</Label>
                  <div className="mt-2">
                    <label htmlFor={doc.id} className="flex items-center gap-3 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                      <doc.icon className="w-6 h-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {formData[doc.id as keyof typeof formData] 
                            ? (formData[doc.id as keyof typeof formData] as File).name 
                            : `Upload ${doc.label.toLowerCase()}`}
                        </p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, PDF (Max 5MB)</p>
                      </div>
                      <Upload className="w-5 h-5 text-primary" />
                    </label>
                    <input
                      id={doc.id}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(doc.id, e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-center">
                📋 Please ensure all documents are clear and readable
              </p>
              <p className="text-xs text-center text-muted-foreground mt-2">
                దయచేసి అన్ని పత్రాలు స్పష్టంగా మరియు చదవగలిగేలా ఉన్నాయని నిర్ధారించుకోండి
              </p>
            </Card>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleNext}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {step < 3 ? "Next | తదుపరి" : "Submit Application | సమర్పించండి"}
          </Button>

          {step > 1 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="w-full h-12"
            >
              Back | వెనుకకు
            </Button>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Your documents will be verified within 24-48 hours. You'll receive a notification once approved.
        </p>
        <p className="text-xs text-center text-muted-foreground">
          మీ పత్రాలు 24-48 గంటల్లో ధృవీకరించబడతాయి. ఆమోదించబడిన తర్వాత మీకు నోటిఫికేషన్ వస్తుంది.
        </p>
      </div>
    </div>
  );
};

export default DriverRegistrationScreen;
