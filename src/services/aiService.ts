// Advanced AI/ML Service for Predictive Analytics & Smart Features
interface PredictionModel {
  demandPrediction: number; // Predicted demand (0-1 scale)
  surgePrediction: number; // Predicted surge multiplier
  etaPrediction: number; // Predicted ETA in seconds
  confidence: number; // Model confidence (0-1)
}

interface TrafficData {
  currentSpeed: number; // km/h
  expectedSpeed: number; // km/h
  congestionLevel: 'low' | 'medium' | 'high' | 'severe';
  incidents: Array<{
    type: 'accident' | 'construction' | 'weather';
    location: { lat: number; lng: number };
    severity: number;
  }>;
}

interface UserBehaviorProfile {
  frequentLocations: Array<{ lat: number; lng: number; frequency: number; name: string }>;
  preferredTimes: Array<{ hour: number; dayOfWeek: number; frequency: number }>;
  averageRideDistance: number;
  preferredPaymentMethod: string;
  pricesensitivity: 'low' | 'medium' | 'high';
}

class AIService {
  private historicalData: any[] = [];
  private userProfiles: Map<string, UserBehaviorProfile> = new Map();

  // Demand Prediction using time-series analysis
  async predictDemand(location: { lat: number; lng: number }, time: Date): Promise<PredictionModel> {
    const hour = time.getHours();
    const dayOfWeek = time.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);

    // Simple heuristic model (in production, use ML model)
    let demandScore = 0.5;

    if (isRushHour) demandScore += 0.3;
    if (!isWeekend) demandScore += 0.1;
    if (hour >= 22 || hour <= 5) demandScore -= 0.2;

    // Location-based adjustment
    const isCommercialArea = await this.isCommercialArea(location);
    if (isCommercialArea) demandScore += 0.2;

    const surgePrediction = 1 + Math.max(0, demandScore - 0.5) * 0.5;

