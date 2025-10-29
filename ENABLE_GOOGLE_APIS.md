# 🗺️ Enable Required Google Maps APIs

## ✅ Your API Key (Already Configured)
```
AIzaSyAwXWQxneG42gUhLnpbjjRsKajML8lWGRw
```

## 🎯 Required APIs for Ride-Sharing App

### Step 1: Go to API Library
1. Open Google Cloud Console: https://console.cloud.google.com/
2. Make sure **"My First Project"** is selected
3. Click on **Navigation Menu (☰)** → **APIs & Services** → **Library**

### Step 2: Enable Each API (One by One)

#### 1️⃣ Maps JavaScript API ⭐ CRITICAL
**Search:** "Maps JavaScript API"
- Click on the result
- Click **"ENABLE"** button
- **Why:** Displays interactive maps in your app

#### 2️⃣ Directions API ⭐ CRITICAL  
**Search:** "Directions API"
- Click on the result
- Click **"ENABLE"** button
- **Why:** Calculates and draws routes between locations

#### 3️⃣ Distance Matrix API ⭐ CRITICAL
**Search:** "Distance Matrix API"
- Click on the result
- Click **"ENABLE"** button
- **Why:** Calculates ETA and distance for fare estimation

#### 4️⃣ Places API ⭐ CRITICAL
**Search:** "Places API"
- Click on the result
- Click **"ENABLE"** button
- **Why:** Location search, autocomplete, address lookup

#### 5️⃣ Geocoding API ⭐ CRITICAL
**Search:** "Geocoding API"
- Click on the result
- Click **"ENABLE"** button
- **Why:** Converts addresses ↔ GPS coordinates

---

## 🔧 Step 3: Configure API Key Restrictions

### Go to Credentials
1. **APIs & Services** → **Credentials**
2. Click on your API key (shows like `AIzaSyAwX...`)
3. Click **"Edit API key"**

### Set Application Restrictions
**For Development:**
```
Type: HTTP referrers (websites)
Referrers:
  - http://localhost:*/*
  - http://127.0.0.1:*/*
```

**For Production (Add later):**
```
  - https://yourdomain.com/*
  - https://*.yourdomain.com/*
```

### Set API Restrictions
**Select:** ✅ Restrict key

**Check these 5 APIs:**
- ✅ Maps JavaScript API
- ✅ Directions API
- ✅ Distance Matrix API
- ✅ Places API
- ✅ Geocoding API

Click **"SAVE"**

---

## 💳 Step 4: Enable Billing (Required for APIs to work)

### Why Billing is Required
- Google provides **₹15,000 ($200)** FREE credit every month
- APIs won't work without billing enabled
- You won't be charged unless you exceed free tier

### Enable Billing
1. Go to **Navigation Menu (☰)** → **Billing**
2. Click **"Link a billing account"**
3. Click **"CREATE BILLING ACCOUNT"**
4. Enter details:
   - Account name: "Ride App Billing"
   - Country: India
   - Currency: INR (₹)
5. Add payment method:
   - Credit/Debit card
   - UPI (via credit card)
6. Click **"Submit and enable billing"**

### Set Budget Alert (Recommended)
1. Go to **Billing** → **Budgets & alerts**
2. Click **"CREATE BUDGET"**
3. Set:
   - Name: "Monthly Budget"
   - Budget amount: ₹1,000
   - Alert thresholds: 50%, 90%, 100%
4. Add your email for alerts
5. Click **"FINISH"**

---

## 📊 Verify APIs are Enabled

### Method 1: Check in Console
1. Go to **APIs & Services** → **Dashboard**
2. You should see all 5 APIs listed with usage graphs

### Method 2: Check API Status Page
1. Go to **APIs & Services** → **Enabled APIs & services**
2. Verify these are in the list:
   - ✅ Maps JavaScript API
   - ✅ Directions API
   - ✅ Distance Matrix API
   - ✅ Places API
   - ✅ Geocoding API

### Method 3: Test in Your App
```powershell
# In your project folder
cd "c:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main"

# Start the app
npm run dev
```

**Visit:** http://localhost:8080/home

**Expected Results:**
- ✅ Map loads and shows your current location
- ✅ Search locations works (autocomplete)
- ✅ "Book Ride" draws route on map
- ✅ Shows distance and fare estimation

---

## 🚨 Troubleshooting

### Error: "This API project is not authorized to use this API"
**Solution:**
1. Make sure billing is enabled
2. Go to API Library and enable the specific API
3. Wait 2-3 minutes for changes to propagate

### Error: "API keys with referer restrictions cannot be used"
**Solution:**
1. Go to Credentials → Edit your API key
2. Under "Application restrictions", select "HTTP referrers"
3. Add `http://localhost:*/*`
4. Save and wait 2 minutes

### Map shows but routes don't work
**Solution:**
- Enable **Directions API**
- Enable **Distance Matrix API**
- Clear browser cache (Ctrl+Shift+Delete)

### Location search doesn't work
**Solution:**
- Enable **Places API**
- Enable **Geocoding API**
- Restart your dev server

---

## 💰 Cost Breakdown (Don't Worry - It's FREE!)

### Free Monthly Credit: ₹15,000 ($200)

**What this covers:**
- 🗺️ Map loads: 28,500 per month
- 🧭 Route calculations: 40,000 per month
- 🔍 Place searches: 30,000 per month
- 📍 Geocoding: 40,000 per month

**For 100 daily users:**
- Map loads: ~3,000/month
- Routes: ~2,000/month
- **Cost:** ₹0 (within free tier)

**For 1,000 daily users:**
- Map loads: ~30,000/month
- Routes: ~20,000/month
- **Cost:** ~₹1,500/month (well within ₹15,000 credit)

---

## ✅ Quick Checklist

Before testing your app, verify:

- [ ] Billing enabled in Google Cloud Console
- [ ] Maps JavaScript API enabled
- [ ] Directions API enabled
- [ ] Distance Matrix API enabled
- [ ] Places API enabled
- [ ] Geocoding API enabled
- [ ] API key restrictions configured
- [ ] Budget alert set (₹1,000/month)

---

## 🎉 Ready to Test!

Once all APIs are enabled:

```powershell
# Start your app
npm run dev
```

**Test Flow:**
1. ✅ Open http://localhost:8080/home
2. ✅ See map with your location
3. ✅ Search for a destination
4. ✅ Click "Book Ride"
5. ✅ See route drawn on map
6. ✅ See distance and fare

---

## 📞 Need Help?

### Check API Status
**Dashboard:** https://console.cloud.google.com/apis/dashboard

### Check Billing
**Billing:** https://console.cloud.google.com/billing

### Check Quotas
**Quotas:** https://console.cloud.google.com/apis/api/maps-backend.googleapis.com/quotas

---

**Last Updated:** October 29, 2025
**Status:** Ready to enable APIs ✅
