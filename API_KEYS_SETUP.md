# 🔑 API Keys Setup Guide

## ✅ Current Status

### **Configured:**
- ✅ **Google Maps API** - Working and integrated
- ✅ **Backend Server** - Running on localhost:3000
- ✅ **MongoDB** - Optional (fallback mode works)

### **Not Configured:**
- ⚠️ **Firebase** - For push notifications and analytics
- ⚠️ **Razorpay** - For online payments
- ⚠️ **Twilio** - For SMS/OTP delivery

---

## 📱 Check Your Setup Status

Visit: **http://localhost:8080/setup-status**

This page shows:
- ✅ What's configured
- ❌ What's missing
- 📝 How to get each API key
- 🧪 Test push notifications

---

## 🗺️ Google Maps API (✅ DONE)

**Status:** ✅ Already configured!

**Your API Key:**
```
AIzaSyAwXWQxneG42gUhLnpbjjRsKajML8lWGRw
```

**Location:** `.env` file
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAwXWQxneG42gUhLnpbjjRsKajML8lWGRw
```

**Enabled APIs:**
- ✅ Maps JavaScript API
- ✅ Places API
- ✅ Directions API
- ✅ Geocoding API

**Usage:** Location services, routing, place search, distance calculation

---

## 🔥 Firebase Setup (⚠️ PENDING)

**Purpose:** Push notifications, analytics, crash reporting

### **Step 1: Create Firebase Project**
1. Go to: https://console.firebase.google.com/
2. Click "Add Project"
3. Enter project name: "Mana Auto Ride"
4. Follow the setup wizard

### **Step 2: Add Web App**
1. In Firebase Console, click the Web icon `</>`
2. Register app with nickname: "Mana Auto Web"
3. Copy the Firebase config object

### **Step 3: Get Config Values**
You'll see something like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123",
  measurementId: "G-ABC123DEF"
};
```

### **Step 4: Add to .env File**
```env
VITE_FIREBASE_API_KEY=AIzaSyA...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123DEF
```

### **Step 5: Enable Services**
In Firebase Console:
1. **Cloud Messaging:** 
   - Go to Project Settings > Cloud Messaging
   - Generate Web Push certificate (VAPID key)
   
2. **Analytics:**
   - Go to Analytics > Events
   - Enable Google Analytics

### **Step 6: Test**
```bash
npm run dev
# Visit: http://localhost:8080/setup-status
# Click "Test Notification" button
```

**Free Tier:**
- ✅ 10GB Cloud Firestore storage
- ✅ Unlimited push notifications
- ✅ Unlimited analytics
- ✅ 1GB hosting storage

---

## 💳 Razorpay Setup (⚠️ PENDING)

**Purpose:** Online payments (UPI, Cards, Wallets)

### **Step 1: Create Account**
1. Go to: https://dashboard.razorpay.com/signup
2. Sign up with email/phone
3. Complete KYC (business verification)

### **Step 2: Get API Keys**
1. Login to Razorpay Dashboard
2. Go to Settings > API Keys
3. Generate Test Mode keys (for development)

### **Step 3: Add to .env**
```env
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890
VITE_RAZORPAY_KEY_SECRET=secret_key_here
```

### **Step 4: Test Integration**
```bash
# Test with these card details:
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

**Pricing:**
- Transaction fee: 2% per transaction
- No setup cost
- No monthly fees

---

## 📱 Twilio SMS Setup (⚠️ PENDING)

**Purpose:** Send OTP via SMS for verification

### **Step 1: Create Account**
1. Go to: https://www.twilio.com/try-twilio
2. Sign up (get $15 free credit)
3. Verify your phone number

### **Step 2: Get Credentials**
1. From Twilio Console Dashboard:
   - Account SID
   - Auth Token
   - Phone Number

### **Step 3: Add to Backend .env**
```env
# In: backend/.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### **Step 4: Update Backend Code**
File: `backend/src/routes/auth.js`

Find the TODO comment and add:
```javascript
// Send SMS via Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

await client.messages.create({
  body: `Your ManaAuto OTP is: ${otp}`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: `+91${phone}`
});
```

**Pricing:**
- India SMS: $0.0065 per message (~₹0.50)
- Free $15 credit to start
- Pay as you go

---

## 🧪 Testing Your Setup

### **1. Test Google Maps** ✅
```bash
npm run dev
# Visit: http://localhost:8080/home
# Should see map loaded with your location
```

