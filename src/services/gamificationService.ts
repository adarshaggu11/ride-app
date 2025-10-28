// Advanced Gamification Service for User Engagement
interface Quest {
  id: string;
  title: string;
  titleTe: string; // Telugu translation
  description: string;
  descriptionTe: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  objective: {
    action: string; // 'complete_rides', 'share_rides', 'refer_friends', etc.
    target: number;
    current: number;
  };
  rewards: {
    points: number;
    cashback?: number;
    badge?: string;
    discount?: number;
  };
  expiresAt: Date;
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  category: 'rides' | 'distance' | 'savings' | 'referrals';
  entries: Array<{
    rank: number;
    userId: string;
    username: string;
    avatar: string;
    score: number;
    change: number; // Rank change from previous period
  }>;
  userRank?: number;
}

interface StreakInfo {
  current: number; // Current streak days
  longest: number; // Longest streak ever
  multiplier: number; // Bonus multiplier for maintaining streak
  nextMilestone: { days: number; reward: string };
}

class GamificationService {
  // Quest system
  async getActiveQuests(userId: string): Promise<Quest[]> {
    const now = new Date();
    
    return [
      {
        id: 'daily_commute',
        title: 'Daily Commuter',
        titleTe: 'రోజువారీ ప్రయాణికుడు',
        description: 'Complete 2 rides today',
        descriptionTe: 'ఈరోజు 2 రైడ్లు పూర్తి చేయండి',
        type: 'daily',
        objective: {
          action: 'complete_rides',
          target: 2,
          current: 1,
        },
        rewards: {
          points: 50,
          cashback: 20,
        },
        expiresAt: new Date(now.setHours(23, 59, 59)),
        completed: false,
      },
      {
        id: 'weekend_warrior',
        title: 'Weekend Warrior',
        titleTe: 'వారాంతపు యోధుడు',
        description: 'Take 5 rides this weekend',
        descriptionTe: 'ఈ వారాంతంలో 5 రైడ్లు తీసుకోండి',
        type: 'weekly',
        objective: {
          action: 'complete_rides',
          target: 5,
          current: 2,
        },
        rewards: {
          points: 200,
          badge: 'weekend_warrior',
          discount: 15,
        },
        expiresAt: new Date(now.setDate(now.getDate() + 2)),
        completed: false,
      },
      {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        titleTe: 'సామాజిక సీతాకోకచిలుక',
        description: 'Share 3 rides with friends',
        descriptionTe: '3 రైడ్లు స్నేహితులతో పంచుకోండి',
        type: 'weekly',
        objective: {
          action: 'share_rides',
          target: 3,
          current: 0,
        },
        rewards: {
          points: 150,
          cashback: 50,
        },
        expiresAt: new Date(now.setDate(now.getDate() + 5)),
        completed: false,
      },
      {
        id: 'eco_warrior',
        title: 'Eco Warrior',
        titleTe: 'పర్యావరణ యోధుడు',
        description: 'Save 500kg CO2 by sharing rides',
        descriptionTe: 'రైడ్లు పంచుకోవడం ద్వారా 500kg CO2 ఆదా చేయండి',
        type: 'monthly',
        objective: {
          action: 'carbon_saved',
          target: 500,
          current: 245,
        },
        rewards: {
          points: 1000,
          badge: 'eco_warrior',
          cashback: 200,
        },
        expiresAt: new Date(now.setMonth(now.getMonth() + 1)),
        completed: false,
      },
    ];
  }

