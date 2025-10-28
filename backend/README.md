# Mana Auto Oka Ride - Backend API

Production-ready Node.js backend for the Telugu auto-rickshaw booking application.

## 🚀 Features

- **RESTful API** with Express.js
- **Real-time WebSocket** for live tracking
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with OTP verification
- **Geospatial Queries** for nearby driver search
- **Role-based Access Control**
- **Socket.IO** for bidirectional communication
- **Security** with Helmet, CORS, Rate Limiting
- **Production-ready** with error handling & logging

---

## 📋 Prerequisites

- Node.js v18+ installed
- MongoDB v6+ installed (or MongoDB Atlas account)
- Port 3000 available

---

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
# Copy example env file
copy .env.example .env

# Edit .env with your values
# Required: MONGODB_URI, JWT_SECRET
```

### 3. Install MongoDB (if not installed)

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas (cloud): https://cloud.mongodb.com
```

**Linux/Mac:**
```bash
# Ubuntu
sudo apt-get install mongodb

# Mac
brew install mongodb-community
```

### 4. Start MongoDB

```bash
# Windows
mongod

# Linux/Mac
sudo service mongod start

# Or use MongoDB Compass GUI
```

---

## 🏃 Running the Backend

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on: **http://localhost:3000**

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user

### Rides
- `POST /api/rides/request` - Request a new ride
- `GET /api/rides/my-rides` - Get ride history
- `GET /api/rides/:rideId` - Get ride details
- `POST /api/rides/:rideId/cancel` - Cancel ride
- `POST /api/rides/:rideId/rate` - Rate completed ride
- `GET /api/rides/nearby-drivers` - Get nearby drivers

### Users
- `GET /api/users` - User management endpoints

### Drivers
- `GET /api/drivers` - Driver management endpoints

### Payments
- `POST /api/payments` - Payment endpoints

### Admin
- `GET /api/admin` - Admin panel endpoints

### Health Check
- `GET /health` - Server health status

---

## 🔌 WebSocket Events

### Client → Server

**User Events:**
- `requestRide` - Request a new ride
- `cancelRide` - Cancel ride
- `sosAlert` - Send SOS alert

**Driver Events:**
- `updateLocation` - Update driver location (lat, lng)
- `acceptRide` - Accept ride request
- `updateRideStatus` - Update ride status (arriving, arrived, started, completed)

### Server → Client

**User Events:**
- `rideAccepted` - Driver accepted ride
- `driverLocationUpdate` - Real-time driver location
- `rideStatusUpdate` - Ride status changed

**Driver Events:**
- `newRideRequest` - New ride request available
- `rideCancelled` - User cancelled ride
- `rideAcceptConfirmed` - Ride acceptance confirmed

---

## 📦 Database Models

### User
- Phone, name, email, avatar
- Location history
- Ride statistics
- Reward points
- Favorite locations

### Driver
- User reference
- Vehicle details (type, number, model)
- Documents (license, RC, insurance, Aadhar)
- Current location (geospatial)
- Online/available status
- Earnings & ratings

### Ride
- User & driver references
- Pickup & drop locations
- Route tracking
- Fare calculation
- Status (requested, accepted, ongoing, completed)
- OTP verification
- Ratings & reviews
- Payment details

---

## 🧪 Testing the API

### 1. Test Health Check
```bash
curl http://localhost:3000/health
```

### 2. Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"9876543210\"}"
```

### 3. Verify OTP & Login
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"9876543210\", \"otp\": \"123456\", \"name\": \"Test User\"}"
```

### 4. Request Ride (with token)
```bash
curl -X POST http://localhost:3000/api/rides/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{
    \"pickup\": \"Hitec City\",
    \"drop\": \"Miyapur\",
    \"pickupCoords\": {\"lat\": 17.447, \"lng\": 78.379},
    \"dropCoords\": {\"lat\": 17.494, \"lng\": 78.391},
    \"distance\": \"8.5 km\",
    \"duration\": \"20 min\",
    \"fare\": 120,
    \"vehicleType\": \"auto\"
  }"
```

---

## 🔐 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **JWT** - Secure authentication tokens
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Express-validator
- **Password Hashing** - bcryptjs
- **Environment Variables** - Sensitive data protection

---

## 🌍 Deployment

### MongoDB Atlas (Cloud Database)
1. Create account: https://cloud.mongodb.com
2. Create cluster
3. Get connection string
4. Update `.env`: `MONGODB_URI=mongodb+srv://...`

### Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create mana-auto-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

### Deploy to AWS/DigitalOcean
```bash
# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start src/server.js --name mana-auto-backend

# View logs
pm2 logs

# Setup auto-restart on server reboot
pm2 startup
pm2 save
```

---

## 📊 Monitoring

### View Logs
```bash
# Development
npm run dev

# Production (with PM2)
pm2 logs mana-auto-backend
```

### Database Monitoring
```bash
# Connect to MongoDB shell
mongo

# Show databases
show dbs

# Use database
use mana-auto-ride

# Show collections
show collections

# Query rides
db.rides.find().pretty()

# Query users
db.users.find().pretty()
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod

# Or use MongoDB Compass GUI
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### WebSocket Connection Failed
- Check CORS settings in `server.js`
- Verify frontend URL in `.env`
- Ensure Socket.IO client version matches server

---

## 📝 Environment Variables

```env
# Required
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mana-auto-ride
JWT_SECRET=your_super_secret_key

# Optional
FRONTEND_URL=http://localhost:8080
GOOGLE_MAPS_API_KEY=your_key
SMS_API_KEY=your_sms_key
RAZORPAY_KEY_ID=your_razorpay_key
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 💬 Support

- Email: support@manaauto.com
- Documentation: https://docs.manaauto.com
- Issues: https://github.com/manaauto/backend/issues

---

## 🎉 Success!

Your backend is now running and ready to handle ride requests!

**Next Steps:**
1. ✅ Connect frontend to backend
2. ✅ Test complete booking flow
3. ✅ Add payment integration
4. ✅ Deploy to production
5. ✅ Launch app! 🚀
