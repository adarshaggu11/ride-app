# Build APK After Installing Java

## ✅ **After Java Installation Complete**

### **Step 1: Verify Java is Installed**

Open a **NEW** PowerShell window (fresh terminal) and run:

```powershell
java -version
```

You should see:
```
openjdk version "17.0.13" 2024-10-15
```

If you see "command not found", Java didn't install properly or path not set.

---

### **Step 2: Set JAVA_HOME (If Needed)**

If `java -version` doesn't work, manually set JAVA_HOME:

```powershell
# Find where Java was installed
Get-ChildItem "C:\Program Files" -Recurse -Depth 1 | Where-Object { $_.Name -eq "java.exe" }

# Once you find it (e.g., C:\Program Files\Java\jdk-17\bin\java.exe)
# Set JAVA_HOME to the parent folder (without \bin)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Test again
java -version
```

---

### **Step 3: Build the APK**

Once Java is working:

```powershell
# Navigate to android folder
cd "C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main\android"

# Build debug APK
.\gradlew assembleDebug
```

This will take 5-10 minutes on first build (downloads dependencies).

---

### **Step 4: Get Your APK**

After successful build, your APK will be at:

```
C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🔧 **If Java Installation Failed**

### **Option A: Reinstall Java**
1. Download again: https://adoptium.net/temurin/releases/?version=17
2. Choose:
   - **Operating System**: Windows
   - **Architecture**: x64  
   - **Package Type**: JDK
   - **Version**: 17 - LTS
3. Click `.msi` file to download
4. Run installer
5. **Important**: Check "Set JAVA_HOME variable" during installation
6. **Important**: Check "Add to PATH" during installation

### **Option B: Use Android Studio Instead**
1. Download: https://developer.android.com/studio
2. Install with default options
3. Open PowerShell:
   ```powershell
   cd "C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main"
   npx cap open android
   ```
4. In Android Studio: **Build → Build APK**

---

## 🚀 **Quick Commands (Copy-Paste)**

**After Java is installed and working:**

```powershell
# Go to project
cd "C:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main\android"

# Build APK
.\gradlew assembleDebug

# Find APK
cd app\build\outputs\apk\debug
dir
# You'll see: app-debug.apk
```

---

## 📱 **Transfer APK to Phone**

### **Method 1: USB Cable**
1. Connect phone to PC
2. Copy `app-debug.apk` to phone's Download folder
3. On phone: Open file manager → Downloads → Tap APK
4. Install (allow unknown sources if prompted)

### **Method 2: Google Drive**
1. Upload `app-debug.apk` to Google Drive
2. On phone: Open Drive → Download APK
3. Install

### **Method 3: WhatsApp**
1. Send APK to yourself on WhatsApp
2. Download on phone
3. Install

---

## ✅ **Verification Steps**

Before building, verify Java works:

```powershell
# Test 1: Java version
java -version
# Should show: openjdk version "17.x.x"

# Test 2: JAVA_HOME
echo $env:JAVA_HOME
# Should show path like: C:\Program Files\Java\jdk-17

# Test 3: Javac (Java compiler)
javac -version
# Should show: javac 17.x.x
```

If all 3 tests pass → Ready to build!

If any test fails → Java not installed correctly

---

## 🎯 **Current Status**

✅ Production build created (`dist` folder)  
✅ Android project added  
✅ Capacitor configured  
⏳ **Waiting for Java to be installed**  
⏳ Then build APK with Gradle  

---

## 💡 **Need Help?**

If stuck:
1. Close ALL PowerShell windows
2. Open NEW PowerShell window
3. Run: `java -version`
4. Share the output with me

Or simply install Android Studio - it includes everything needed! 🛠️