  // Badge system
  async getUserBadges(userId: string): Promise<Badge[]> {
    return [
      {
        id: 'first_ride',
        name: 'First Ride',
        nameTe: 'మొదటి రైడ్',
        description: 'Completed your first ride',
        descriptionTe: 'మీ మొదటి రైడ్ పూర్తి చేసారు',
        icon: '🚀',
        rarity: 'common',
        unlockedAt: new Date('2024-10-01'),
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        nameTe: 'రాత్రి గుడ్లగూబ',
        description: 'Took 10 rides after midnight',
        descriptionTe: 'అర్ధరాత్రి తర్వాత 10 రైడ్లు తీసుకున్నారు',
        icon: '🦉',
        rarity: 'rare',
        unlockedAt: new Date('2024-10-15'),
      },
      {
        id: 'explorer',
        name: 'City Explorer',
        nameTe: 'నగర అన్వేషకుడు',
        description: 'Visited 50 unique locations',
        descriptionTe: '50 ప్రత్యేక స్థలాలను సందర్శించారు',
        icon: '🗺️',
        rarity: 'epic',
        unlockedAt: new Date('2024-10-20'),
      },
      {
        id: 'vip_legend',
        name: 'VIP Legend',
        nameTe: 'VIP లెజెండ్',
        description: 'Completed 500 rides',
        descriptionTe: '500 రైడ్లు పూర్తి చేసారు',
        icon: '👑',
        rarity: 'legendary',
      },
    ];
  }

