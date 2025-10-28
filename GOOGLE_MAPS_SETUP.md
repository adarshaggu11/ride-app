# Google Maps API Setup Guide

## 🗺️ Getting Your API Key

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `Mana Auto Oka Ride`
4. Click **"Create"**

### Step 2: Enable Required APIs
1. In the sidebar, go to **"APIs & Services"** → **"Library"**
2. Search and enable these APIs:
   - ✅ **Maps JavaScript API** (for map display)
   - ✅ **Directions API** (for route drawing)
   - ✅ **Geocoding API** (for address lookup)
   - ✅ **Places API** (for location search)
   - ✅ **Distance Matrix API** (for ETA calculation)

### Step 3: Create API Key
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy the generated API key
4. Click **"Edit API key"** to secure it

### Step 4: Secure Your API Key
1. **Application restrictions**:
   - For development: Select **"HTTP referrers (web sites)"**
     - Add: `http://localhost:*`
     - Add: `http://127.0.0.1:*`
   - For production: Add your domain
     - Example: `https://yourdomain.com/*`

2. **API restrictions**:
   - Select **"Restrict key"**
   - Choose the 5 APIs enabled above

3. Click **"Save"**

## 💳 Billing & Free Tier

### Free Monthly Credits
- Google provides **$200 monthly credit** (₹15,000+)
- This covers approximately:
  - 28,500 map loads
  - 40,000 route calculations
  - More than enough for development and initial users

### Enable Billing
1. Go to **"Billing"** in Cloud Console
2. Click **"Link a billing account"**
3. Add payment method (credit/debit card)
4. **Don't worry**: You won't be charged unless you exceed free tier

## 🔧 Add API Key to Your App

### Create .env File
```bash
# In your project root (mana-auto-oka-ride-main folder)
# Create a file named .env (no extension)
```

### Add Your API Key
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Example:**
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Start again
npm run dev
```

## ✅ Testing Your Setup

1. Open browser: `http://localhost:8080`
2. You should see:
   - ✅ Map loads on Home screen showing current location
   - ✅ Book a ride and see route drawn
   - ✅ Driver marker animates smoothly during trip

### If Map Doesn't Load
Check browser console (F12) for errors:
- **"API key invalid"** → Check if you copied correctly
- **"API not enabled"** → Enable Maps JavaScript API
- **"RefererNotAllowedMapError"** → Add `http://localhost:*` to restrictions

## 🚀 Production Deployment

### Before Launching
1. Create production API key with domain restrictions
2. Enable billing alerts:
   - Go to **"Billing"** → **"Budgets & alerts"**
   - Set budget: ₹500 per month
   - Get email alerts at 50%, 90%, 100%

3. Monitor usage:
   - Dashboard: **"APIs & Services"** → **"Dashboard"**
   - Track daily map loads and API calls

### Cost Optimization Tips
- Cache map data with service workers
- Implement map lazy loading
- Use static maps for thumbnails
- Bundle multiple route requests

## 📊 Expected Usage
### For 100 Daily Active Users
- Map loads: ~500/day
- Route calculations: ~300/day
- **Monthly cost**: Within free tier (₹0)

### For 1,000 Daily Active Users
- Map loads: ~5,000/day
- Route calculations: ~3,000/day
- **Monthly cost**: ~₹1,500 (well within ₹15,000 credit)

## 🆘 Troubleshooting

### Map Shows Gray Screen
```bash
# Check if API key is set
echo $VITE_GOOGLE_MAPS_API_KEY

# Restart dev server
npm run dev
```

### Console Error: "Loading failed"
- Verify all 5 APIs are enabled
- Check billing is active
- Confirm API key restrictions

### Map Loads But No Routes
- Enable **Directions API**
- Check API key has access to Directions API

## 📞 Support
If you face issues:
1. Check [Google Maps Platform Status](https://status.cloud.google.com/)
2. Review [API Documentation](https://developers.google.com/maps/documentation)
3. Check your billing account for issues

---

## 🎉 Ready to Test!

Once you've added the API key:
```bash
npm run dev
```

Then test the complete flow:
1. **Home Screen** → Map shows your location
2. **Book Ride** → Route drawn between pickup/drop
3. **Driver Assigned** → See driver approaching
4. **Trip Ongoing** → Watch vehicle move in real-time! 🚗

Enjoy your live tracking feature! 🎊