    return {
      demandPrediction: Math.min(1, Math.max(0, demandScore)),
      surgePrediction,
      etaPrediction: this.calculatePredictedETA(location, demandScore),
      confidence: 0.85,
    };
  }

  private async isCommercialArea(location: { lat: number; lng: number }): Promise<boolean> {
    // Check if location is in commercial/business district
    // In production, use Google Places API or local database
    const commercialAreas = [
      { lat: 17.385044, lng: 78.486671, radius: 2000, name: 'Hitech City' },
      { lat: 17.440304, lng: 78.448502, radius: 2000, name: 'Banjara Hills' },
      { lat: 17.366, lng: 78.476, radius: 1500, name: 'Gachibowli' },
    ];

    return commercialAreas.some(area => {
      const distance = this.calculateDistance(location, area);
      return distance <= area.radius;
    });
  }

  private calculateDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
    const R = 6371e3;
    const φ1 = (p1.lat * Math.PI) / 180;
    const φ2 = (p2.lat * Math.PI) / 180;
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
    const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Smart ETA calculation with ML
  private calculatePredictedETA(location: { lat: number; lng: number }, demand: number): number {
    // Base ETA (in seconds)
    let eta = 300; // 5 minutes base

    // Adjust based on demand
    eta += demand * 180; // Up to 3 more minutes in high demand

    // Time of day adjustment
    const hour = new Date().getHours();
    if (hour >= 8 && hour <= 10) eta += 120; // Morning rush
    if (hour >= 17 && hour <= 20) eta += 180; // Evening rush

    return Math.round(eta);
  }

  // Real-time traffic prediction
  async predictTraffic(route: { lat: number; lng: number }[]): Promise<TrafficData> {
    const currentTime = new Date();
    const hour = currentTime.getHours();

    let congestionLevel: 'low' | 'medium' | 'high' | 'severe' = 'low';
    let currentSpeed = 40; // km/h default
    let expectedSpeed = 40;

    // Rush hour congestion
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
      congestionLevel = 'high';
      currentSpeed = 15;
      expectedSpeed = 25;
    } else if (hour >= 11 && hour <= 16) {
      congestionLevel = 'medium';
      currentSpeed = 25;
      expectedSpeed = 35;
    } else {
      currentSpeed = 40;
      expectedSpeed = 45;
    }

    return {
      currentSpeed,
      expectedSpeed,
      congestionLevel,
      incidents: [], // Fetch from external API in production
    };
  }

  // User behavior learning
  async analyzeUserBehavior(userId: string, rideHistory: any[]): Promise<UserBehaviorProfile> {
    const profile: UserBehaviorProfile = {
      frequentLocations: [],
      preferredTimes: [],
      averageRideDistance: 0,
      preferredPaymentMethod: 'cash',
      pricesensitivity: 'medium',
    };

    if (rideHistory.length === 0) return profile;

    // Analyze frequent locations
    const locationMap = new Map<string, { count: number; location: any }>();
    
    rideHistory.forEach(ride => {
      const key = `${ride.pickup.lat.toFixed(3)},${ride.pickup.lng.toFixed(3)}`;
      const existing = locationMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        locationMap.set(key, { count: 1, location: ride.pickup });
      }
    });

    profile.frequentLocations = Array.from(locationMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({
        ...item.location,
        frequency: item.count / rideHistory.length,
        name: item.location.address || 'Unknown',
      }));

    // Analyze preferred times
    const timeMap = new Map<string, number>();
    rideHistory.forEach(ride => {
      const time = new Date(ride.timestamp);
      const key = `${time.getHours()}-${time.getDay()}`;
      timeMap.set(key, (timeMap.get(key) || 0) + 1);
    });

    profile.preferredTimes = Array.from(timeMap.entries())
      .map(([key, count]) => {
        const [hour, day] = key.split('-').map(Number);
        return { hour, dayOfWeek: day, frequency: count / rideHistory.length };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3);

    // Calculate average distance
    const totalDistance = rideHistory.reduce((sum, ride) => sum + (ride.distance || 0), 0);
    profile.averageRideDistance = totalDistance / rideHistory.length;

    // Determine price sensitivity
    const highFareRides = rideHistory.filter(ride => ride.fare > profile.averageRideDistance * 15).length;
    const sensitivity = highFareRides / rideHistory.length;
    
    if (sensitivity < 0.2) profile.pricesensitivity = 'high';
    else if (sensitivity < 0.5) profile.pricesensitivity = 'medium';
    else profile.pricesensitivity = 'low';

    this.userProfiles.set(userId, profile);
    return profile;
  }

  // Smart destination prediction
  async predictDestination(userId: string, currentLocation: { lat: number; lng: number }, time: Date): Promise<Array<{ location: any; probability: number }>> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    const hour = time.getHours();
    const dayOfWeek = time.getDay();

    // Score each frequent location
    const predictions = profile.frequentLocations.map(loc => {
      let score = loc.frequency; // Base score

      // Time-based adjustment
      const matchingTimes = profile.preferredTimes.filter(
        t => Math.abs(t.hour - hour) <= 1 && t.dayOfWeek === dayOfWeek
      );
      if (matchingTimes.length > 0) {
        score *= 1.5;
      }

      // Distance from current location (prefer closer locations)
      const distance = this.calculateDistance(currentLocation, loc);
      if (distance < 1000) score *= 0.5; // Too close, unlikely
      if (distance > 20000) score *= 0.7; // Very far

      return {
        location: loc,
        probability: Math.min(1, score),
      };
    });

    return predictions.sort((a, b) => b.probability - a.probability).slice(0, 3);
  }

  // Optimal pricing recommendation
  async recommendOptimalPrice(
    distance: number,
    duration: number,
    demand: number,
    userProfile?: UserBehaviorProfile
  ): Promise<{ basePrice: number; recommendedPrice: number; acceptanceProbability: number }> {
    const basePrice = 30 + distance * 0.012 + duration * 0.001;
    let recommendedPrice = basePrice;

    // Demand-based adjustment
    recommendedPrice *= (1 + demand * 0.3);

    // User sensitivity adjustment
    if (userProfile) {
      if (userProfile.pricesensitivity === 'high') {
        recommendedPrice *= 0.95; // 5% discount for price-sensitive users
      } else if (userProfile.pricesensitivity === 'low') {
        recommendedPrice *= 1.05; // 5% premium for less sensitive users
      }
    }

    // Calculate acceptance probability
    let acceptanceProbability = 0.8;
    const priceIncrease = (recommendedPrice - basePrice) / basePrice;
    acceptanceProbability -= priceIncrease * 0.5;

    return {
      basePrice: Math.round(basePrice),
      recommendedPrice: Math.round(recommendedPrice),
      acceptanceProbability: Math.max(0.1, Math.min(0.95, acceptanceProbability)),
    };
  }

  // Driver matching algorithm with ML
  async findOptimalDriver(
    rideRequest: any,
    availableDrivers: Array<{
      id: string;
      location: { lat: number; lng: number };
      rating: number;
      completedRides: number;
      acceptanceRate: number;
    }>
  ): Promise<Array<{ driverId: string; score: number; eta: number }>> {
    return availableDrivers.map(driver => {
      let score = 0;

      // Distance score (closer is better)
      const distance = this.calculateDistance(driver.location, rideRequest.pickup);
      const distanceScore = Math.max(0, 1 - distance / 5000); // Within 5km
      score += distanceScore * 0.4;

      // Rating score
      const ratingScore = driver.rating / 5;
      score += ratingScore * 0.3;

      // Experience score
      const experienceScore = Math.min(1, driver.completedRides / 1000);
      score += experienceScore * 0.15;

      // Acceptance rate score
      score += driver.acceptanceRate * 0.15;

      // Calculate ETA
      const eta = Math.round((distance / 1000 / 20) * 3600); // Assuming 20 km/h average

      return {
        driverId: driver.id,
        score,
        eta,
      };
    }).sort((a, b) => b.score - a.score);
  }

  // Fraud detection
  async detectFraudulentActivity(
    userId: string,
    rideData: any
  ): Promise<{ isFraudulent: boolean; confidence: number; reasons: string[] }> {
    const reasons: string[] = [];
    let fraudScore = 0;

    // Check for unusual patterns
    const profile = this.userProfiles.get(userId);
    
    if (profile) {
      // Unusual time
      const hour = new Date().getHours();
      const isUsualTime = profile.preferredTimes.some(t => Math.abs(t.hour - hour) <= 2);
      if (!isUsualTime && (hour >= 1 && hour <= 5)) {
        fraudScore += 0.2;
        reasons.push('Unusual booking time');
      }

      // Unusual distance
      if (rideData.distance > profile.averageRideDistance * 3) {
        fraudScore += 0.15;
        reasons.push('Unusually long distance');
      }
    }

    // Multiple cancellations in short time
    // Check payment method changes
    // Location spoofing detection

    return {
      isFraudulent: fraudScore > 0.5,
      confidence: fraudScore,
      reasons,
    };
  }

  // Smart notification timing
  async getOptimalNotificationTime(userId: string): Promise<Date> {
    const profile = this.userProfiles.get(userId);
    if (!profile || profile.preferredTimes.length === 0) {
      // Default: 9 AM
      const defaultTime = new Date();
      defaultTime.setHours(9, 0, 0, 0);
      return defaultTime;
    }

    // Find most frequent time
    const mostFrequentTime = profile.preferredTimes[0];
    const optimalTime = new Date();
    optimalTime.setHours(mostFrequentTime.hour - 1, 0, 0, 0); // 1 hour before usual time

    return optimalTime;
  }

  // Route quality scoring
  async scoreRoute(route: { lat: number; lng: number }[]): Promise<{
    safetyScore: number;
    comfortScore: number;
    speedScore: number;
    overallScore: number;
  }> {
    // In production, consider:
    // - Road quality data
    // - Crime statistics
    // - Historical accident data
    // - Traffic patterns
    // - Street lighting
    
    return {
      safetyScore: 0.85,
      comfortScore: 0.80,
      speedScore: 0.75,
      overallScore: 0.80,
    };
  }
}

export const aiService = new AIService();
export type { PredictionModel, TrafficData, UserBehaviorProfile };
