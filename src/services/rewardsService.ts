// Rewards & Loyalty Program Service
interface UserRewards {
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalRides: number;
  cashback: number;
  referralCode: string;
  referralCount: number;
}

interface Reward {
  id: string;
  type: 'discount' | 'cashback' | 'freeride' | 'upgrade';
  name: string;
  description: string;
  pointsCost: number;
  value: number;
  expiryDays: number;
  icon: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  total: number;
}

class RewardsService {
  private tiers = {
    bronze: { minRides: 0, multiplier: 1, color: '#CD7F32' },
    silver: { minRides: 50, multiplier: 1.2, color: '#C0C0C0' },
    gold: { minRides: 100, multiplier: 1.5, color: '#FFD700' },
    platinum: { minRides: 200, multiplier: 2, color: '#E5E4E2' },
  };

  private availableRewards: Reward[] = [
    {
      id: 'discount50',
      type: 'discount',
      name: '₹50 Off',
      description: 'Get ₹50 discount on your next ride',
      pointsCost: 500,
      value: 50,
      expiryDays: 30,
      icon: '🎫',
    },
    {
      id: 'discount100',
      type: 'discount',
      name: '₹100 Off',
      description: 'Get ₹100 discount on your next ride',
      pointsCost: 900,
      value: 100,
      expiryDays: 30,
      icon: '🎟️',
    },
    {
      id: 'cashback20',
      type: 'cashback',
      name: '20% Cashback',
      description: 'Get 20% cashback on your next ride',
      pointsCost: 700,
      value: 20,
      expiryDays: 15,
      icon: '💰',
    },
    {
      id: 'freeride',
      type: 'freeride',
      name: 'Free Ride',
      description: 'Get one free ride up to ₹150',
      pointsCost: 1500,
      value: 150,
      expiryDays: 30,
      icon: '🚗',
    },
  ];

  // Get user rewards data
  async getUserRewards(userId: string): Promise<UserRewards> {
    const stored = localStorage.getItem(`rewards_${userId}`);
    
    if (stored) {
      return JSON.parse(stored);
    }

    // Create new rewards profile
    const newRewards: UserRewards = {
      userId,
      points: 0,
      tier: 'bronze',
      totalRides: 0,
      cashback: 0,
      referralCode: this.generateReferralCode(userId),
      referralCount: 0,
    };

    this.saveUserRewards(newRewards);
    return newRewards;
  }

  private saveUserRewards(rewards: UserRewards): void {
    localStorage.setItem(`rewards_${rewards.userId}`, JSON.stringify(rewards));
  }

  // Award points after ride completion
  async awardPoints(userId: string, rideAmount: number): Promise<number> {
    const rewards = await this.getUserRewards(userId);
    
    // Base points: 10 points per ₹100 spent
    let points = Math.floor(rideAmount / 10);
    
    // Apply tier multiplier
    const tier = this.tiers[rewards.tier];
    points = Math.floor(points * tier.multiplier);
    
    // Bonus for milestones
    if ((rewards.totalRides + 1) % 10 === 0) {
      points += 100; // Bonus for every 10 rides
    }
    
    rewards.points += points;
    rewards.totalRides += 1;
    
    // Check for tier upgrade
    rewards.tier = this.calculateTier(rewards.totalRides);
    
    this.saveUserRewards(rewards);
    
    return points;
  }

  private calculateTier(totalRides: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (totalRides >= 200) return 'platinum';
    if (totalRides >= 100) return 'gold';
    if (totalRides >= 50) return 'silver';
    return 'bronze';
  }

  // Redeem reward
  async redeemReward(userId: string, rewardId: string): Promise<{ success: boolean; code?: string; message: string }> {
    const rewards = await this.getUserRewards(userId);
    const reward = this.availableRewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return { success: false, message: 'Reward not found' };
    }
    
    if (rewards.points < reward.pointsCost) {
      return { success: false, message: 'Insufficient points' };
    }
    
    // Deduct points
    rewards.points -= reward.pointsCost;
    this.saveUserRewards(rewards);
    
    // Generate reward code
    const code = this.generateRewardCode(reward);
    
    // Store redeemed reward
    this.storeRedeemedReward(userId, reward, code);
    
