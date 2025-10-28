# Nearby Driver Notification System

## Overview
When a customer books a ride, the system automatically finds and notifies nearby drivers in **priority order** - nearest drivers get notified first.

## How It Works

### 1. Customer Requests Ride
- Customer enters pickup and drop locations (anywhere in India ✅)
- System calculates distance and fare
- Customer confirms booking

### 2. Find Nearby Drivers
```javascript
// MongoDB Geospatial Query ($near)
// Automatically sorts by distance (nearest first)
const nearbyDrivers = await Driver.find({
  currentLocation: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [pickupLng, pickupLat]
      },
      $maxDistance: 5000 // 5km radius
    }
  },
  isOnline: true,
  isAvailable: true,
  vehicleType: 'auto' // or 'bike'
})
```

### 3. Notify Drivers (Priority-Based)
```javascript
// Nearest driver gets priority 1, next gets 2, etc.
nearbyDrivers.forEach((driver, index) => {
  io.to(`driver_${driver.userId}`).emit('newRideRequest', {
    rideId: 'RIDE123456',
    pickup: { address, coordinates },
    drop: { address, coordinates },
    fare: 120,
    distance: '8.5 km',
    duration: '20 mins',
    priority: index + 1, // 1 = CLOSEST DRIVER
    expiresIn: 30000 // 30 seconds to accept
  });
});
```

### 4. Driver Accepts
- First driver to accept gets the ride
- Other drivers are notified ride is taken
- Driver becomes unavailable for other rides

### 5. Race Condition Prevention
```javascript
// Before accepting, check if ride is still available
if (ride.status !== 'requested' || ride.driver) {
  return 'Ride already taken';
}

// Atomically update ride
ride.driver = driverId;
ride.status = 'accepted';
```

## WebSocket Events

### Driver Events
- `newRideRequest` - New ride available (with priority)
- `rideTaken` - Ride accepted by another driver
- `rideAcceptConfirmed` - Your acceptance confirmed
- `rideAcceptFailed` - Acceptance failed (already taken)
- `rideCancelled` - User cancelled the ride

### User Events
- `rideAccepted` - Driver accepted your ride
- `driverLocationUpdate` - Driver location updated
- `rideStatusUpdate` - Ride status changed (arriving, started, completed)

## API Endpoints

### POST /api/rides/request
```bash
curl -X POST http://localhost:3000/api/rides/request \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup": "GRC3+RPW, Hyderabad",
    "drop": "VMQ7+QR6, Bremwar",
    "pickupCoords": { "lat": 17.385, "lng": 78.486 },
    "dropCoords": { "lat": 17.447, "lng": 78.379 },
    "distance": "8.5 km",
    "duration": "20 mins",
    "fare": 120,
    "vehicleType": "auto"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Ride requested successfully",
  "ride": {
    "rideId": "RIDE1730123456789",
    "status": "requested",
    "pickup": { "address": "...", "coordinates": {...} },
    "otp": "1234"
  },
  "nearbyDriversCount": 5
}
```

## Key Features

✅ **Anywhere in India** - Not restricted to Hyderabad only
✅ **Nearest First** - Drivers sorted by distance automatically
✅ **Priority-Based** - Closest driver gets priority 1
✅ **Real-Time** - WebSocket notifications (instant)
✅ **Race Condition Safe** - Only one driver can accept
✅ **30-Second Window** - Drivers have 30s to accept
✅ **Automatic Fallback** - If no driver accepts, notify more drivers

## Testing

### 1. Create Test Drivers
```bash
# Create driver at location 1
curl -X POST http://localhost:3000/api/drivers/register \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "vehicleType": "auto",
    "vehicleNumber": "TS09UA1234",
    "currentLocation": { "lat": 17.385, "lng": 78.486 }
  }'
```

### 2. Request Ride
```bash
# User requests ride
curl -X POST http://localhost:3000/api/rides/request ...
```

### 3. Check Console Logs
```
📲 Notified driver Ravi Kumar (Priority 1) for ride RIDE123
📲 Notified driver Suresh Reddy (Priority 2) for ride RIDE123
✅ Ride RIDE123 notified to 5 nearby drivers
```

### 4. Driver Accepts (via WebSocket)
```javascript
// Driver app
socket.emit('acceptRide', { rideId: 'RIDE123' });

// Response
socket.on('rideAcceptConfirmed', (data) => {
  console.log('Ride accepted!', data);
});
```

## Future Enhancements

- [ ] Push notifications (Firebase)
- [ ] SMS notifications for drivers
- [ ] Surge pricing based on demand
- [ ] Scheduled ride notifications
- [ ] Driver preferences (avoid certain areas)
- [ ] Tiered notification (try 3 nearest first, then expand radius)

## Configuration

Edit `backend/.env`:
```env
# Notification settings
MAX_NEARBY_DRIVERS=10
DRIVER_SEARCH_RADIUS=5000  # meters
RIDE_ACCEPT_TIMEOUT=30000  # milliseconds
```
