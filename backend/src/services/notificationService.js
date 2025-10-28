/**
 * Notification Service for sending alerts to drivers and users
 */

export class NotificationService {
  constructor(io) {
    this.io = io;
  }

  /**
   * Send ride request to nearby drivers with priority
   * Nearest drivers get notified first
   */
  async notifyNearbyDrivers(ride, drivers) {
    if (!drivers || drivers.length === 0) {
      console.log(`⚠️ No drivers available for ride ${ride.rideId}`);
      return;
    }

    // Send to each driver individually (nearest first due to $near query)
    drivers.forEach((driver, index) => {
      const priority = index + 1;
      const notification = {
        rideId: ride.rideId,
        pickup: {
          address: ride.pickup.address,
          coordinates: ride.pickup.coordinates
        },
        drop: {
          address: ride.drop.address,
          coordinates: ride.drop.coordinates
        },
        fare: ride.fare.total,
        distance: ride.distance.text,
        duration: ride.duration.text,
        vehicleType: ride.vehicleType,
        priority, // 1 = closest driver
        timestamp: new Date(),
        expiresIn: 30000 // 30 seconds to accept
      };

      // Send to driver's personal room
      this.io.to(`driver_${driver.userId}`).emit('newRideRequest', notification);

      console.log(`📲 Notified driver ${driver.name} (Priority ${priority}) for ride ${ride.rideId}`);
    });

    // General broadcast to drivers room
    this.io.to('drivers').emit('rideRequestBroadcast', {
      rideId: ride.rideId,
      pickup: ride.pickup.address,
      fare: ride.fare.total,
      driversNotified: drivers.length,
      timestamp: new Date()
    });

    console.log(`✅ Ride ${ride.rideId} notified to ${drivers.length} nearby drivers`);
  }

  /**
   * Notify user when driver accepts ride
   */
  notifyUserRideAccepted(userId, driver, ride) {
    this.io.to(`user_${userId}`).emit('rideAccepted', {
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
        },
        estimatedArrival: '5 mins'
      },
      otp: ride.otp,
      timestamp: new Date()
    });

    console.log(`✅ User ${userId} notified about driver ${driver.name} acceptance`);
  }

  /**
   * Notify drivers that ride was taken
   */
  notifyRideTaken(rideId, excludeDriverId = null) {
    this.io.to('drivers').emit('rideTaken', {
      rideId,
      message: 'This ride has been accepted by another driver',
      timestamp: new Date()
    });

    console.log(`📢 All drivers notified that ride ${rideId} was taken`);
  }

  /**
   * Notify user of driver location update
   */
  notifyUserDriverLocation(userId, rideId, location) {
    this.io.to(`user_${userId}`).emit('driverLocationUpdate', {
      rideId,
      location,
      timestamp: new Date()
    });
  }

  /**
   * Notify user of ride status change
   */
  notifyUserRideStatus(userId, rideId, status, additionalData = {}) {
    this.io.to(`user_${userId}`).emit('rideStatusUpdate', {
      rideId,
      status,
      timestamp: new Date(),
      ...additionalData
    });

    console.log(`📢 User ${userId} notified about ride ${rideId} status: ${status}`);
  }

  /**
   * Notify driver of ride cancellation
   */
  notifyDriverRideCancelled(driverId, rideId, reason) {
    this.io.to(`driver_${driverId}`).emit('rideCancelled', {
      rideId,
      reason,
      timestamp: new Date()
    });

    console.log(`📢 Driver ${driverId} notified about cancellation of ride ${rideId}`);
  }

  /**
   * Send SOS alert to admin/support
   */
  sendSOSAlert(ride, triggeredBy) {
    this.io.to('admin').emit('sosAlert', {
      rideId: ride.rideId,
      user: ride.user,
      driver: ride.driver,
      location: ride.pickup.coordinates,
      triggeredBy,
      timestamp: new Date(),
      priority: 'CRITICAL'
    });

    console.log(`🚨 SOS ALERT: Ride ${ride.rideId} - triggered by ${triggeredBy}`);
  }

  /**
   * Broadcast driver movement to nearby users
   */
  broadcastDriverMovement(driverId, location, vehicleType) {
    this.io.emit('driverMoved', {
      driverId,
      location,
      vehicleType,
      timestamp: new Date()
    });
  }

  /**
   * Send push notification (placeholder for future implementation)
   */
  async sendPushNotification(userId, title, body, data = {}) {
    // TODO: Integrate with Firebase Cloud Messaging or similar service
    console.log(`📱 Push notification to user ${userId}: ${title}`);
    
    // For now, use Socket.IO as fallback
    this.io.to(`user_${userId}`).emit('notification', {
      title,
      body,
      data,
      timestamp: new Date()
    });
  }
}

export default NotificationService;
