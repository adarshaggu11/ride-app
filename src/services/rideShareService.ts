// Smart Ride Sharing Service
interface RideRequest {
  id: string;
  userId: string;
  pickup: { lat: number; lng: number; address: string };
  drop: { lat: number; lng: number; address: string };
  timestamp: number;
  seats: number;
  maxDetour: number; // in meters
  priceRange: { min: number; max: number };
}

interface SharedRide {
  id: string;
  driverId: string;
  route: { lat: number; lng: number }[];
  riders: RideRequest[];
  status: 'searching' | 'matched' | 'ongoing' | 'completed';
  totalDistance: number;
  estimatedDuration: number;
  pricePerPerson: number;
}

interface MatchResult {
  matchFound: boolean;
  ride?: SharedRide;
  savings: number;
  additionalTime: number;
}

class RideShareService {
  private activeRequests: Map<string, RideRequest> = new Map();
  private activeRides: Map<string, SharedRide> = new Map();
  private maxDetourPercent = 0.3; // Maximum 30% detour
  private maxWaitTime = 300000; // 5 minutes max wait

  // Create a ride share request
  async createRideRequest(
    userId: string,
    pickup: { lat: number; lng: number; address: string },
    drop: { lat: number; lng: number; address: string },
    seats: number = 1
  ): Promise<RideRequest> {
    const request: RideRequest = {
      id: `REQ${Date.now()}`,
      userId,
      pickup,
      drop,
      timestamp: Date.now(),
      seats,
      maxDetour: 2000, // 2km max detour
      priceRange: { min: 50, max: 200 },
    };

    this.activeRequests.set(request.id, request);

    // Try to find a match
    await this.findMatch(request);

    return request;
  }

  // Find matching rides going in similar direction
  private async findMatch(request: RideRequest): Promise<MatchResult> {
    const compatibleRides: Array<{ ride: SharedRide; score: number }> = [];

    // Check all active rides
    for (const [rideId, ride] of this.activeRides) {
      if (ride.status !== 'searching' && ride.status !== 'matched') continue;

      const compatibility = await this.calculateCompatibility(request, ride);

      if (compatibility.compatible) {
        compatibleRides.push({ ride, score: compatibility.score });
      }
    }

    // Sort by best match
    compatibleRides.sort((a, b) => b.score - a.score);

    if (compatibleRides.length > 0) {
      const bestMatch = compatibleRides[0].ride;
      
      // Add rider to the shared ride
      bestMatch.riders.push(request);
      
      // Recalculate route and price
      await this.optimizeRoute(bestMatch);

      return {
        matchFound: true,
        ride: bestMatch,
        savings: this.calculateSavings(request, bestMatch),
        additionalTime: this.calculateAdditionalTime(request, bestMatch),
      };
    }

    // No match found, create new ride
    const newRide = await this.createSharedRide(request);
    
    return {
      matchFound: false,
      ride: newRide,
      savings: 0,
      additionalTime: 0,
    };
  }

  private async calculateCompatibility(
    request: RideRequest,
    ride: SharedRide
  ): Promise<{ compatible: boolean; score: number }> {
    // Check if routes are in similar direction
    const directionScore = this.calculateDirectionSimilarity(
      request.pickup,
      request.drop,
      ride.riders[0].pickup,
      ride.riders[0].drop
    );

    // Check if detour is acceptable
    const detourDistance = this.calculateDetour(request, ride);
    const detourAcceptable = detourDistance <= request.maxDetour;

    // Check if there's enough seats
    const seatsAvailable = 3 - ride.riders.reduce((sum, r) => sum + r.seats, 0);
    const seatsOk = seatsAvailable >= request.seats;

    // Check time compatibility
    const timeDiff = Math.abs(Date.now() - ride.riders[0].timestamp);
    const timeOk = timeDiff <= this.maxWaitTime;

    const compatible = detourAcceptable && seatsOk && timeOk && directionScore > 0.6;

    // Calculate overall score
    const score = directionScore * 0.5 + 
                  (detourAcceptable ? 0.3 : 0) +
                  (timeOk ? 0.2 : 0);

    return { compatible, score };
  }

