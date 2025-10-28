# 🚀 Quick Start - Ride Estimation System

## 📍 Test Coordinates (Hyderabad)

### Short Distance (~8 km)
```
Pickup:  17.385, 78.486  (Hyderabad Central)
Drop:    17.450, 78.512  (Secunderabad)
```

### Medium Distance (~42 km)
```
Pickup:  17.385, 78.486  (Hyderabad)
Drop:    17.700, 78.750  (Outer Ring Road)
```

### Long Distance (~55 km)
```
Pickup:  17.385, 78.486  (Hyderabad)
Drop:    17.850, 78.900  (Shamshabad)
```

---

## 💰 Price Examples

### 10 km Ride - Normal Hours (12:00 PM)
- **Bike:** ₹100 (₹20 base + 10 × ₹8)
- **Auto:** ₹150 (₹30 base + 10 × ₹12)
- **Car:** ₹200 (₹50 base + 10 × ₹15)

### 10 km Ride - Peak Hours (8:00 AM) 🔥
- **Bike:** ₹140 (with 1.5x surge)
- **Auto:** ₹210 (with 1.5x surge)
- **Car:** ₹275 (with 1.5x surge)

---

## ⏰ Peak Hours (Surge Pricing)
- **Morning:** 8:00 AM - 10:00 AM
- **Evening:** 6:00 PM - 9:00 PM
- **Multiplier:** 1.5x (50% increase)

---

## 📏 Distance Limits
- 🏍️ **Bike:** Max 35 km
- 🛺 **Auto:** Max 45 km
- 🚗 **Car:** Max 60 km

---

## 🧪 Test Demo Component

### Add to App.tsx:
```typescript
import RideEstimatorDemo from "./components/RideEstimatorDemo";

<Route path="/demo/estimator" element={<RideEstimatorDemo />} />
```

### Access at:
```
http://localhost:5173/demo/estimator
```

---

## 📞 Key Functions

```typescript
// Get distance
getDistanceBetweenPoints(pickup, drop) // → km

// Check surge
getSurgeStatus() // → { isActive, multiplier, message }

// Calculate fare
calculateFare(distance, 'bike', true) // → rupees (with surge)

// Validate distance
validateRideDistance('auto', pickup, drop) // → ValidationResult

// Check pickup proximity
validatePickupProximity(userLoc, pickupLoc) // → { isValid, warning }
```

---

## 🎯 Quick Test

1. **Open:** `/demo/estimator`
2. **Click:** "Get Current Location"
3. **Enter:**
   - Pickup: `17.385, 78.486`
   - Drop: `17.450, 78.512`
4. **Select:** Any vehicle
5. **See:** Distance, Duration, Fare

---

## 🔧 Customize

**Ride Limits:** `src/utils/distanceValidation.ts` → `RIDE_LIMITS`  
**Pricing:** `calculateFare()` → `pricing` object  
**Surge Hours:** `getSurgeMultiplier()` → `isPeakHours` logic  
**Proximity:** `validatePickupProximity()` → `maxDistanceKm` param

---

## ✅ Status

✅ Haversine distance calculation  
✅ Surge pricing (peak hours)  
✅ Dynamic fare calculation  
✅ Distance validation  
✅ Pickup proximity check  
✅ Duration estimation  
✅ Demo component  
✅ UI integration  

**Version:** 2.0  
**Committed:** 3734b14  
**Pushed:** ✅ GitHub
