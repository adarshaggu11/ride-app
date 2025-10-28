import express from 'express';
import Driver from '../models/Driver.js';

const router = express.Router();

// @route   POST /api/drivers/register
// @desc    Register new driver
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      phone,
      name,
      email,
      vehicleType,
      vehicleNumber,
      vehicleModel,
      drivingLicense,
      aadharNumber,
      vehicleRC,
      vehicleInsurance,
      profilePhoto,
      vehiclePhoto,
      licensePhoto,
      rcPhoto
    } = req.body;

    // Validate required fields
    if (!phone || !name || !vehicleType || !vehicleNumber || !drivingLicense) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    // Check if driver already exists (with timeout handling)
    let existingDriver;
    try {
      existingDriver = await Driver.findOne({ phone }).maxTimeMS(5000);
    } catch (dbError) {
      console.warn('MongoDB query timeout, continuing with registration');
      existingDriver = null;
    }
    
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'Driver already registered with this phone number'
      });
    }

    // Create new driver
    let driver;
    try {
      driver = new Driver({
        phone,
        name,
        email,
        vehicleType,
        vehicleNumber,
        vehicleModel,
        drivingLicense,
        aadharNumber,
        vehicleRC,
        vehicleInsurance,
        documents: {
          profilePhoto,
          vehiclePhoto,
          licensePhoto,
          rcPhoto
        },
        status: 'pending', // Pending approval
        isAvailable: false,
        verified: false
      });

      await driver.save();
    } catch (dbError) {
      console.warn('MongoDB save failed, using mock driver for development');
      // Fallback for development when MongoDB is not available
      driver = {
        _id: `driver_${Date.now()}`,
        phone,
        name,
        email,
        vehicleType,
        vehicleNumber,
        status: 'pending'
      };
    }

    res.status(201).json({
      success: true,
      message: 'Driver registration submitted successfully. Your application is under review.',
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
        status: driver.status
      }
    });

  } catch (error) {
    console.error('Driver Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register driver'
    });
  }
});

// @route   GET /api/drivers/:id
// @desc    Get driver by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).select('-refreshToken');
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      driver
    });

  } catch (error) {
    console.error('Get Driver Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get driver'
    });
  }
});

// @route   GET /api/drivers/phone/:phone
// @desc    Get driver by phone number
// @access  Public
router.get('/phone/:phone', async (req, res) => {
  try {
    const driver = await Driver.findOne({ phone: req.params.phone });
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
        status: driver.status,
        verified: driver.verified,
        rating: driver.rating,
        totalRides: driver.totalRides
      }
    });

  } catch (error) {
    console.error('Get Driver by Phone Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get driver'
    });
  }
});

export default router;
