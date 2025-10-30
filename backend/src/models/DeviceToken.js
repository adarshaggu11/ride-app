import mongoose from 'mongoose';

const DeviceTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    token: { type: String, required: true, unique: true, index: true },
    platform: { type: String, enum: ['web', 'android', 'ios'], default: 'web' },
    lastSeenAt: { type: Date, default: Date.now },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

DeviceTokenSchema.index({ userId: 1, platform: 1 });

const DeviceToken = mongoose.model('DeviceToken', DeviceTokenSchema);
export default DeviceToken;
