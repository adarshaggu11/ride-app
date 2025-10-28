import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  // Vehicle Details
  vehicleType: {
    type: String,
    enum: ['auto', 'bike'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  vehicleModel: String,
  vehicleColor: String,
  // Documents
  documents: {
    drivingLicense: {
      number: String,
      expiryDate: Date,
      verified: { type: Boolean, default: false }
    },
    vehicleRC: {
      number: String,
      verified: { type: Boolean, default: false }
    },
    insurance: {
      number: String,
      expiryDate: Date,
      verified: { type: Boolean, default: false }
    },
    aadhar: {
      number: String,
      verified: { type: Boolean, default: false }
    },
    photo: String,
    profilePicture: String
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended', 'offline', 'online', 'busy'],
    default: 'pending'
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  // Current Location (real-time)
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  // Stats
  totalRides: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  completionRate: {
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
  // Current Ride
  currentRide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  },
  // Working Hours
  workingHours: {
    start: String, // "09:00"
    end: String    // "22:00"
  },
  // Bank Details
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    verified: { type: Boolean, default: false }
  },
  // Performance
  acceptanceRate: {
    type: Number,
    default: 0
  },
  cancellationRate: {
    type: Number,
    default: 0
  },
  averageResponseTime: {
    type: Number, // seconds
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Geospatial index for nearby driver queries
driverSchema.index({ currentLocation: '2dsphere' });
driverSchema.index({ status: 1, isOnline: 1, isAvailable: 1 });

export default mongoose.model('Driver', driverSchema);
