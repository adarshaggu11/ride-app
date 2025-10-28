// Advanced Social Features & Community Service
interface SocialProfile {
  userId: string;
  username: string;
  avatar: string;
  bio: string;
  stats: {
    totalRides: number;
    co2Saved: number;
    friendsReferred: number;
    badgesEarned: number;
  };
  preferences: {
    shareRides: boolean;
    chatEnabled: boolean;
    profileVisibility: 'public' | 'friends' | 'private';
  };
}

interface Friend {
  userId: string;
  username: string;
  avatar: string;
  status: 'pending' | 'accepted' | 'blocked';
  mutualFriends: number;
  addedAt: Date;
}

interface RideGroup {
  id: string;
  name: string;
  description: string;
  members: Array<{ userId: string; role: 'admin' | 'member' }>;
  totalRides: number;
  totalSavings: number;
  createdAt: Date;
}

interface SocialFeed {
  posts: Array<{
    id: string;
    userId: string;
    username: string;
    avatar: string;
    type: 'achievement' | 'ride' | 'milestone' | 'tip';
    content: string;
    contentTe: string;
    image?: string;
    likes: number;
    comments: number;
    timestamp: Date;
    liked: boolean;
  }>;
}

class SocialService {
  // User profile management
  async getUserProfile(userId: string): Promise<SocialProfile> {
    return {
      userId,
      username: 'RideHero123',
      avatar: '😊',
      bio: 'Daily commuter | Eco warrior | 500+ rides',
      stats: {
        totalRides: 524,
        co2Saved: 1250, // kg
        friendsReferred: 8,
        badgesEarned: 15,
      },
      preferences: {
        shareRides: true,
        chatEnabled: true,
        profileVisibility: 'public',
      },
    };
  }

  async updateProfile(userId: string, updates: Partial<SocialProfile>): Promise<void> {
    // Update profile in database
    console.log('Profile updated:', userId, updates);
  }

  // Friend system
  async getFriends(userId: string): Promise<Friend[]> {
    return [
      {
        userId: 'friend1',
        username: 'SpeedyRider',
        avatar: '👨',
        status: 'accepted',
        mutualFriends: 3,
        addedAt: new Date('2024-09-15'),
      },
      {
        userId: 'friend2',
        username: 'CityExplorer',
        avatar: '👩',
        status: 'accepted',
        mutualFriends: 5,
        addedAt: new Date('2024-08-20'),
      },
      {
        userId: 'friend3',
        username: 'NewUser',
        avatar: '🧑',
        status: 'pending',
        mutualFriends: 2,
        addedAt: new Date('2024-10-25'),
      },
    ];
  }

  async sendFriendRequest(userId: string, targetUserId: string): Promise<void> {
    // Send friend request
    console.log(`Friend request sent from ${userId} to ${targetUserId}`);
  }

  async acceptFriendRequest(userId: string, requesterId: string): Promise<void> {
    // Accept friend request
    console.log(`${userId} accepted friend request from ${requesterId}`);
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    // Remove friend
    console.log(`${userId} removed friend ${friendId}`);
  }

  // Ride groups
  async createRideGroup(userId: string, name: string, description: string, memberIds: string[]): Promise<string> {
    const groupId = `group_${Date.now()}`;
    
    const group: RideGroup = {
      id: groupId,
      name,
      description,
      members: [
        { userId, role: 'admin' },
        ...memberIds.map(id => ({ userId: id, role: 'member' as const })),
      ],
      totalRides: 0,
      totalSavings: 0,
      createdAt: new Date(),
    };

    // Store in database
    console.log('Group created:', group);
    
    return groupId;
  }

  async getRideGroups(userId: string): Promise<RideGroup[]> {
    return [
      {
        id: 'group1',
        name: 'Office Commute Squad',
        description: 'Daily office commuters from Gachibowli',
        members: [
          { userId: 'user1', role: 'admin' },
          { userId: 'user2', role: 'member' },
          { userId: 'user3', role: 'member' },
        ],
        totalRides: 150,
        totalSavings: 12500,
        createdAt: new Date('2024-09-01'),
      },
      {
        id: 'group2',
        name: 'Weekend Warriors',
        description: 'Weekend trip buddies',
        members: [
          { userId: 'user4', role: 'admin' },
          { userId, role: 'member' },
        ],
        totalRides: 45,
        totalSavings: 3200,
        createdAt: new Date('2024-10-01'),
      },
    ];
  }

  async inviteToGroup(groupId: string, inviterId: string, inviteeId: string): Promise<void> {
    // Send group invitation
    console.log(`${inviterId} invited ${inviteeId} to group ${groupId}`);
  }

  // Social feed
  async getSocialFeed(userId: string, page: number = 1): Promise<SocialFeed> {
    return {
      posts: [
        {
          id: 'post1',
          userId: 'friend1',
          username: 'SpeedyRider',
          avatar: '👨',
          type: 'achievement',
          content: 'Just unlocked the "Century Club" badge! 🏆',
          contentTe: '"సెంచరీ క్లబ్" బ్యాడ్జ్ అన్‌లాక్ చేశాను! 🏆',
          likes: 24,
          comments: 5,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          liked: false,
        },
        {
          id: 'post2',
          userId: 'friend2',
          username: 'CityExplorer',
          avatar: '👩',
          type: 'milestone',
          content: 'Saved 500kg CO2 by sharing rides! 🌱',
          contentTe: 'రైడ్లు పంచుకోవడం ద్వారా 500kg CO2 ఆదా చేశాను! 🌱',
          likes: 42,
          comments: 8,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          liked: true,
        },
        {
          id: 'post3',
          userId: userId,
          username: 'You',
          avatar: '😊',
          type: 'ride',
          content: 'Great ride with @SpeedyRider! Saved ₹80 by sharing 🚗',
          contentTe: '@SpeedyRider తో గొప్ప రైడ్! పంచుకోవడం ద్వారా ₹80 ఆదా చేశాను 🚗',
          likes: 15,
          comments: 3,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          liked: false,
        },
        {
          id: 'post4',
          userId: 'system',
          username: 'ManaAuto',
          avatar: '🚗',
          type: 'tip',
          content: 'Pro Tip: Book rides during off-peak hours to avoid surge pricing! ⚡',
          contentTe: 'ప్రో టిప్: సర్జ్ ప్రైసింగ్ నుండి తప్పించుకోవడానికి ఆఫ్-పీక్ గంటల్లో రైడ్లను బుక్ చేసుకోండి! ⚡',
          likes: 156,
          comments: 23,
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          liked: true,
        },
      ],
    };
  }

