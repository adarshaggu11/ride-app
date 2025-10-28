// Safety & SOS Service
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

interface SOSAlert {
  id: string;
  userId: string;
  rideId: string;
  location: { lat: number; lng: number };
  timestamp: number;
  status: 'active' | 'resolved' | 'cancelled';
  type: 'manual' | 'automatic';
}

interface TripShare {
  rideId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  pickupLocation: string;
  dropLocation: string;
  estimatedArrival: string;
  trackingUrl: string;
}

class SafetyService {
  private emergencyNumber = '100'; // Police emergency
  private autoSosTimeout = 300000; // 5 minutes of no movement triggers SOS
  private lastMovementTime = Date.now();
  private sosActive = false;

  // Emergency Contacts Management
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    const stored = localStorage.getItem(`emergency_contacts_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  async addEmergencyContact(userId: string, contact: Omit<EmergencyContact, 'id'>): Promise<void> {
    const contacts = await this.getEmergencyContacts(userId);
    const newContact: EmergencyContact = {
      id: `${Date.now()}`,
      ...contact,
    };
    contacts.push(newContact);
    localStorage.setItem(`emergency_contacts_${userId}`, JSON.stringify(contacts));
  }

  async removeEmergencyContact(userId: string, contactId: string): Promise<void> {
    const contacts = await this.getEmergencyContacts(userId);
    const filtered = contacts.filter(c => c.id !== contactId);
    localStorage.setItem(`emergency_contacts_${userId}`, JSON.stringify(filtered));
  }

  // SOS Alert System
  async triggerSOS(
    userId: string,
    rideId: string,
    location: { lat: number; lng: number },
    type: 'manual' | 'automatic' = 'manual'
  ): Promise<SOSAlert> {
    if (this.sosActive) {
      throw new Error('SOS already active');
    }

    const alert: SOSAlert = {
      id: `SOS${Date.now()}`,
      userId,
      rideId,
      location,
      timestamp: Date.now(),
      status: 'active',
      type,
    };

    this.sosActive = true;

    // Notify emergency contacts
    const contacts = await this.getEmergencyContacts(userId);
    await this.notifyEmergencyContacts(contacts, alert);

    // Notify authorities (in production, this would call actual emergency API)
    await this.notifyAuthorities(alert);

    // Store alert
    this.storeSOSAlert(alert);

    // Start recording (in production)
    this.startEmergencyRecording();

    // Send location updates every 10 seconds
    this.startLocationTracking(alert);

    return alert;
  }

  async cancelSOS(alertId: string): Promise<void> {
    this.sosActive = false;
    // Notify that emergency is resolved
    console.log('SOS cancelled:', alertId);
  }

  private async notifyEmergencyContacts(contacts: EmergencyContact[], alert: SOSAlert): Promise<void> {
    const message = `🚨 EMERGENCY ALERT 🚨\n\nYour contact has triggered an SOS alert during an auto ride.\n\nLocation: https://maps.google.com/?q=${alert.location.lat},${alert.location.lng}\n\nTime: ${new Date(alert.timestamp).toLocaleString()}\n\nPlease check on them immediately or contact authorities.`;

    for (const contact of contacts) {
      try {
        // In production, use SMS API like Twilio
        await this.sendSMS(contact.phone, message);
        
        // Also send push notification if they have the app
        await this.sendPushNotification(contact.phone, {
          title: '🚨 Emergency Alert',
          body: 'Your contact needs help!',
          data: { alertId: alert.id, location: alert.location },
        });
      } catch (error) {
        console.error(`Failed to notify ${contact.name}:`, error);
      }
    }
  }

  private async notifyAuthorities(alert: SOSAlert): Promise<void> {
    // In production, integrate with local police/emergency services API
    console.log('Notifying authorities:', alert);
    
    // Could also trigger a call to emergency number
    // window.location.href = `tel:${this.emergencyNumber}`;
  }

  private async sendSMS(phone: string, message: string): Promise<void> {
    // Integrate with SMS gateway (Twilio, MSG91, etc.)
    console.log(`SMS to ${phone}:`, message);
  }

