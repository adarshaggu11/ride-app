// Ride Distance Validation Utility

export interface Coordinates {
  lat: number;
  lng: number;
}

export type RideType = 'bike' | 'auto' | 'car';

// Distance limits in kilometers for each vehicle type
export const RIDE_LIMITS: Record<RideType, number> = {
  bike: 35,   // km - Short distance rides
  auto: 45,   // km - Medium distance rides
  car: 60,    // km - Long distance rides
};

// Display names for vehicle types
export const VEHICLE_NAMES: Record<RideType, string> = {
  bike: 'Bike',
  auto: 'Auto',
  car: 'Car',
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

/**
 * Calculate distance between two coordinate objects
 */
export function getDistanceBetweenPoints(
  pickup: Coordinates,
  drop: Coordinates
): number {
  return calculateDistance(pickup.lat, pickup.lng, drop.lat, drop.lng);
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  distance: number;
  maxLimit?: number;
  exceedsBy?: number;
}

/**
 * Validate if ride distance is within allowed limits
 * @param type - Vehicle type (bike, auto, car)
 * @param pickup - Pickup location coordinates
 * @param drop - Drop location coordinates
 * @returns Validation result with status and message
 */
export function validateRideDistance(
  type: RideType,
  pickup: Coordinates,
  drop: Coordinates
): ValidationResult {
  const distance = getDistanceBetweenPoints(pickup, drop);
  const maxLimit = RIDE_LIMITS[type];
  const vehicleName = VEHICLE_NAMES[type];

  // Check if distance is too small (less than 1 km)
  if (distance < 1) {
    return {
      status: 'warning',
      message: `Ride distance (${distance.toFixed(2)} km) is too short. Consider walking or using a shorter route.`,
      distance,
      maxLimit,
    };
  }

  // Check if distance exceeds limit
  if (distance > maxLimit) {
    const exceedsBy = distance - maxLimit;
    return {
      status: 'error',
      message: `Ride distance (${distance.toFixed(1)} km) exceeds the allowed limit of ${maxLimit} km for ${vehicleName} rides. Try a different vehicle or split the journey.`,
      distance,
      maxLimit,
      exceedsBy,
    };
  }

  // Warning if close to limit (within 5 km)
  if (distance > maxLimit - 5) {
    return {
      status: 'warning',
      message: `Ride distance: ${distance.toFixed(1)} km (Near ${vehicleName} limit of ${maxLimit} km)`,
      distance,
      maxLimit,
    };
  }

  // Success
  return {
    status: 'success',
    message: `Ride accepted. Total distance: ${distance.toFixed(1)} km`,
    distance,
    maxLimit,
  };
}

/**
 * Get suggested vehicle types based on distance
 * @param distance - Distance in kilometers
 * @returns Array of suitable vehicle types
 */
export function getSuggestedVehicles(distance: number): RideType[] {
  const suitable: RideType[] = [];

  if (distance <= RIDE_LIMITS.bike) {
    suitable.push('bike');
  }
  if (distance <= RIDE_LIMITS.auto) {
    suitable.push('auto');
  }
  if (distance <= RIDE_LIMITS.car) {
    suitable.push('car');
  }

  return suitable;
}

/**
 * Get all vehicle options with distance validation
 * @param pickup - Pickup location
 * @param drop - Drop location
 * @returns Array of vehicles with validation status
 */
export function getVehicleOptionsWithValidation(
  pickup: Coordinates,
  drop: Coordinates
) {
  const distance = getDistanceBetweenPoints(pickup, drop);
  const vehicles: RideType[] = ['bike', 'auto', 'car'];

  return vehicles.map((type) => {
    const validation = validateRideDistance(type, pickup, drop);
    return {
      type,
      name: VEHICLE_NAMES[type],
      limit: RIDE_LIMITS[type],
      distance,
      isAllowed: validation.status !== 'error',
      validation,
    };
  });
}

/**
 * Format distance for display
 * @param distance - Distance in kilometers
 * @returns Formatted string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

/**
 * Estimate ride duration based on distance and vehicle type
 * @param distance - Distance in kilometers
 * @param type - Vehicle type
 * @returns Estimated duration in minutes
 */
export function estimateRideDuration(distance: number, type: RideType): number {
  // Average speeds in km/h
  const speeds: Record<RideType, number> = {
    bike: 35,   // Faster in traffic
    auto: 30,   // Moderate speed
    car: 40,    // Faster on highways
  };

  const speed = speeds[type];
  const hours = distance / speed;
  return Math.round(hours * 60); // Convert to minutes
}

/**
 * Check if current time is peak hours for surge pricing
 * @returns Surge multiplier (1.0 for normal, 1.5 for peak hours)
 */
export function getSurgeMultiplier(): number {
  const hour = new Date().getHours();
  // Peak hours: 8-10 AM and 6-9 PM
  const isPeakHours = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21);
  return isPeakHours ? 1.5 : 1.0;
}

/**
 * Get surge pricing status
 * @returns Object with surge details
 */
export function getSurgeStatus(): { isActive: boolean; multiplier: number; message: string } {
  const multiplier = getSurgeMultiplier();
  const isActive = multiplier > 1.0;
  
  return {
    isActive,
    multiplier,
    message: isActive 
      ? `🔥 Peak hours - ${((multiplier - 1) * 100).toFixed(0)}% surge pricing active`
      : '✅ Normal pricing'
  };
}

/**
 * Calculate fare based on distance and vehicle type with surge pricing
 * @param distance - Distance in kilometers
 * @param type - Vehicle type
 * @param applySurge - Whether to apply surge pricing (default: true)
 * @returns Fare in rupees
 */
export function calculateFare(
  distance: number, 
  type: RideType, 
  applySurge: boolean = true
): number {
  // Base fare + per km rate + minimum fare
  const pricing: Record<RideType, { base: number; perKm: number; min: number }> = {
    bike: { base: 20, perKm: 8, min: 30 },
    auto: { base: 30, perKm: 12, min: 40 },
    car: { base: 50, perKm: 15, min: 80 },
  };

  const { base, perKm, min } = pricing[type];
  
  // Apply surge pricing if enabled
  const surgeMultiplier = applySurge ? getSurgeMultiplier() : 1.0;
  
  const calculatedFare = base + (distance * perKm * surgeMultiplier);
  
  // Ensure minimum fare
  return Math.round(Math.max(calculatedFare, min));
}

/**
 * Validate if pickup location is within acceptable range from user's current location
 * @param userLocation - User's current GPS location
 * @param pickupLocation - Selected pickup location
 * @param maxDistanceKm - Maximum acceptable distance (default: 2 km)
 * @returns Validation result with warning message if applicable
 */
export function validatePickupProximity(
  userLocation: Coordinates,
  pickupLocation: Coordinates,
  maxDistanceKm: number = 2
): { isValid: boolean; distance: number; warning?: string } {
  const distance = getDistanceBetweenPoints(userLocation, pickupLocation);
  
  if (distance > maxDistanceKm) {
    return {
      isValid: false,
      distance,
      warning: `⚠️ Your selected pickup is ${distance.toFixed(1)} km from your current location. Please confirm or adjust.`
    };
  }
  
  return {
    isValid: true,
    distance
  };
}
