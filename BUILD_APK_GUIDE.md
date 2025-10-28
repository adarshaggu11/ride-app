# 📱 Build APK for Android - Complete Guide

## ✅ **Steps Completed**

1. ✅ Production build created (`npm run build`)
2. ✅ Capacitor config updated (removed remote server URL)
3. ✅ Android platform added (`npx cap add android`)

---

## 🔨 **Build APK Now**

### **Method 1: Using Android Studio (Recommended)**

1. **Open Android Studio**:
   ```bash
   cd c:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main
   npx cap open android
   ```

2. **Wait for Gradle sync** to complete (bottom status bar)

3. **Build APK**:
   - Click **Build** menu → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait 2-5 minutes for build to complete
   - You'll see notification: "APK(s) generated successfully"

4. **Find your APK**:
   - Click "locate" in the notification OR
   - Go to: `android\app\build\outputs\apk\debug\app-debug.apk`

5. **Transfer to phone**:
   - Copy `app-debug.apk` to your phone via USB or Google Drive
   - Install and test!

---

### **Method 2: Using Command Line (Faster)**

```bash
# Navigate to android folder
cd android

# Build debug APK
gradlew assembleDebug

# Or build release APK (signed)
gradlew assembleRelease
```

**Output location**:
- Debug: `android\app\build\outputs\apk\debug\app-debug.apk`
- Release: `android\app\build\outputs\apk\release\app-release-unsigned.apk`

---

## 📋 **Prerequisites**

### **Check if you have:**

1. **Android Studio** installed
   - Download from: https://developer.android.com/studio
   - Install with default settings

2. **Java JDK** (8 or 11)
   - Check: `java -version`
   - Download if needed: https://adoptium.net/

3. **Android SDK**
   - Installed automatically with Android Studio
   - Make sure SDK 33 or higher is installed

---

## 🚀 **Quick Build Steps**

```powershell
# Step 1: Navigate to project
cd c:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main

# Step 2: Open in Android Studio
npx cap open android

# Step 3: In Android Studio
# Build → Build Bundle(s) / APK(s) → Build APK(s)

# Step 4: Get your APK from
# android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📱 **Install on Your Phone**

### **Option A: Direct USB**
1. Enable **Developer Options** on phone (Settings → About → Tap Build Number 7 times)
2. Enable **USB Debugging** (Developer Options → USB Debugging)
3. Connect phone to PC
4. In Android Studio: **Run** menu → **Run 'app'**
5. Select your device from list

### **Option B: APK File**
1. Copy `app-debug.apk` to phone (via USB, WhatsApp, Drive, etc.)
2. On phone: Open file explorer → Tap APK
3. Allow "Install from Unknown Sources" if prompted
4. Install and open!

---

## ⚙️ **Update Backend URL for Mobile**

Since your backend is on `localhost:3000`, it won't work from mobile. You need to:

### **Option 1: Use your PC's IP address**

1. **Get your PC's local IP**:
   ```powershell
   ipconfig
   # Look for "IPv4 Address" under your WiFi adapter
   # Example: 192.168.1.5
   ```

2. **Update AuthScreen.tsx** (3 places):
   ```typescript
   // Change from:
   fetch('http://localhost:3000/api/auth/send-otp', ...)
   
   // Change to (use YOUR PC's IP):
   fetch('http://192.168.1.5:3000/api/auth/send-otp', ...)
   ```

3. **Rebuild**:
   ```bash
   npm run build
   npx cap sync
   npx cap open android
   # Build APK again
   ```

4. **Make sure phone and PC are on same WiFi network**

### **Option 2: Deploy backend online** (Better for real testing)
- Deploy to Render, Railway, or Heroku
- Update all `localhost:3000` references to your deployed URL

---

## 🎯 **Current APK Features**

Your APK will have:
- ✅ Customer & Driver OTP authentication
- ✅ Mobile OTP login (displayed in green box)
- ✅ Driver 3-step registration
- ✅ Google Maps integration
- ✅ Live tracking (when backend connected)
- ✅ Profile screens (rides, payments, help)
- ✅ Bilingual UI (English + Telugu)

---

## 🔍 **Testing Checklist**

When you install on your phone:

### **Test 1: OTP Login**
- [ ] Open app
- [ ] Enter phone number
- [ ] OTP appears in green box
- [ ] Can verify OTP
- [ ] Name entry works
- [ ] Redirects to home screen

### **Test 2: Driver Registration**
- [ ] Select "Driver" tab
- [ ] OTP works
- [ ] 3-step form loads
- [ ] Can fill all fields
- [ ] Document uploads work
- [ ] Submission successful

### **Test 3: Maps**
- [ ] Home screen shows Google Maps
- [ ] Location permission requested
- [ ] Map loads correctly
- [ ] Can interact with map

---

## 🐛 **Common Issues**

### **"App keeps crashing"**
- Check Android version (need Android 7.0+)
- Check logcat in Android Studio for errors
- Make sure all permissions granted

### **"Can't connect to backend"**
- Make sure PC and phone on same WiFi
- Backend server must be running
- Use PC's IP address, not localhost
- Check firewall isn't blocking port 3000

### **"Map not loading"**
- Google Maps API key must be valid
- Enable Android Maps SDK in Google Cloud Console
- Add API key to app

### **"Gradle build failed"**
- Update Android Studio to latest version
- Sync Gradle files
- Check Java version (need JDK 11)

---

## 📦 **APK Size**

Expected APK size: ~15-25 MB
- Debug APK: ~20 MB (larger, with debug symbols)
- Release APK: ~15 MB (optimized, minified)

---

## 🎉 **You're Ready!**

**Next command to run:**
```powershell
npx cap open android
```

Then in Android Studio:
**Build → Build Bundle(s) / APK(s) → Build APK(s)**

Your APK will be ready in 2-5 minutes! 🚀

---

## 💡 **Pro Tips**

1. **Build release APK for production**:
   - Smaller file size
   - Better performance
   - Need to sign it

2. **Enable R8 shrinking** (reduces APK size):
   - Edit `android/app/build.gradle`
   - Set `minifyEnabled true`

3. **Test on multiple devices**:
   - Different screen sizes
   - Different Android versions
   - Different manufacturers

4. **Use PC's IP for testing**:
   - Easier than deploying backend
   - Works on local network
   - Great for development

---

**Ready to build? Run:** `npx cap open android` and click Build! 📱✨