  private calculateDirectionSimilarity(
    p1: { lat: number; lng: number },
    d1: { lat: number; lng: number },
    p2: { lat: number; lng: number },
    d2: { lat: number; lng: number }
  ): number {
    // Calculate angle between two routes
    const angle1 = Math.atan2(d1.lat - p1.lat, d1.lng - p1.lng);
    const angle2 = Math.atan2(d2.lat - p2.lat, d2.lng - p2.lng);
    
    const diff = Math.abs(angle1 - angle2);
    const normalizedDiff = Math.min(diff, 2 * Math.PI - diff);
    
    // Convert to similarity score (0-1)
    return 1 - (normalizedDiff / Math.PI);
  }

  private calculateDetour(request: RideRequest, ride: SharedRide): number {
    // Calculate additional distance if this rider is added
    // In production, use actual routing API
    const directDistance = this.calculateDistance(request.pickup, request.drop);
    return directDistance * this.maxDetourPercent;
  }

  private calculateDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
    // Haversine formula
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (p1.lat * Math.PI) / 180;
    const φ2 = (p2.lat * Math.PI) / 180;
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
    const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private async createSharedRide(request: RideRequest): Promise<SharedRide> {
    const ride: SharedRide = {
      id: `RIDE${Date.now()}`,
      driverId: '',
      route: [request.pickup, request.drop],
      riders: [request],
      status: 'searching',
      totalDistance: this.calculateDistance(request.pickup, request.drop),
      estimatedDuration: 0,
      pricePerPerson: 0,
    };

    this.activeRides.set(ride.id, ride);
    return ride;
  }

  private async optimizeRoute(ride: SharedRide): Promise<void> {
    // Optimize pickup and drop sequence to minimize total distance
    const points = [
      ...ride.riders.map(r => ({ type: 'pickup', rider: r, location: r.pickup })),
      ...ride.riders.map(r => ({ type: 'drop', rider: r, location: r.drop })),
    ];

    // Simple greedy optimization (in production, use proper TSP algorithm)
    const optimized = this.greedyTSP(points);
    
    ride.route = optimized.map(p => p.location);
    
    // Recalculate price per person
    const totalDistance = this.calculateTotalDistance(ride.route);
    const basePrice = totalDistance * 0.012; // ₹12 per km
    ride.pricePerPerson = basePrice / ride.riders.length;
  }

  private greedyTSP(points: any[]): any[] {
    if (points.length === 0) return [];

    const result = [points[0]];
    const remaining = points.slice(1);

    while (remaining.length > 0) {
      const current = result[result.length - 1];
      let nearest = 0;
      let minDist = Infinity;

      remaining.forEach((point, idx) => {
        const dist = this.calculateDistance(current.location, point.location);
        if (dist < minDist) {
          minDist = dist;
          nearest = idx;
        }
      });

      result.push(remaining[nearest]);
      remaining.splice(nearest, 1);
    }

    return result;
  }

  private calculateTotalDistance(route: { lat: number; lng: number }[]): number {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
      total += this.calculateDistance(route[i], route[i + 1]);
    }
    return total;
  }

  private calculateSavings(request: RideRequest, ride: SharedRide): number {
    // Calculate how much user saves by sharing
    const soloPrice = 150; // Average solo ride price
    return soloPrice - ride.pricePerPerson;
  }

  private calculateAdditionalTime(request: RideRequest, ride: SharedRide): number {
    // Estimate additional time due to shared ride (in minutes)
    return ride.riders.length * 3; // ~3 min per additional passenger
  }

  // Cancel ride share request
  async cancelRequest(requestId: string): Promise<void> {
    this.activeRequests.delete(requestId);
  }

  // Get active shared rides for a user
  async getUserActiveRides(userId: string): Promise<SharedRide[]> {
    const rides: SharedRide[] = [];
    
    for (const [_, ride] of this.activeRides) {
      if (ride.riders.some(r => r.userId === userId)) {
        rides.push(ride);
      }
    }
    
    return rides;
  }

  // Split payment among riders
  async splitPayment(rideId: string, totalAmount: number): Promise<Map<string, number>> {
    const ride = this.activeRides.get(rideId);
    if (!ride) throw new Error('Ride not found');

    const distribution = new Map<string, number>();
    const amountPerPerson = totalAmount / ride.riders.length;

    ride.riders.forEach(rider => {
      distribution.set(rider.userId, amountPerPerson);
    });

    return distribution;
  }
}

export const rideShareService = new RideShareService();
export type { RideRequest, SharedRide, MatchResult };
