// Real-time vehicle tracking service with location simulation

export interface Vehicle {
  id: string;
  type: 'bike' | 'auto' | 'car';
  lat: number;
  lng: number;
  bearing: number; // Direction in degrees (0-360)
  speed: number; // km/h
  driver: {
    name: string;
    rating: number;
    phone: string;
    vehicleNumber: string;
  };
  status: 'available' | 'busy' | 'offline';
}

class VehicleTrackingService {
  private vehicles: Map<string, Vehicle> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private subscribers: Set<(vehicles: Vehicle[]) => void> = new Set();

  // Initialize with mock vehicles in Hyderabad area
  initializeMockVehicles(center: { lat: number; lng: number }, count: number = 15) {
    const types: ('bike' | 'auto' | 'car')[] = ['bike', 'auto', 'car'];
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const vehicle: Vehicle = {
        id: `vehicle_${i}`,
        type,
        lat: center.lat + (Math.random() - 0.5) * 0.02,
        lng: center.lng + (Math.random() - 0.5) * 0.02,
        bearing: Math.random() * 360,
        speed: 20 + Math.random() * 30,
        driver: {
          name: this.getRandomDriverName(),
          rating: 4.0 + Math.random() * 1.0,
          phone: `+91 ${Math.floor(Math.random() * 10000000000)}`,
          vehicleNumber: `TS09 ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(1000 + Math.random() * 9000)}`,
        },
        status: Math.random() > 0.3 ? 'available' : 'busy',
      };
      this.vehicles.set(vehicle.id, vehicle);
    }
  }

  // Get random Indian driver name
  private getRandomDriverName(): string {
    const names = [
      'Rajesh Kumar',
      'Vijay Singh',
      'Arun Sharma',
      'Suresh Reddy',
      'Ramesh Rao',
      'Mahesh Patel',
      'Prakash Gupta',
      'Kiran Kumar',
      'Venkat Naidu',
      'Srinivas Murthy',
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  // Start real-time tracking
  startTracking() {
    if (this.updateInterval) return;

    // Update vehicle positions every 2 seconds
    this.updateInterval = setInterval(() => {
      this.updateVehiclePositions();
      this.notifySubscribers();
    }, 2000);
  }

  // Stop tracking
  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Update vehicle positions with realistic movement
  private updateVehiclePositions() {
    this.vehicles.forEach((vehicle) => {
      if (vehicle.status === 'offline') return;

      // Calculate movement based on speed and bearing
      const speedInDegreesPerSecond = (vehicle.speed / 111000) * 2; // Approximate conversion
      
      // Add some randomness to simulate realistic movement
      const newBearing = vehicle.bearing + (Math.random() - 0.5) * 30;
      const newSpeed = Math.max(10, Math.min(50, vehicle.speed + (Math.random() - 0.5) * 5));

      // Calculate new position
      const radians = (newBearing * Math.PI) / 180;
      const newLat = vehicle.lat + Math.cos(radians) * speedInDegreesPerSecond;
      const newLng = vehicle.lng + Math.sin(radians) * speedInDegreesPerSecond;

      // Update vehicle
      vehicle.lat = newLat;
      vehicle.lng = newLng;
      vehicle.bearing = newBearing;
      vehicle.speed = newSpeed;

      // Randomly change status
      if (Math.random() > 0.95) {
        vehicle.status = vehicle.status === 'available' ? 'busy' : 'available';
      }
    });
  }

  // Subscribe to vehicle updates
  subscribe(callback: (vehicles: Vehicle[]) => void) {
    this.subscribers.add(callback);
    // Immediately send current vehicles
    callback(this.getVehicles());
    return () => this.subscribers.delete(callback);
  }

  // Notify all subscribers
  private notifySubscribers() {
    const vehicles = this.getVehicles();
    this.subscribers.forEach(callback => callback(vehicles));
  }

  // Get all vehicles
  getVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  // Get vehicles by type
  getVehiclesByType(type: 'bike' | 'auto' | 'car'): Vehicle[] {
    return this.getVehicles().filter(v => v.type === type && v.status === 'available');
  }

  // Get nearby vehicles within radius (km)
  getNearbyVehicles(
    lat: number,
    lng: number,
    radiusKm: number = 5,
    type?: 'bike' | 'auto' | 'car'
  ): Vehicle[] {
    return this.getVehicles().filter(vehicle => {
      if (type && vehicle.type !== type) return false;
      if (vehicle.status !== 'available') return false;

      const distance = this.calculateDistance(lat, lng, vehicle.lat, vehicle.lng);
      return distance <= radiusKm;
    });
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Get vehicle by ID
  getVehicle(id: string): Vehicle | undefined {
    return this.vehicles.get(id);
  }

  // Clear all vehicles
  clear() {
    this.stopTracking();
    this.vehicles.clear();
    this.subscribers.clear();
  }
}

// Export singleton instance
export const vehicleTrackingService = new VehicleTrackingService();