### **2. Test Firebase** (After setup)
```bash
# Visit: http://localhost:8080/setup-status
# Click "Test Notification"
# You should see a browser notification
```

### **3. Test Razorpay** (After setup)
```bash
# Book a ride
# Go to payment screen
# Select "Online Payment"
# Should redirect to Razorpay checkout
```

### **4. Test Twilio** (After setup)
```bash
# Start backend: cd backend && npm run dev
# Go to: http://localhost:8080/auth
# Enter phone number
# You should receive real SMS with OTP
```

---

## 📊 Setup Priority

### **🔴 Critical (Launch Blockers):**
1. ✅ Google Maps API - **DONE**
2. ❌ Firebase (Push notifications)
3. ❌ Razorpay (Payments)

### **🟠 High Priority:**
4. ❌ Twilio SMS (Better UX than mock OTP)
5. Backend deployment (Heroku/AWS)

### **🟢 Optional (Nice to Have):**
6. Analytics (Google Analytics/Mixpanel)
7. Error tracking (Sentry)
8. CDN (Cloudflare)

---

## 💰 Cost Estimate

| Service | Monthly Cost | Free Tier |
|---------|-------------|-----------|
| **Google Maps** | ₹0-₹10,000 | ₹15,000 credit/month |
| **Firebase** | Free | Unlimited (with limits) |
| **Razorpay** | 2% per txn | No monthly fee |
| **Twilio** | ₹0.50/SMS | $15 free credit |
| **Total** | **₹5,000-₹20,000** | **Start FREE** |

---

## 🚀 Quick Setup Commands

### **1. Check Current Status**
```bash
# Visit setup dashboard
http://localhost:8080/setup-status
```

### **2. Update .env File**
```bash
# Open .env file
notepad .env

# Add your API keys
# Save and close
```

### **3. Restart Server**
```powershell
# Kill existing server (Ctrl+C)
# Start again
npm run dev
```

### **4. Verify Changes**
```bash
# Visit setup page again
http://localhost:8080/setup-status

# All services should show "✓ Configured"
```

---

## 📝 Complete .env Template

```env
# ============================================
# MANA AUTO OKA RIDE - Environment Variables
# ============================================

# App Configuration
VITE_APP_NAME=Mana Auto Oka Ride
VITE_APP_VERSION=1.0.0

# ✅ Google Maps API (CONFIGURED)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAwXWQxneG42gUhLnpbjjRsKajML8lWGRw

# Backend API
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# ⚠️ Firebase Configuration (NOT CONFIGURED)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# ⚠️ Payment Gateway (NOT CONFIGURED)
VITE_RAZORPAY_KEY_ID=
VITE_RAZORPAY_KEY_SECRET=

# ⚠️ SMS Gateway (NOT CONFIGURED - Backend)
# Add these to: backend/.env
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=
```

---

## 🔍 Troubleshooting

### **Firebase Not Working?**
```bash
# 1. Check .env file
Get-Content .env | Select-String "FIREBASE"

# 2. Restart dev server
Ctrl+C
npm run dev

# 3. Clear cache
Ctrl+Shift+R in browser
```

### **Maps Not Loading?**
```bash
# Check if API key is correct
Get-Content .env | Select-String "GOOGLE_MAPS"

# Verify in browser console (F12)
# Should NOT see "API key not configured" error
```

### **Payment Not Working?**
```bash
# Test mode keys start with: rzp_test_
# Live mode keys start with: rzp_live_

# Make sure you're using TEST keys during development
```

---

## 📞 Support

**Firebase Issues:**
- Docs: https://firebase.google.com/docs
- Support: https://firebase.google.com/support

**Razorpay Issues:**
- Docs: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

**Twilio Issues:**
- Docs: https://www.twilio.com/docs
- Support: https://www.twilio.com/help

**App Issues:**
- Check: `/setup-status` page
- Backend logs: `cd backend && npm run dev`
- Browser console: Press F12

---

## ✅ Next Steps

1. **Visit Setup Dashboard:**
   ```
   http://localhost:8080/setup-status
   ```

2. **Get Missing API Keys:**
   - Firebase (15 mins)
   - Razorpay (30 mins - needs KYC)
   - Twilio (10 mins)

3. **Update .env File**

4. **Restart & Test**

5. **Deploy to Production!** 🚀

---

**Last Updated:** October 28, 2025  
**Status:** Google Maps ✅ | Firebase ⚠️ | Razorpay ⚠️ | Twilio ⚠️
