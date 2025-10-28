import express from 'express';
import Ride from '../models/Ride.js';
import Driver from '../models/Driver.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/rides/request
// @desc    Request a new ride
// @access  Private
router.post('/request', authenticate, async (req, res) => {
  try {
    const {
      pickup,
      drop,
      pickupCoords,
      dropCoords,
      distance,
      duration,
      fare,
      vehicleType
    } = req.body;

    // Create new ride
    const ride = new Ride({
      user: req.user.userId,
      pickup: {
        address: pickup,
        coordinates: pickupCoords
      },
      drop: {
        address: drop,
        coordinates: dropCoords
      },
      distance: {
        text: distance,
        value: parseFloat(distance) * 1000 // convert km to meters
      },
      duration: {
        text: duration,
        value: parseInt(duration) * 60 // convert minutes to seconds
      },
      fare: {
        baseFare: 20,
        distanceFare: fare - 20,
        total: fare
      },
      vehicleType: vehicleType || 'auto',
      status: 'requested'
    });

    await ride.save();

    // Find nearby available drivers (sorted by distance - nearest first)
    const nearbyDrivers = await Driver.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupCoords.lng, pickupCoords.lat]
          },
          $maxDistance: 5000 // 5km radius
        }
      },
      isOnline: true,
      isAvailable: true,
      vehicleType: vehicleType || 'auto',
      status: 'online'
    }).limit(10);

    // Send notification to nearby drivers (NEAREST FIRST - priority based)
    // Use notification service for better handling
    if (req.notificationService) {
      await req.notificationService.notifyNearbyDrivers(ride, nearbyDrivers);
    } else {
      // Fallback: Emit to each driver individually so they can accept/reject
      nearbyDrivers.forEach((driver, index) => {
        req.io.to(`driver_${driver.userId}`).emit('newRideRequest', {
          rideId: ride.rideId,
          pickup: ride.pickup,
          drop: ride.drop,
          fare: ride.fare.total,
          distance: ride.distance.text,
          duration: ride.duration.text,
          vehicleType: ride.vehicleType,
          priority: index + 1, // 1 = closest driver
          customerPhone: req.user.phone || 'Hidden'
        });
      });

      // Also broadcast to drivers room for general awareness
      req.io.to('drivers').emit('rideRequestBroadcast', {
        rideId: ride.rideId,
        pickup: ride.pickup.address,
        fare: ride.fare.total,
        driversNotified: nearbyDrivers.length
      });
    }

    res.json({
      success: true,
      message: 'Ride requested successfully',
      ride: {
        rideId: ride.rideId,
        status: ride.status,
        pickup: ride.pickup,
        drop: ride.drop,
        fare: ride.fare,
        otp: ride.otp
      },
      nearbyDriversCount: nearbyDrivers.length
    });

  } catch (error) {
    console.error('Request Ride Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request ride'
    });
  }
});

// @route   GET /api/rides/my-rides
// @desc    Get user's ride history
// @access  Private
router.get('/my-rides', authenticate, async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.userId })
      .populate('driver', 'name phone vehicleNumber rating')
      .sort({ requestedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: rides.length,
      rides
    });

  } catch (error) {
    console.error('Get Rides Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rides'
    });
  }
});

// @route   GET /api/rides/:rideId
// @desc    Get ride details
// @access  Private
router.get('/:rideId', authenticate, async (req, res) => {
  try {
    const ride = await Ride.findOne({ rideId: req.params.rideId })
      .populate('user', 'name phone')
      .populate('driver', 'name phone vehicleNumber vehicleType rating currentLocation');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.json({
      success: true,
      ride
    });

  } catch (error) {
    console.error('Get Ride Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ride details'
    });
  }
});

// @route   POST /api/rides/:rideId/cancel
// @desc    Cancel a ride
// @access  Private
router.post('/:rideId/cancel', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const ride = await Ride.findOne({ rideId: req.params.rideId });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this ride'
      });
    }

    ride.status = 'cancelled';
    ride.cancellation = {
      by: 'user',
      reason: reason || 'User cancelled',
      cancelledAt: new Date()
    };
    ride.cancelledAt = new Date();

    await ride.save();

    // Notify driver if assigned
    if (ride.driver) {
      req.io.to(`driver_${ride.driver}`).emit('rideCancelled', {
        rideId: ride.rideId,
        reason: ride.cancellation.reason
      });
    }

    res.json({
      success: true,
      message: 'Ride cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel Ride Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel ride'
    });
  }
});

// @route   POST /api/rides/:rideId/rate
// @desc    Rate a completed ride
// @access  Private
router.post('/:rideId/rate', authenticate, async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const ride = await Ride.findOne({ rideId: req.params.rideId });

    if (!ride || ride.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed rides'
      });
    }

    ride.userRating = {
      rating,
      review: review || '',
      ratedAt: new Date()
    };

    await ride.save();

    // Update driver's rating
    if (ride.driver) {
      const driver = await Driver.findById(ride.driver);
      if (driver) {
        const totalRating = (driver.rating.average * driver.rating.count) + rating;
        driver.rating.count += 1;
        driver.rating.average = totalRating / driver.rating.count;
        await driver.save();
      }
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Rate Ride Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating'
    });
  }
});

// @route   GET /api/rides/nearby-drivers
// @desc    Get nearby available drivers
// @access  Private
router.get('/nearby-drivers', authenticate, async (req, res) => {
  try {
    const { lat, lng, vehicleType } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const drivers = await Driver.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000 // 5km
        }
      },
      isOnline: true,
      isAvailable: true,
      ...(vehicleType && { vehicleType })
    })
    .select('name currentLocation vehicleType vehicleNumber rating')
    .limit(20);

    res.json({
      success: true,
      count: drivers.length,
      drivers: drivers.map(d => ({
        id: d._id,
        name: d.name,
        vehicleType: d.vehicleType,
        vehicleNumber: d.vehicleNumber,
        rating: d.rating.average,
        location: {
          lat: d.currentLocation.coordinates[1],
          lng: d.currentLocation.coordinates[0]
        }
      }))
    });

  } catch (error) {
    console.error('Get Nearby Drivers Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby drivers'
    });
  }
});

export default router;
