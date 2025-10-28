import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  rideId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  // Locations
  pickup: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    arrivedAt: Date
  },
  drop: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    reachedAt: Date
  },
  // Route Details
  distance: {
    text: String,
    value: Number // meters
  },
  duration: {
    text: String,
    value: Number // seconds
  },
  estimatedDuration: Number, // seconds
  actualDuration: Number,    // seconds
  // Pricing
  fare: {
    baseFare: {
      type: Number,
      default: 20
    },
    distanceFare: Number,
    timeFare: Number,
    surgeFare: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  // Payment
  payment: {
    method: {
      type: String,
      enum: ['cash', 'upi', 'card', 'wallet'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  // Status
  status: {
    type: String,
    enum: ['requested', 'accepted', 'arriving', 'arrived', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  // Timestamps
  requestedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  // Cancellation
  cancellation: {
    by: {
      type: String,
      enum: ['user', 'driver', 'system']
    },
    reason: String,
    cancelledAt: Date
  },
  // Ratings
  userRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: Date
  },
  driverRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: Date
  },
  // Vehicle Type
  vehicleType: {
    type: String,
    enum: ['auto', 'bike'],
    default: 'auto'
  },
  // OTP for verification
  otp: {
    type: String,
    default: () => Math.floor(1000 + Math.random() * 9000).toString()
  },
  // Live Tracking
  route: [{
    lat: Number,
    lng: Number,
    timestamp: Date
  }],
  // Special Requests
  specialRequests: [String],
  // Promo/Coupon
  promoCode: String,
  // SOS/Safety
  sosAlert: {
    triggered: {
      type: Boolean,
      default: false
    },
    triggeredAt: Date,
    contacts: [String]
  }
}, {
  timestamps: true
});

// Indexes
rideSchema.index({ user: 1, status: 1 });
rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ rideId: 1 });
rideSchema.index({ requestedAt: -1 });

// Auto-generate rideId
rideSchema.pre('save', async function(next) {
  if (!this.rideId) {
    this.rideId = `RIDE${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model('Ride', rideSchema);