    return {
      success: true,
      code,
      message: `Successfully redeemed ${reward.name}!`,
    };
  }

  private generateRewardCode(reward: Reward): string {
    return `${reward.type.toUpperCase()}${Date.now().toString(36).toUpperCase()}`;
  }

  private storeRedeemedReward(userId: string, reward: Reward, code: string): void {
    const redeemed = this.getRedeemedRewards(userId);
    redeemed.push({
      ...reward,
      code,
      redeemedAt: Date.now(),
      expiresAt: Date.now() + reward.expiryDays * 24 * 60 * 60 * 1000,
      used: false,
    });
    localStorage.setItem(`redeemed_rewards_${userId}`, JSON.stringify(redeemed));
  }

  private getRedeemedRewards(userId: string): any[] {
    const stored = localStorage.getItem(`redeemed_rewards_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Referral system
  private generateReferralCode(userId: string): string {
    return `MANA${userId.slice(0, 6).toUpperCase()}`;
  }

  async applyReferralCode(userId: string, referralCode: string): Promise<{ success: boolean; bonus: number; message: string }> {
    // Verify referral code exists
    const referrer = this.findUserByReferralCode(referralCode);
    
    if (!referrer) {
      return { success: false, bonus: 0, message: 'Invalid referral code' };
    }
    
    if (referrer === userId) {
      return { success: false, bonus: 0, message: 'Cannot use your own referral code' };
    }
    
    // Check if already used referral
    const hasUsedReferral = localStorage.getItem(`referral_used_${userId}`);
    if (hasUsedReferral) {
      return { success: false, bonus: 0, message: 'Referral already used' };
    }
    
    // Award bonus to both users
    const referrerRewards = await this.getUserRewards(referrer);
    const newUserRewards = await this.getUserRewards(userId);
    
    const referralBonus = 200; // 200 points for both
    
    referrerRewards.points += referralBonus;
    referrerRewards.referralCount += 1;
    referrerRewards.cashback += 50; // ₹50 cashback
    
    newUserRewards.points += referralBonus;
    newUserRewards.cashback += 50;
    
    this.saveUserRewards(referrerRewards);
    this.saveUserRewards(newUserRewards);
    
    localStorage.setItem(`referral_used_${userId}`, 'true');
    
    return {
      success: true,
      bonus: referralBonus,
      message: 'Referral applied! You both got 200 points and ₹50 cashback!',
    };
  }

  private findUserByReferralCode(code: string): string | null {
    // In production, query backend
    // For demo, extract userId from code
    return code.replace('MANA', '').toLowerCase();
  }

  // Achievements system
  async getAchievements(userId: string): Promise<Achievement[]> {
    const rewards = await this.getUserRewards(userId);
    
    return [
      {
        id: 'first_ride',
        name: 'First Ride',
        description: 'Complete your first ride',
        icon: '🚀',
        points: 50,
        unlocked: rewards.totalRides >= 1,
        progress: Math.min(rewards.totalRides, 1),
        total: 1,
      },
      {
        id: 'regular_rider',
        name: 'Regular Rider',
        description: 'Complete 10 rides',
        icon: '⭐',
        points: 100,
        unlocked: rewards.totalRides >= 10,
        progress: Math.min(rewards.totalRides, 10),
        total: 10,
      },
      {
        id: 'frequent_flyer',
        name: 'Frequent Flyer',
        description: 'Complete 50 rides',
        icon: '🏆',
        points: 500,
        unlocked: rewards.totalRides >= 50,
        progress: Math.min(rewards.totalRides, 50),
        total: 50,
      },
      {
        id: 'century_club',
        name: 'Century Club',
        description: 'Complete 100 rides',
        icon: '💯',
        points: 1000,
        unlocked: rewards.totalRides >= 100,
        progress: Math.min(rewards.totalRides, 100),
        total: 100,
      },
      {
        id: 'referral_master',
        name: 'Referral Master',
        description: 'Refer 5 friends',
        icon: '🎁',
        points: 500,
        unlocked: rewards.referralCount >= 5,
        progress: Math.min(rewards.referralCount, 5),
        total: 5,
      },
    ];
  }

  // Subscription plans
  async getSubscriptionPlans(): Promise<any[]> {
    return [
      {
        id: 'weekly',
        name: 'Weekly Pass',
        price: 299,
        duration: 7,
        benefits: ['10% off all rides', 'Priority support', 'No surge pricing'],
        savings: '₹150+',
      },
      {
        id: 'monthly',
        name: 'Monthly Pass',
        price: 999,
        duration: 30,
        benefits: ['15% off all rides', 'Priority matching', 'No surge pricing', 'Free ride share'],
        savings: '₹500+',
        popular: true,
      },
      {
        id: 'yearly',
        name: 'Yearly Pass',
        price: 9999,
        duration: 365,
        benefits: ['20% off all rides', 'VIP support', 'No surge pricing', 'Unlimited ride share', 'Free monthly ride'],
        savings: '₹5000+',
      },
    ];
  }

  getAvailableRewards(): Reward[] {
    return this.availableRewards;
  }

  getTierInfo(tier: 'bronze' | 'silver' | 'gold' | 'platinum') {
    return this.tiers[tier];
  }
}

export const rewardsService = new RewardsService();
export type { UserRewards, Reward, Achievement };
