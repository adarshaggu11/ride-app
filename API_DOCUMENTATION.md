# 🔌 Backend API Documentation

## Overview
This document outlines the required backend APIs for Mana Auto Oka Ride application.

**Base URL**: `https://api.manaauto.com/v1`

---

## 🔐 Authentication

### POST /auth/register
Register a new user (rider or driver)

**Request:**
```json
{
  "phone": "+919876543210",
  "name": "John Doe",
  "email": "john@example.com",
  "userType": "rider", // or "driver"
  "language": "en" // or "te"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "usr_123abc",
  "otp": "123456", // Only in dev mode
  "message": "OTP sent to your phone"
}
```

### POST /auth/verify-otp
Verify OTP and create session

**Request:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123abc",
    "phone": "+919876543210",
    "name": "John Doe",
    "userType": "rider"
  }
}
```

---

## 👤 User Management

### GET /user/profile
Get user profile

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": "usr_123abc",
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "profilePicture": "https://...",
  "rating": 4.8,
  "totalRides": 45,
  "rewards": {
    "points": 1250,
    "tier": "gold",
    "cashback": 150
  }
}
```

### PUT /user/profile
Update user profile

### POST /user/emergency-contacts
Add emergency contact

**Request:**
```json
{
  "name": "Mom",
  "phone": "+919876543210",
  "relation": "Mother"
}
```

---

## 🚗 Ride Management

### POST /rides/request
Request a new ride

**Request:**
```json
{
  "pickup": {
    "lat": 17.385044,
    "lng": 78.486671,
    "address": "Hitech City, Hyderabad"
  },
  "drop": {
    "lat": 17.440304,
    "lng": 78.448502,
    "address": "Banjara Hills, Hyderabad"
  },
  "rideType": "solo", // or "shared"
  "paymentMethod": "upi",
  "scheduledTime": null // or ISO timestamp for scheduled rides
}
```

**Response:**
```json
{
  "success": true,
  "rideId": "ride_xyz789",
  "estimatedFare": {
    "baseFare": 30,
    "distanceFare": 84,
    "timeFare": 15,
    "surgeFare": 0,
    "platformFee": 6,
    "gst": 7,
    "total": 142,
    "finalAmount": 142
  },
  "estimatedDuration": "15 min",
  "distance": "7.2 km",
  "status": "searching"
}
```

### GET /rides/{rideId}
Get ride details

### POST /rides/{rideId}/cancel
Cancel a ride

**Request:**
```json
{
  "reason": "Changed plans",
  "reasonCode": "user_cancelled"
}
```

### GET /rides/history
Get ride history

**Query Params:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (completed, cancelled)

**Response:**
```json
{
  "rides": [
    {
      "id": "ride_xyz789",
      "date": "2025-10-27T14:30:00Z",
      "pickup": "Hitech City",
      "drop": "Banjara Hills",
      "fare": 142,
      "status": "completed",
      "driver": {
        "name": "Ravi Kumar",
        "rating": 4.7
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### GET /rides/active
Get active/ongoing ride

---

## 🚕 Driver APIs

### POST /driver/availability
Update driver availability

**Request:**
```json
{
  "available": true,
  "location": {
    "lat": 17.385044,
    "lng": 78.486671
  }
}
```

### POST /driver/location
Update driver location (called every 5 seconds)

**Request:**
```json
{
  "lat": 17.385044,
  "lng": 78.486671,
  "heading": 45,
  "speed": 20
}
```

### POST /driver/accept-ride
Accept a ride request

**Request:**
```json
{
  "rideId": "ride_xyz789"
}
```

### POST /driver/start-trip
Start the trip

### POST /driver/complete-trip
Complete the trip

**Request:**
```json
{
  "rideId": "ride_xyz789",
  "finalFare": 142,
  "odometerReading": 12345
}
```

### GET /driver/earnings
Get driver earnings

**Query Params:**
- `period`: today, week, month, custom
- `from`: Start date (ISO format)
- `to`: End date (ISO format)

---

## 💳 Payment APIs

### POST /payments/initiate
Initiate payment

**Request:**
```json
{
  "rideId": "ride_xyz789",
  "amount": 142,
  "method": "upi",
  "upiId": "user@paytm" // optional
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "pay_abc123",
  "orderId": "order_xyz",
  "redirectUrl": "upi://pay?...", // For UPI
  "qrCode": "data:image/png;base64..." // For QR payments
}
```

### POST /payments/verify
Verify payment status

**Request:**
```json
{
  "paymentId": "pay_abc123",
  "signature": "xyz..."
}
```

### GET /wallet/balance
Get wallet balance

### POST /wallet/add-money
Add money to wallet

**Request:**
```json
{
  "amount": 500,
  "method": "upi"
}
```

### POST /promo/apply
Apply promo code

**Request:**
```json
{
  "code": "FIRST50",
  "rideAmount": 150
}
```

**Response:**
```json
{
  "valid": true,
  "discount": 50,
  "finalAmount": 100,
  "message": "₹50 discount applied!"
}
```

---

## 🎁 Rewards & Loyalty

### GET /rewards/user
Get user rewards data

### POST /rewards/redeem
Redeem reward

**Request:**
```json
{
  "rewardId": "discount50"
}
```

### GET /rewards/available
Get available rewards

### POST /referral/apply
Apply referral code

**Request:**
```json
{
  "code": "MANA123ABC"
}
```

### GET /rewards/achievements
Get user achievements

---

## 🆘 Safety APIs

### POST /safety/sos
Trigger SOS alert

**Request:**
```json
{
  "rideId": "ride_xyz789",
  "location": {
    "lat": 17.385044,
    "lng": 78.486671
  },
  "type": "manual" // or "automatic"
}
```

**Response:**
```json
{
  "success": true,
  "alertId": "sos_emergency123",
  "authorities": ["100", "police@hyderabad.gov"],
  "message": "Emergency services notified"
}
```

### POST /safety/share-trip
Share trip with contacts

**Request:**
```json
{
  "rideId": "ride_xyz789",
  "contactIds": ["cont_123", "cont_456"]
}
```

### POST /safety/report
Report an issue

**Request:**
```json
{
  "rideId": "ride_xyz789",
  "type": "unsafe_driving",
  "description": "Driver was speeding",
  "severity": "high"
}
```

### GET /driver/verify/{driverId}
Get driver verification details

---

## 🗺️ Maps & Locations

### GET /places/autocomplete
Search for places

**Query Params:**
- `query`: Search text
- `location`: Current location (lat,lng)
- `radius`: Search radius in meters

**Response:**
```json
{
  "predictions": [
    {
      "placeId": "ChIJ...",
      "description": "Hitech City, Hyderabad",
      "mainText": "Hitech City",
      "secondaryText": "Hyderabad, Telangana"
    }
  ]
}
```

### GET /places/details/{placeId}
Get place details including coordinates

### POST /routes/calculate
Calculate route and fare

**Request:**
```json
{
  "origin": { "lat": 17.385044, "lng": 78.486671 },
  "destination": { "lat": 17.440304, "lng": 78.448502 },
  "waypoints": [] // Optional
}
```

**Response:**
```json
{
  "distance": 7200, // meters
  "duration": 900, // seconds
  "polyline": "encoded_polyline_string",
  "fare": { /* fare breakdown */ },
  "routes": [/* alternative routes */]
}
```

---

## 💬 Chat & Messaging

### WebSocket Connection
**URL**: `wss://api.manaauto.com/ws`

