import express from 'express';
import { sendSMS } from '../services/smsService.js';

const router = express.Router();

// POST /api/sms/test
// Body: { to?: string, message?: string }
router.post('/test', async (req, res) => {
  try {
    const { to, message } = req.body || {};
    const target = to || process.env.TWILIO_TEST_TO || process.env.TWILIO_PHONE_NUMBER;
    if (!target) {
      return res.status(400).json({ success: false, message: 'Provide `to` in body or set TWILIO_TEST_TO in env' });
    }
    const body = message || 'Dropout: Test SMS from backend.';
    const result = await sendSMS({ to: target, body });
    return res.json({ success: true, sid: result.sid, to: result.to, status: result.status });
  } catch (err) {
    console.error('SMS send error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