  // Leaderboard
  async getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'alltime', category: string, userId: string): Promise<Leaderboard> {
    // Mock data - replace with actual database queries
    return {
      period,
      category: category as any,
      entries: [
        { rank: 1, userId: 'user1', username: 'SpeedyRider', avatar: '👨', score: 1250, change: 0 },
        { rank: 2, userId: 'user2', username: 'CityCommuter', avatar: '👩', score: 1180, change: 2 },
        { rank: 3, userId: 'user3', username: 'DailyDriver', avatar: '🧑', score: 1050, change: -1 },
        { rank: 4, userId: 'user4', username: 'NightRider', avatar: '👨', score: 980, change: 1 },
        { rank: 5, userId: userId, username: 'You', avatar: '😊', score: 850, change: 3 },
      ],
      userRank: 5,
    };
  }

  // Streak tracking
  async getStreakInfo(userId: string): Promise<StreakInfo> {
    return {
      current: 7,
      longest: 21,
      multiplier: 1.15, // 15% bonus for 7-day streak
      nextMilestone: {
        days: 14,
        reward: '2x points for all rides',
      },
    };
  }

  // Spin the wheel / Lucky draw
  async spinWheel(userId: string): Promise<{
    canSpin: boolean;
    prize?: { type: string; value: number; message: string; messageTe: string };
    nextSpinAt?: Date;
  }> {
    // Check if user can spin (once per day after completing a ride)
    const canSpin = true; // Check actual eligibility

    if (!canSpin) {
      return {
        canSpin: false,
        nextSpinAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    }

    // Random prize selection
    const prizes = [
      { type: 'points', value: 50, weight: 30, message: 'You won 50 points!', messageTe: 'మీరు 50 పాయింట్లు గెలుచుకున్నారు!' },
      { type: 'cashback', value: 20, weight: 25, message: '₹20 Cashback!', messageTe: '₹20 క్యాష్బ్యాక్!' },
      { type: 'discount', value: 15, weight: 20, message: '15% Discount on next ride!', messageTe: 'తదుపరి రైడ్‌పై 15% డిస్కౌంట్!' },
      { type: 'points', value: 100, weight: 15, message: 'Jackpot! 100 points!', messageTe: 'జాక్పాట్! 100 పాయింట్లు!' },
      { type: 'freeride', value: 100, weight: 5, message: 'Free ride up to ₹100!', messageTe: '₹100 వరకు ఉచిత రైడ్!' },
      { type: 'nothing', value: 0, weight: 5, message: 'Better luck next time!', messageTe: 'తదుపరి సారి శుభం కలగాలి!' },
    ];

    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
    const random = Math.random() * totalWeight;
    
    let cumulative = 0;
    let selectedPrize = prizes[0];
    
    for (const prize of prizes) {
      cumulative += prize.weight;
      if (random <= cumulative) {
        selectedPrize = prize;
        break;
      }
    }

    return {
      canSpin: true,
      prize: selectedPrize,
    };
  }

  // Achievement notifications
  async checkAchievements(userId: string, action: string, metadata: any): Promise<Badge[]> {
    const newBadges: Badge[] = [];

    // Check for new badge unlocks based on action
    if (action === 'ride_completed') {
      const totalRides = metadata.totalRides;
      
      if (totalRides === 1) {
        newBadges.push({
          id: 'first_ride',
          name: 'First Ride',
          nameTe: 'మొదటి రైడ్',
          description: 'Completed your first ride',
          descriptionTe: 'మీ మొదటి రైడ్ పూర్తి చేసారు',
          icon: '🚀',
          rarity: 'common',
          unlockedAt: new Date(),
        });
      } else if (totalRides === 50) {
        newBadges.push({
          id: 'half_century',
          name: 'Half Century',
          nameTe: 'అర్ధ శతకం',
          description: '50 rides completed',
          descriptionTe: '50 రైడ్లు పూర్తి చేసారు',
          icon: '🎯',
          rarity: 'rare',
          unlockedAt: new Date(),
        });
      }
    }

    return newBadges;
  }

  // Social challenges
  async createChallenge(userId: string, challenge: {
    title: string;
    description: string;
    target: number;
    duration: number; // days
    participants: string[];
  }): Promise<string> {
    const challengeId = `challenge_${Date.now()}`;
    
    // Store challenge
    // Notify participants
    
    return challengeId;
  }

  // Reward redemption history
  async getRedemptionHistory(userId: string): Promise<Array<{
    date: Date;
    reward: string;
    points: number;
    status: 'redeemed' | 'used' | 'expired';
  }>> {
    return [
      {
        date: new Date('2024-10-20'),
        reward: '₹50 Off',
        points: 500,
        status: 'used',
      },
      {
        date: new Date('2024-10-15'),
        reward: '20% Cashback',
        points: 700,
        status: 'redeemed',
      },
    ];
  }

  // Seasonal events
  async getSeasonalEvents(): Promise<Array<{
    id: string;
    name: string;
    nameTe: string;
    description: string;
    descriptionTe: string;
    startDate: Date;
    endDate: Date;
    bonusMultiplier: number;
    specialRewards: string[];
  }>> {
    return [
      {
        id: 'diwali_bonanza',
        name: 'Diwali Bonanza',
        nameTe: 'దీపావళి బొనాంజా',
        description: '3x points on all rides during Diwali week!',
        descriptionTe: 'దీపావళి వారంలో అన్ని రైడ్లపై 3x పాయింట్లు!',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-07'),
        bonusMultiplier: 3,
        specialRewards: ['Diwali Special Badge', 'Lucky Draw Entry', '₹500 Cashback Lottery'],
      },
    ];
  }

  // Daily login rewards
  async claimDailyReward(userId: string): Promise<{
    day: number;
    reward: { type: string; value: number };
    nextReward: { type: string; value: number };
  }> {
    const day = 5; // Get from user's login streak
    
    const rewards = [
      { type: 'points', value: 10 },
      { type: 'points', value: 20 },
      { type: 'cashback', value: 10 },
      { type: 'points', value: 50 },
      { type: 'cashback', value: 25 },
      { type: 'discount', value: 10 },
      { type: 'points', value: 100 },
    ];

    return {
      day,
      reward: rewards[day - 1],
      nextReward: rewards[day % rewards.length],
    };
  }

  // Referral contest
  async getReferralContest(): Promise<{
    active: boolean;
    endDate: Date;
    prizes: Array<{ rank: string; prize: string }>;
    userReferrals: number;
    userRank: number;
  }> {
    return {
      active: true,
      endDate: new Date('2024-11-30'),
      prizes: [
        { rank: '1st', prize: 'iPhone 15 Pro + ₹10,000' },
        { rank: '2nd', prize: 'Samsung Galaxy S24 + ₹5,000' },
        { rank: '3rd', prize: 'OnePlus 12 + ₹3,000' },
        { rank: '4-10', prize: '₹1,000 Cashback' },
        { rank: '11-50', prize: '₹500 Cashback' },
      ],
      userReferrals: 8,
      userRank: 15,
    };
  }
}

export const gamificationService = new GamificationService();
export type { Quest, Badge, Leaderboard, StreakInfo };