**Connect:**
```javascript
const ws = new WebSocket('wss://api.manaauto.com/ws?userId=usr_123&rideId=ride_xyz');
```

**Message Types:**

**Subscribe to driver location:**
```json
{
  "type": "subscribe:driver_location",
  "payload": { "rideId": "ride_xyz789" }
}
```

**Receive driver location updates:**
```json
{
  "type": "driver_location_update",
  "payload": {
    "driverId": "drv_abc",
    "location": { "lat": 17.385044, "lng": 78.486671 },
    "heading": 45,
    "speed": 20,
    "timestamp": 1698765432000
  }
}
```

**Send chat message:**
```json
{
  "type": "chat_message",
  "payload": {
    "rideId": "ride_xyz789",
    "message": "I'm waiting near the gate",
    "senderType": "rider"
  }
}
```

**Receive chat message:**
```json
{
  "type": "chat_message",
  "payload": {
    "id": "msg_123",
    "senderId": "drv_abc",
    "senderType": "driver",
    "message": "Coming in 2 minutes",
    "timestamp": 1698765432000
  }
}
```

**Ride status update:**
```json
{
  "type": "ride_status_update",
  "payload": {
    "rideId": "ride_xyz789",
    "status": "driver_arrived",
    "data": { /* additional data */ }
  }
}
```

---

## 🔔 Push Notifications

### POST /notifications/register
Register device for push notifications

**Request:**
```json
{
  "deviceToken": "fcm_token_here",
  "platform": "android" // or "ios", "web"
}
```

### POST /notifications/send
Send notification (internal use)

---

## 📊 Analytics

### POST /analytics/event
Track user event

**Request:**
```json
{
  "event": "ride_completed",
  "properties": {
    "rideId": "ride_xyz789",
    "fare": 142,
    "duration": 900
  }
}
```

---

## ⚙️ Configuration

### GET /config/app
Get app configuration

**Response:**
```json
{
  "version": "1.0.0",
  "minVersion": "1.0.0",
  "features": {
    "rideSharing": true,
    "voiceCommands": true,
    "offlineMode": true
  },
  "pricing": {
    "baseFare": 30,
    "perKmRate": 12,
    "perMinuteRate": 1.5
  },
  "maintenance": false
}
```

---

## 📈 Rate Limiting

All APIs are rate-limited:
- Standard endpoints: 100 requests/minute
- Authentication: 10 requests/minute
- Location updates: 300 requests/minute (for drivers)

---

## 🔒 Authentication

Use JWT tokens in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens expire after 30 days. Refresh using `/auth/refresh` endpoint.

---

## ⚠️ Error Responses

Standard error format:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid phone number format",
    "details": {}
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED`: Invalid or expired token
- `INVALID_REQUEST`: Bad request parameters
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error

---

## 🧪 Testing

**Test Environment**: `https://api-staging.manaauto.com/v1`

**Test Credentials:**
- Rider: +91-9999999999 (OTP: 123456)
- Driver: +91-8888888888 (OTP: 123456)

**Test Payment Cards:**
- Card: 4111 1111 1111 1111
- CVV: 123
- Expiry: Any future date

---

## 📚 SDKs

Coming soon:
- JavaScript/TypeScript SDK
- Android SDK (Java/Kotlin)
- iOS SDK (Swift)

---

## 🚀 Deployment

Backend should be deployed with:
- Load balancer (Nginx/HAProxy)
- Auto-scaling (Kubernetes/ECS)
- CDN for static assets
- Database replication
- Redis for caching
- Message queue (RabbitMQ/Kafka)
- Monitoring (Prometheus/Grafana)

---

## 📞 Support

Backend API support:
- Docs: https://docs.manaauto.com
- Slack: #api-support
- Email: api@manaauto.com