  private async sendPushNotification(recipientId: string, notification: any): Promise<void> {
    // Integrate with push notification service (FCM, OneSignal, etc.)
    console.log('Push notification:', notification);
  }

  private storeSOSAlert(alert: SOSAlert): void {
    const alerts = this.getStoredAlerts();
    alerts.push(alert);
    localStorage.setItem('sos_alerts', JSON.stringify(alerts));
  }

  private getStoredAlerts(): SOSAlert[] {
    const stored = localStorage.getItem('sos_alerts');
    return stored ? JSON.parse(stored) : [];
  }

  private startLocationTracking(alert: SOSAlert): void {
    // Send location updates every 10 seconds during emergency
    const interval = setInterval(async () => {
      if (!this.sosActive) {
        clearInterval(interval);
        return;
      }

      try {
        const position = await this.getCurrentLocation();
        // Send to server and emergency contacts
        console.log('Emergency location update:', position);
      } catch (error) {
        console.error('Failed to get location:', error);
      }
    }, 10000);
  }

  private startEmergencyRecording(): void {
    // In production, start audio/video recording
    console.log('Starting emergency recording');
  }

  // Trip Sharing
  async shareTripWithContacts(tripShare: TripShare, contactIds: string[]): Promise<void> {
    const userId = 'current_user'; // Get from auth
    const contacts = await this.getEmergencyContacts(userId);
    const selectedContacts = contacts.filter(c => contactIds.includes(c.id));

    const message = `🚗 Trip Update\n\nI'm taking an auto ride:\n\nDriver: ${tripShare.driverName}\nVehicle: ${tripShare.vehicleNumber}\nFrom: ${tripShare.pickupLocation}\nTo: ${tripShare.dropLocation}\nETA: ${tripShare.estimatedArrival}\n\nTrack me live: ${tripShare.trackingUrl}`;

    for (const contact of selectedContacts) {
      await this.sendSMS(contact.phone, message);
    }
  }

  async generateTripShareLink(rideId: string): Promise<string> {
    // Generate a unique tracking link
    const baseUrl = window.location.origin;
    const trackingId = btoa(rideId);
    return `${baseUrl}/track/${trackingId}`;
  }

  // Driver Verification
  async verifyDriver(driverId: string): Promise<{
    verified: boolean;
    rating: number;
    totalRides: number;
    badges: string[];
    backgroundCheck: boolean;
  }> {
    // In production, fetch from API
    return {
      verified: true,
      rating: 4.7,
      totalRides: 1250,
      badges: ['Top Rated', 'Verified', 'Safety Champion'],
      backgroundCheck: true,
    };
  }

  // Automatic Movement Detection
  startMovementMonitoring(rideId: string): void {
    const interval = setInterval(async () => {
      const currentTime = Date.now();
      const timeSinceMovement = currentTime - this.lastMovementTime;

      // If no movement for 5 minutes during active ride, trigger automatic SOS
      if (timeSinceMovement > this.autoSosTimeout) {
        console.warn('No movement detected for 5 minutes - triggering auto SOS');
        
        const location = await this.getCurrentLocation();
        await this.triggerSOS('current_user', rideId, location, 'automatic');
        
        clearInterval(interval);
      }
    }, 60000); // Check every minute
  }

  updateMovement(): void {
    this.lastMovementTime = Date.now();
  }

  // Fake Call Feature (to get out of uncomfortable situations)
  triggerFakeCall(): void {
    // Play ringtone
    const audio = new Audio('/ringtone.mp3');
    audio.play();

    // Show incoming call UI
    setTimeout(() => {
      alert('Incoming call from: Mom 📞');
    }, 1000);
  }

  // Report Driver/Issue
  async reportIssue(rideId: string, issue: {
    type: 'unsafe_driving' | 'harassment' | 'route_deviation' | 'other';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<void> {
    // Send to backend for review
    console.log('Issue reported:', { rideId, ...issue });

    if (issue.severity === 'critical') {
      // Auto-trigger safety measures
      const location = await this.getCurrentLocation();
      await this.triggerSOS('current_user', rideId, location);
    }
  }

  private async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
        reject
      );
    });
  }
}

export const safetyService = new SafetyService();
export type { EmergencyContact, SOSAlert, TripShare };
