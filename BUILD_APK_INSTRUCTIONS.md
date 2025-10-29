# 📱 Build APK Instructions

Your app is **ready to build**! The production build was successful. Now you need to install Android Studio to build the APK.

## ✅ What's Already Done

- ✅ Production web build completed successfully
- ✅ Capacitor Android platform configured
- ✅ Web assets synced to Android project
- ✅ All code is production-ready

## 🛠️ Prerequisites Needed

You need to install **Android Studio** and **Android SDK** to build the APK.

---

## 📦 Step-by-Step Guide

### 1️⃣ Install Android Studio

1. **Download Android Studio:**
   - Go to: https://developer.android.com/studio
   - Download Android Studio for Windows
   - Size: ~1 GB

2. **Install Android Studio:**
   - Run the installer
   - Follow the setup wizard
   - Choose "Standard" installation
   - Accept all SDK components it wants to install
   - Wait for downloads to complete (this may take 15-30 minutes)

3. **Verify Installation:**
   - Android SDK will be installed at: `C:\Users\Adarsh Kumar Aggu\AppData\Local\Android\Sdk`

---

### 2️⃣ Configure Android SDK Path

After Android Studio is installed, run this command in PowerShell:

```powershell
cd "C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main\android"
```

Create a `local.properties` file:

```powershell
echo "sdk.dir=C:\\Users\\Adarsh Kumar Aggu\\AppData\\Local\\Android\\Sdk" > local.properties
```

**OR** set the environment variable:

```powershell
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\Adarsh Kumar Aggu\AppData\Local\Android\Sdk', 'User')
```

---

### 3️⃣ Build the APK

Once Android Studio is installed, run these commands:

#### **Option A: Build Debug APK (Faster, No Signing Required)**

```powershell
cd "C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main\android"
.\gradlew assembleDebug
```

**Output:** `android\app\build\outputs\apk\debug\app-debug.apk`

#### **Option B: Build Release APK (Production, Requires Signing)**

```powershell
cd "C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main\android"
.\gradlew assembleRelease
```

**Output:** `android\app\build\outputs\apk\release\app-release-unsigned.apk`

---

### 4️⃣ Using Android Studio (Alternative Method)

If you prefer using Android Studio GUI:

1. Open Android Studio
2. Click **"Open an Existing Project"**
3. Navigate to: `C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main\android`
4. Wait for Gradle sync to complete
5. Click **Build → Build Bundle(s) / APK(s) → Build APK(s)**
6. Wait for build to complete (2-5 minutes)
7. Click **"locate"** when the notification appears

---

## 🚀 Quick Build Script (After Android Studio is Installed)

I've created a convenient script. After installing Android Studio, run:

```powershell
cd "C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main"
npm run android:build
```

This will:
1. Build the production web assets
2. Sync to Android
3. Build the release APK

---

## 📍 Where to Find Your APK

After successful build:

- **Debug APK:** `android\app\build\outputs\apk\debug\app-debug.apk`
- **Release APK:** `android\app\build\outputs\apk\release\app-release.apk`

---

## 🔧 Troubleshooting

### "SDK location not found"
- Make sure Android Studio is installed
- Create `local.properties` file as shown above
- Restart your terminal after installation

### "Gradle build failed"
- Open Android Studio once to complete setup
- Let it download all SDK components
- Try building through Android Studio first

### "Command not found: gradlew"
- Make sure you're in the `android` folder
- Use `.\gradlew` (with dot-slash) on Windows PowerShell

### Build is slow
- First build takes 5-10 minutes (downloads dependencies)
- Subsequent builds are much faster (1-2 minutes)

---

## 📱 Testing the APK

1. **Transfer APK to your Android phone:**
   - Via USB cable
   - Or upload to Google Drive/cloud storage

2. **Install on phone:**
   - Enable "Install from Unknown Sources" in Settings
   - Open the APK file
   - Click Install

3. **Test all features:**
   - Check if maps work
   - Test location permissions
   - Verify ride booking flow

---

## 🎯 Next Steps After Building APK

1. **Test the debug APK** on a real device
2. **Generate a signed release APK** for distribution:
   - Create a keystore file
   - Sign the APK
   - Optimize and align with zipalign

3. **Publish to Google Play Store** (optional):
   - Create a Google Play Developer account ($25 one-time fee)
   - Prepare store listing
   - Upload signed APK or AAB (Android App Bundle)

---

## 💡 Pro Tips

- **Debug APK** is good for testing, but larger and unoptimized
- **Release APK** is smaller, faster, and production-ready
- Always test on **multiple real devices** before releasing
- Use **Android App Bundle (.aab)** format for Play Store (better optimization)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check that Android Studio installed correctly
2. Verify SDK path is correct
3. Try opening the project in Android Studio once
4. Make sure you have enough disk space (10+ GB free)

---

**Your app is production-ready! Just install Android Studio and you can build the APK in minutes! 🚀**
