import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Share2, 
  Shield, 
  UserPlus, 
  MapPin,
  Clock,
  ChevronLeft,
  Edit2,
  Trash2,
  Plus,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { callEmergency, shareRideViaSMS } from '@/services/phoneService';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export const EmergencyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'sos' | 'contacts' | 'safety'>('sos');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  
  // Mock emergency contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Mom', phone: '+91 98765 43210', relation: 'Mother' },
    { id: '2', name: 'Dad', phone: '+91 98765 43211', relation: 'Father' },
    { id: '3', name: 'Brother', phone: '+91 98765 43212', relation: 'Sibling' }
  ]);

  // Mock current ride data
  const currentRide = {
    driverName: 'Rajesh Kumar',
    vehicleNumber: 'TS 09 AB 1234',
    vehicleType: 'Auto',
    currentLocation: 'Banjara Hills, Hyderabad',
    destination: 'HITEC City, Hyderabad',
    eta: '12 min'
  };

  const handleSOS = async () => {
    // Alert all emergency contacts
    for (const contact of contacts) {
      try {
        await shareRideViaSMS(contact.phone, {
          driverName: currentRide.driverName,
          vehicleNumber: currentRide.vehicleNumber,
          pickupLocation: currentRide.currentLocation,
          dropLocation: currentRide.destination,
          estimatedTime: currentRide.eta
        });
      } catch (error) {
        console.error(`Failed to alert ${contact.name}:`, error);
      }
    }
    
    toast({
      title: "Emergency Alert Sent",
      description: "Your location and ride details have been shared with emergency contacts and local authorities.",
    });
    
    // In production: Call emergency services API, share location, notify contacts
  };

  const handleShareLocation = () => {
    const message = `EMERGENCY - I need help!\n\nRide Details:\nDriver: ${currentRide.driverName}\nVehicle: ${currentRide.vehicleNumber}\nLocation: ${currentRide.currentLocation}\nDestination: ${currentRide.destination}\nETA: ${currentRide.eta}\n\nTrack my live location: https://maps.google.com/share/location`;
    
    // Share via WhatsApp
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    
    toast({
      title: "Location Shared",
      description: "Live location link sent to your emergency contacts",
    });
  };

  const handleCallPolice = async () => {
    try {
      await callEmergency('100'); // Indian police emergency number
      toast({
        title: "Calling Police",
        description: "Connecting to emergency services...",
      });
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Unable to connect to emergency services.",
        variant: "destructive",
      });
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and phone number",
        variant: "destructive"
      });
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', relation: '' });
    setIsAddingContact(false);
    
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your emergency contacts`,
    });
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been deleted",
    });
  };

  const safetyTips = [
    {
      icon: Shield,
      title: 'Verify Driver Details',
      description: 'Always check driver photo, name, and vehicle number before entering'
    },
    {
      icon: Phone,
      title: 'Share Trip Details',
      description: 'Share your live location with family or friends during the ride'
    },
    {
      icon: MapPin,
      title: 'Stay Alert',
      description: 'Keep your phone charged and track your route on the map'
    },
    {
      icon: AlertTriangle,
      title: 'Trust Your Instincts',
      description: 'If something feels wrong, cancel the ride and contact support immediately'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Emergency & Safety</h1>
            <p className="text-red-100 text-sm">Your safety is our priority</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {[
            { id: 'sos', label: 'SOS', icon: AlertTriangle },
            { id: 'contacts', label: 'Contacts', icon: UserPlus },
            { id: 'safety', label: 'Safety Tips', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 pb-24">
        {/* SOS Tab */}
        {activeTab === 'sos' && (
          <div className="space-y-6 animate-fade-in">
            {/* Giant SOS Button */}
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
              <button
                onClick={handleSOS}
                className="w-48 h-48 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
              >
                <div className="text-center">
                  <AlertTriangle className="w-20 h-20 text-white mb-2 mx-auto animate-pulse" />
                  <span className="text-3xl font-bold text-white">SOS</span>
                </div>
              </button>
              
              <h2 className="text-2xl font-bold mt-6 mb-2">Emergency Alert</h2>
              <p className="text-slate-600 text-sm mb-6">
                Press the button above in case of emergency.<br/>
                Your location and ride details will be shared with emergency contacts and authorities.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left">
                <p className="text-red-800 text-sm font-medium mb-2">⚠️ When to use SOS:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• If you feel unsafe or threatened</li>
                  <li>• If driver is not following the route</li>
                  <li>• If driver is under influence of alcohol/drugs</li>
                  <li>• In case of accident or medical emergency</li>
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleShareLocation}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <Share2 className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-1">Share Location</h3>
                <p className="text-xs text-blue-100">Send live location link</p>
              </button>

              <button
                onClick={handleCallPolice}
                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <Phone className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-1">Call Police</h3>
                <p className="text-xs text-orange-100">Dial 100 emergency</p>
              </button>
            </div>

            {/* Current Ride Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Current Ride Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Driver</span>
                  <span className="font-semibold">{currentRide.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Vehicle</span>
                  <span className="font-semibold">{currentRide.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Type</span>
                  <span className="font-semibold">{currentRide.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Location</span>
                  <span className="font-semibold text-right">{currentRide.currentLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">ETA</span>
                  <span className="font-semibold text-green-600">{currentRide.eta}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4 animate-fade-in">
            {/* Add Contact Button */}
            {!isAddingContact && (
              <button
                onClick={() => setIsAddingContact(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-4 font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Emergency Contact
              </button>
            )}

            {/* Add Contact Form */}
            {isAddingContact && (
              <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-up">
                <h3 className="font-bold text-lg mb-4">Add Emergency Contact</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="Enter name"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Relation</label>
                    <select
                      value={newContact.relation}
                      onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select relation</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleAddContact}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Save Contact
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingContact(false);
                        setNewContact({ name: '', phone: '', relation: '' });
                      }}
                      className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contacts List */}
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {contact.name[0].toUpperCase()}
                      </div>
                      
                      <div>
                        <h4 className="font-bold">{contact.name}</h4>
                        <p className="text-sm text-slate-600">{contact.phone}</p>
                        {contact.relation && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {contact.relation}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {contacts.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center">
                <UserPlus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">No Emergency Contacts</h3>
                <p className="text-slate-600 text-sm">Add trusted contacts who will be notified in emergencies</p>
              </div>
            )}
          </div>
        )}

        {/* Safety Tips Tab */}
        {activeTab === 'safety' && (
          <div className="space-y-4 animate-fade-in">
            {safetyTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Auto-Share Option */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">Auto-Share Ride Details</h3>
                  <p className="text-sm text-slate-600">Automatically share trip info with emergency contacts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-8 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="bg-white/50 rounded-xl p-3">
                <p className="text-xs text-slate-700">
                  ✓ Driver details<br/>
                  ✓ Live location tracking<br/>
                  ✓ Expected arrival time<br/>
                  ✓ Route information
                </p>
              </div>
            </div>

            {/* Emergency Numbers */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-600" />
                Emergency Helpline Numbers
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Police', number: '100', color: 'blue' },
                  { name: 'Ambulance', number: '108', color: 'red' },
                  { name: 'Women Helpline', number: '1091', color: 'pink' },
                  { name: 'App Support', number: '1800-XXX-XXXX', color: 'green' }
                ].map((helpline, index) => (
                  <button
                    key={index}
                    onClick={() => window.location.href = `tel:${helpline.number}`}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <span className="font-semibold">{helpline.name}</span>
                    <span className={`text-${helpline.color}-600 font-bold`}>{helpline.number}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
