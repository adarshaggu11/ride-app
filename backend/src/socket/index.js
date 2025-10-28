import jwt from 'jsonwebtoken';
import Driver from '../models/Driver.js';
import Ride from '../models/Ride.js';

export const setupSocketHandlers = (io) => {
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user-specific room
    socket.join(`user_${socket.userId}`);

    // Join role-specific rooms
    if (socket.userRole === 'driver') {
      socket.join('drivers');
    }

    // Driver: Update location
    socket.on('updateLocation', async (data) => {
      try {
        const { lat, lng } = data;

        if (socket.userRole !== 'driver') return;

        const driver = await Driver.findOne({ userId: socket.userId });
        if (!driver) return;

        // Update driver location
        driver.currentLocation = {
          type: 'Point',
          coordinates: [lng, lat],
          lastUpdated: new Date()
        };

        await driver.save();

        // If driver has active ride, broadcast location to user
        if (driver.currentRide) {
          const ride = await Ride.findById(driver.currentRide);
          if (ride) {
            io.to(`user_${ride.user}`).emit('driverLocationUpdate', {
              rideId: ride.rideId,
              location: { lat, lng },
              timestamp: new Date()
            });

            // Save to route history
            ride.route.push({
              lat,
              lng,
              timestamp: new Date()
            });
            await ride.save();
          }
        }

        // Broadcast to all users for nearby drivers display
        socket.broadcast.emit('driverMoved', {
          driverId: driver._id,
          location: { lat, lng },
          vehicleType: driver.vehicleType
        });

      } catch (error) {
        console.error('Update Location Error:', error);
      }
    });

    // Driver: Accept ride request
    socket.on('acceptRide', async (data) => {
      try {
        const { rideId } = data;

        if (socket.userRole !== 'driver') return;

        const driver = await Driver.findOne({ userId: socket.userId });
        if (!driver || !driver.isAvailable) {
          socket.emit('rideAcceptFailed', { 
            message: 'You are not available to accept rides' 
          });
          return;
        }

        const ride = await Ride.findOne({ rideId });
        if (!ride || ride.status !== 'requested') {
          socket.emit('rideAcceptFailed', { 
            message: 'Ride already accepted by another driver or cancelled' 
          });
          return;
        }

        // Check if ride was already accepted (race condition prevention)
        if (ride.driver) {
          socket.emit('rideAcceptFailed', { 
            message: 'Another driver just accepted this ride' 
          });
          return;
        }

        // Update ride
        ride.driver = driver._id;
        ride.status = 'accepted';
        ride.acceptedAt = new Date();
        await ride.save();

        // Update driver
        driver.currentRide = ride._id;
        driver.isAvailable = false;
        await driver.save();

        // Notify user
        io.to(`user_${ride.user}`).emit('rideAccepted', {
          rideId: ride.rideId,
          driver: {
            id: driver._id,
            name: driver.name,
            phone: driver.phone,
            vehicleType: driver.vehicleType,
            vehicleNumber: driver.vehicleNumber,
            rating: driver.rating.average,
            location: {
              lat: driver.currentLocation.coordinates[1],
              lng: driver.currentLocation.coordinates[0]
            }
          }
        });

        // Notify other drivers that ride was taken
        io.to('drivers').emit('rideTaken', {
          rideId: ride.rideId,
          message: 'This ride has been accepted by another driver'
        });

        // Notify accepting driver
        socket.emit('rideAcceptConfirmed', {
          rideId: ride.rideId,
          pickup: ride.pickup,
          drop: ride.drop,
          fare: ride.fare.total,
          otp: ride.otp,
          userPhone: ride.user.phone
        });

        console.log(`✅ Ride ${rideId} accepted by driver ${driver.name}`);

      } catch (error) {
        console.error('Accept Ride Error:', error);
        socket.emit('rideAcceptFailed', { message: 'Server error' });
      }
    });

    // Driver: Update ride status
    socket.on('updateRideStatus', async (data) => {
      try {
        const { rideId, status } = data;

        if (socket.userRole !== 'driver') return;

        const ride = await Ride.findOne({ rideId });
        if (!ride) return;

        const oldStatus = ride.status;
        ride.status = status;

        // Update timestamps
        if (status === 'arriving' && oldStatus === 'accepted') {
          ride.status = 'arriving';
        } else if (status === 'arrived') {
          ride.pickup.arrivedAt = new Date();
        } else if (status === 'started') {
          ride.startedAt = new Date();
        } else if (status === 'completed') {
          ride.completedAt = new Date();
          ride.actualDuration = Math.floor((ride.completedAt - ride.startedAt) / 1000);
          ride.drop.reachedAt = new Date();

          // Update driver availability
          const driver = await Driver.findById(ride.driver);
          if (driver) {
            driver.isAvailable = true;
            driver.currentRide = null;
            driver.totalRides += 1;
            driver.totalEarnings += ride.fare.total;
            await driver.save();
          }
        }

        await ride.save();

        // Notify user
        io.to(`user_${ride.user}`).emit('rideStatusUpdate', {
          rideId: ride.rideId,
          status: ride.status,
          timestamp: new Date()
        });

        // Notify driver
        socket.emit('rideStatusUpdateConfirmed', {
          rideId: ride.rideId,
          status: ride.status
        });

      } catch (error) {
        console.error('Update Ride Status Error:', error);
      }
    });

    // User: Request ride (alternative to REST API)
    socket.on('requestRide', async (data) => {
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
        } = data;

        const ride = new Ride({
          user: socket.userId,
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
            value: parseFloat(distance) * 1000
          },
          duration: {
            text: duration,
            value: parseInt(duration) * 60
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

        // Find nearby drivers
        const nearbyDrivers = await Driver.find({
          currentLocation: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [pickupCoords.lng, pickupCoords.lat]
              },
              $maxDistance: 5000
            }
          },
          isOnline: true,
          isAvailable: true,
          vehicleType: vehicleType || 'auto'
        }).limit(10);

        // Notify nearby drivers
        nearbyDrivers.forEach(driver => {
          io.to(`user_${driver.userId}`).emit('newRideRequest', {
            rideId: ride.rideId,
            pickup: ride.pickup,
            drop: ride.drop,
            fare: ride.fare.total,
            distance: ride.distance.text,
            vehicleType: ride.vehicleType
          });
        });

        // Confirm to user
        socket.emit('rideRequested', {
          rideId: ride.rideId,
          status: 'requested',
          nearbyDriversCount: nearbyDrivers.length
        });

      } catch (error) {
        console.error('Request Ride Error:', error);
        socket.emit('error', { message: 'Failed to request ride' });
      }
    });

    // SOS Alert
    socket.on('sosAlert', async (data) => {
      try {
        const { rideId } = data;

        const ride = await Ride.findOne({ rideId });
        if (!ride) return;

        ride.sosAlert = {
          triggered: true,
          triggeredAt: new Date()
        };
        await ride.save();

        // Notify admin/support
        io.to('admin').emit('sosAlert', {
          rideId: ride.rideId,
          user: ride.user,
          driver: ride.driver,
          location: ride.pickup.coordinates
        });

        console.log(`🚨 SOS ALERT: Ride ${rideId}`);

      } catch (error) {
        console.error('SOS Alert Error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  console.log('✅ Socket.IO handlers configured');
};