  async likePost(userId: string, postId: string): Promise<void> {
    console.log(`${userId} liked post ${postId}`);
  }

  async commentOnPost(userId: string, postId: string, comment: string): Promise<void> {
    console.log(`${userId} commented on ${postId}: ${comment}`);
  }

  async shareAchievement(userId: string, achievement: {
    type: string;
    title: string;
    description: string;
  }): Promise<void> {
    // Post achievement to social feed
    console.log(`${userId} shared achievement:`, achievement);
  }

  // Find nearby riders
  async findNearbyRiders(userId: string, location: { lat: number; lng: number }): Promise<Array<{
    userId: string;
    username: string;
    avatar: string;
    distance: number; // meters
    destination?: string;
    matchScore: number; // 0-1, how well they match for ride sharing
  }>> {
    return [
      {
        userId: 'user1',
        username: 'SpeedyRider',
        avatar: '👨',
        distance: 250,
        destination: 'Gachibowli',
        matchScore: 0.9,
      },
      {
        userId: 'user2',
        username: 'CityExplorer',
        avatar: '👩',
        distance: 450,
        destination: 'Banjara Hills',
        matchScore: 0.75,
      },
    ];
  }

  // Rating and reviews
  async rateUser(raterId: string, ratedUserId: string, rating: number, review?: string): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    console.log(`${raterId} rated ${ratedUserId}: ${rating} stars`);
    if (review) {
      console.log(`Review: ${review}`);
    }
  }

  async getUserReviews(userId: string): Promise<Array<{
    fromUser: string;
    rating: number;
    review: string;
    date: Date;
  }>> {
    return [
      {
        fromUser: 'SpeedyRider',
        rating: 5,
        review: 'Great companion for shared rides! Very friendly.',
        date: new Date('2024-10-20'),
      },
      {
        fromUser: 'CityExplorer',
        rating: 5,
        review: 'Always on time and respectful.',
        date: new Date('2024-10-15'),
      },
    ];
  }

  // Carpool scheduling
  async createCarpoolSchedule(userId: string, schedule: {
    route: { from: string; to: string };
    days: number[]; // 0-6 (Sunday-Saturday)
    time: string; // HH:MM
    seats: number;
    recurring: boolean;
  }): Promise<string> {
    const scheduleId = `schedule_${Date.now()}`;
    console.log('Carpool schedule created:', scheduleId, schedule);
    return scheduleId;
  }

  async findMatchingCarpools(userId: string, route: { from: string; to: string }, time: string): Promise<Array<{
    scheduleId: string;
    userId: string;
    username: string;
    rating: number;
    availableSeats: number;
    deviation: number; // minutes from requested time
    savings: number; // estimated savings
  }>> {
    return [
      {
        scheduleId: 'schedule1',
        userId: 'user1',
        username: 'SpeedyRider',
        rating: 4.8,
        availableSeats: 2,
        deviation: 5,
        savings: 75,
      },
    ];
  }

  // Community challenges
  async getCommunityChallenge(): Promise<{
    active: boolean;
    title: string;
    titleTe: string;
    description: string;
    descriptionTe: string;
    goal: number;
    current: number;
    participants: number;
    reward: string;
    rewardTe: string;
    endsAt: Date;
  }> {
    return {
      active: true,
      title: 'Save 10,000 kg CO2 Together!',
      titleTe: 'కలిసి 10,000 kg CO2 ఆదా చేద్దాం!',
      description: 'Join our community in saving the planet by sharing rides',
      descriptionTe: 'రైడ్లు పంచుకోవడం ద్వారా గ్రహాన్ని రక్షించడంలో మా సంఘంలో చేరండి',
      goal: 10000,
      current: 7845,
      participants: 3245,
      reward: 'All participants get 500 bonus points!',
      rewardTe: 'పాల్గొనే వారందరికీ 500 బోనస్ పాయింట్లు!',
      endsAt: new Date('2024-11-30'),
    };
  }

  // Safety buddy system
  async requestSafetyBuddy(userId: string, rideId: string): Promise<{
    buddyId: string;
    buddyName: string;
    canTrack: boolean;
  }> {
    // Assign a trusted friend as safety buddy
    return {
      buddyId: 'friend1',
      buddyName: 'SpeedyRider',
      canTrack: true,
    };
  }

  // Social sharing
  async shareRideOnSocial(userId: string, rideData: any, platform: 'whatsapp' | 'facebook' | 'twitter'): Promise<string> {
    const shareUrl = `https://manaauto.com/ride/${rideData.id}`;
    const message = `Just completed an amazing ride with ManaAuto! 🚗✨`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`,
    };

    return shareUrls[platform];
  }
}

export const socialService = new SocialService();
export type { SocialProfile, Friend, RideGroup, SocialFeed };
