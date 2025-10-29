# 🚀 Quick Start - Building Your RideShare APK

## ⚡ The Easy Way

### Step 1: Install Android Studio
Download and install from: **https://developer.android.com/studio**

### Step 2: Run the Build Script
Double-click: **`build-apk.bat`** or **`build-apk.ps1`**

### Step 3: Choose Build Type
- **Debug** - For testing (5-10 minutes)
- **Release** - For production (5-10 minutes)

### Step 4: Get Your APK! 
The script will automatically open the folder with your APK file.

---

## 📦 What's Already Done For You

✅ Production build completed  
✅ All bugs fixed  
✅ Map component optimized  
✅ Android project configured  
✅ Build scripts ready  

**You just need Android Studio!**

---

## 📱 APK Locations

- **Debug:** `android\app\build\outputs\apk\debug\app-debug.apk`
- **Release:** `android\app\build\outputs\apk\release\app-release-unsigned.apk`

---

## 🔧 Manual Build (If Scripts Don't Work)

```powershell
# 1. Set SDK path (one-time setup)
echo "sdk.dir=C:\Users\Adarsh Kumar Aggu\AppData\Local\Android\Sdk" > android\local.properties

# 2. Build web assets
npm run build:prod

# 3. Sync to Android
npx cap sync android

# 4. Build APK
cd android
.\gradlew assembleDebug
cd ..
```

---

## 🆘 Troubleshooting

### "Android SDK not found"
- Install Android Studio
- Restart your computer
- Run the script again

### "Build failed"
- Open Android Studio once
- Let it download all components
- Try building in Android Studio GUI first

### "Gradlew not found"
- Make sure you're in the project root folder
- Run `cd android` first if using gradlew directly

---

## 📖 Full Documentation

For detailed instructions, see: **`BUILD_APK_INSTRUCTIONS.md`**

---

**Need help? The build scripts will guide you through each step! 🎯**
