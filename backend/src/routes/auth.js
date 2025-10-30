import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSMS } from '../services/smsService.js';

const router = express.Router();

// Generate OTP (in production, send via SMS)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Temporary OTP storage (in production, use Redis)
const otpStore = new Map();

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

  const otp = generateOTP();
    
    // Store OTP with 5 minute expiry
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // Attempt to send OTP via Twilio if configured; fall back to console in development
    let delivery = 'console';
    try {
      const hasTwilio = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
      if (hasTwilio) {
        // Format number to E.164 (assume India if 10 digits)
        const e164 = phone.startsWith('+') ? phone : (phone.length === 10 ? `+91${phone}` : `+${phone}`);
        await sendSMS({ to: e164, body: `Your Dropout OTP is ${otp}. It expires in 5 minutes.` });
        delivery = 'sms';
      } else {
        console.log(`📱 OTP for ${phone}: ${otp}`);
      }
    } catch (smsErr) {
      console.warn('SMS send failed, continuing with console only:', smsErr?.message || smsErr);
      console.log(`📱 OTP for ${phone}: ${otp}`);
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      delivery,
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone and OTP are required'
      });
    }

    // Verify OTP
    const storedData = otpStore.get(phone);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not found'
      });
    }

    if (storedData.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP verified - don't delete yet if name not provided (keep for re-verification with name)
    if (!name) {
      // OTP is correct but name not provided yet
      return res.status(400).json({
        success: false,
        message: 'Name is required for new users',
        requiresName: true
      });
    }

    // OTP verified and name provided, clear it now
    otpStore.delete(phone);

    // Try to find or create user (with timeout handling)
    let user;
    try {
      user = await User.findOne({ phone }).maxTimeMS(5000);
    } catch (dbError) {
      console.warn('MongoDB query timeout, using fallback mode');
      user = null;
    }
    
    if (!user) {
      // Register new user or use fallback
      try {
        if (!name) {
          return res.status(400).json({
            success: false,
            message: 'Name is required for new users',
            requiresName: true
          });
        }

        user = new User({
          phone,
          name,
          avatar: name.charAt(0).toUpperCase(),
          verified: true,
          lastLogin: new Date()
        });

        await user.save();
      } catch (dbError) {
        console.warn('MongoDB save failed, using mock user for development');
        // Fallback for development when MongoDB is not available
        user = {
          _id: `user_${Date.now()}`,
          phone,
          name: name || 'User',
          avatar: name ? name.charAt(0).toUpperCase() : 'U',
          role: 'customer',
          verified: true,
          totalRides: 0,
          rewardPoints: 0,
          rating: 5
        };
      }
    } else {
      // Update existing user
      try {
        user.lastLogin = new Date();
        user.verified = true;
        await user.save();
      } catch (dbError) {
        console.warn('MongoDB update failed, continuing anyway');
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        phone: user.phone,
        role: user.role || 'customer'
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        email: user.email,
        role: user.role || 'customer',
        totalRides: user.totalRides || 0,
        rewardPoints: user.rewardPoints || 0,
        rating: user.rating || 5
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId).select('-refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        totalRides: user.totalRides,
        totalSpent: user.totalSpent,
        rewardPoints: user.rewardPoints,
        rating: user.rating,
        favoriteLocations: user.favoriteLocations
      }
    });

  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

export default router;
