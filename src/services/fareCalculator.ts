// Advanced Fare Calculator with Dynamic Pricing
interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeFare: number;
  platformFee: number;
  gst: number;
  total: number;
  discount: number;
  finalAmount: number;
  estimatedDuration: string;
  distance: string;
}

interface PricingConfig {
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  platformFeePercent: number;
  gstPercent: number;
  minimumFare: number;
  nightChargeMultiplier: number; // 11 PM - 6 AM
  peakHourMultiplier: number; // 8-10 AM, 6-8 PM
  rainSurgeMultiplier: number;
  festivalSurgeMultiplier: number;
}

class FareCalculator {
  private config: PricingConfig = {
    baseFare: 30,
    perKmRate: 12,
    perMinuteRate: 1.5,
    platformFeePercent: 5,
    gstPercent: 5,
    minimumFare: 50,
    nightChargeMultiplier: 1.5,
    peakHourMultiplier: 1.3,
    rainSurgeMultiplier: 1.2,
    festivalSurgeMultiplier: 1.5,
  };

  calculateFare(
    distanceInMeters: number,
    durationInSeconds: number,
    options: {
      isRaining?: boolean;
      isFestivalSeason?: boolean;
      discountPercent?: number;
      promoCode?: string;
    } = {}
  ): FareBreakdown {
    const distanceKm = distanceInMeters / 1000;
    const durationMinutes = durationInSeconds / 60;

    // Base calculations
    const baseFare = this.config.baseFare;
    const distanceFare = distanceKm * this.config.perKmRate;
    const timeFare = durationMinutes * this.config.perMinuteRate;

    // Apply surge pricing
    let surgeMultiplier = 1;
    
    // Night charges
    if (this.isNightTime()) {
      surgeMultiplier *= this.config.nightChargeMultiplier;
    }

    // Peak hour charges
    if (this.isPeakHour()) {
      surgeMultiplier *= this.config.peakHourMultiplier;
    }

    // Weather surge
    if (options.isRaining) {
      surgeMultiplier *= this.config.rainSurgeMultiplier;
    }

    // Festival surge
    if (options.isFestivalSeason) {
      surgeMultiplier *= this.config.festivalSurgeMultiplier;
    }

    const surgeFare = (baseFare + distanceFare + timeFare) * (surgeMultiplier - 1);
    const subtotal = baseFare + distanceFare + timeFare + surgeFare;

    // Platform fee and GST
    const platformFee = subtotal * (this.config.platformFeePercent / 100);
    const gst = (subtotal + platformFee) * (this.config.gstPercent / 100);

    let total = subtotal + platformFee + gst;

    // Apply minimum fare
    if (total < this.config.minimumFare) {
      total = this.config.minimumFare;
    }

    // Apply discount
    const discount = options.discountPercent 
      ? total * (options.discountPercent / 100)
      : 0;

    const finalAmount = Math.round(total - discount);

    return {
      baseFare: Math.round(baseFare),
      distanceFare: Math.round(distanceFare),
      timeFare: Math.round(timeFare),
      surgeFare: Math.round(surgeFare),
      platformFee: Math.round(platformFee),
      gst: Math.round(gst),
      total: Math.round(total),
      discount: Math.round(discount),
      finalAmount,
      estimatedDuration: this.formatDuration(durationInSeconds),
      distance: this.formatDistance(distanceInMeters),
    };
  }

  private isNightTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 23 || hour < 6;
  }

  private isPeakHour(): boolean {
    const hour = new Date().getHours();
    return (hour >= 8 && hour < 10) || (hour >= 18 && hour < 20);
  }

  private formatDistance(meters: number): string {
    const km = meters / 1000;
    return km < 1 ? `${Math.round(meters)} m` : `${km.toFixed(1)} km`;
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  getSurgeMessage(): string | null {
    if (this.isNightTime()) {
      return '🌙 Night charges apply (11 PM - 6 AM)';
    }
    if (this.isPeakHour()) {
      return '⚡ Peak hour surge pricing active';
    }
    return null;
  }

  estimateFareRange(distanceInMeters: number): { min: number; max: number } {
    const avgSpeed = 20; // km/h in city traffic
    const durationSeconds = (distanceInMeters / 1000 / avgSpeed) * 3600;

    const normalFare = this.calculateFare(distanceInMeters, durationSeconds);
    const surgeFare = this.calculateFare(distanceInMeters, durationSeconds, {
      isRaining: true,
      isFestivalSeason: true,
    });

    return {
      min: normalFare.finalAmount,
      max: surgeFare.finalAmount,
    };
  }
}

export const fareCalculator = new FareCalculator();
export type { FareBreakdown, PricingConfig };
