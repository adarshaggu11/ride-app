import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[6-9]\d{9}$/
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: '👤'
  },
  profilePicture: String,
  role: {
    type: String,
    enum: ['user', 'driver', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    enum: ['telugu', 'english'],
    default: 'telugu'
  },
  // Location
  lastKnownLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [78.486, 17.385] // Hyderabad
    }
  },
  // Stats
  totalRides: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  rewardPoints: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 5.0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  // Preferences
  favoriteLocations: [{
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  // Security
  fcmToken: String, // For push notifications
  refreshToken: String,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
userSchema.index({ lastKnownLocation: '2dsphere' });

// Hash refresh token before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('refreshToken') && this.refreshToken) {
    this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
  }
  next();
});

export default mongoose.model('User', userSchema);
