import express from 'express';
import DeviceToken from '../models/DeviceToken.js';

const router = express.Router();

// Save or update a device token
router.post('/token', async (req, res) => {
  try {
    const { token, userId, platform = 'web', meta = {} } = req.body || {};

    if (!token) {
      return res.status(400).json({ success: false, message: 'token is required' });
    }

    const update = {
      ...(userId ? { userId } : {}),
      platform,
      lastSeenAt: new Date(),
      meta,
    };

    const doc = await DeviceToken.findOneAndUpdate(
      { token },
      { $set: update, $setOnInsert: { token } },
      { upsert: true, new: true }
    );

    return res.json({ success: true, token: doc.token, userId: doc.userId, platform: doc.platform });
  } catch (err) {
    console.error('Error saving device token:', err);
    return res.status(500).json({ success: false, message: 'Failed to save token' });
  }
});

export default router;
