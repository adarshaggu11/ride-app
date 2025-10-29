@echo off
echo ========================================
echo   RideShare App - APK Builder
echo ========================================
echo.

REM Check if Android SDK exists
if not exist "%LOCALAPPDATA%\Android\Sdk" (
    echo [ERROR] Android SDK not found!
    echo.
    echo Please install Android Studio first:
    echo https://developer.android.com/studio
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo [OK] Android SDK found
echo.

REM Create local.properties if it doesn't exist
if not exist "android\local.properties" (
    echo Creating local.properties...
    echo sdk.dir=%LOCALAPPDATA%\Android\Sdk > android\local.properties
    echo [OK] local.properties created
) else (
    echo [OK] local.properties exists
)

echo.
echo Choose build type:
echo 1. Debug APK (faster, for testing)
echo 2. Release APK (optimized, for production)
echo.

set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Building Debug APK...
    echo.
    call npm run build:prod
    call npx cap sync android
    cd android
    call gradlew assembleDebug
    cd ..
    
    echo.
    echo ========================================
    echo   APK BUILD COMPLETE!
    echo ========================================
    echo.
    echo APK Location:
    echo android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    explorer android\app\build\outputs\apk\debug
) else if "%choice%"=="2" (
    echo.
    echo Building Release APK...
    echo.
    call npm run build:prod
    call npx cap sync android
    cd android
    call gradlew assembleRelease
    cd ..
    
    echo.
    echo ========================================
    echo   APK BUILD COMPLETE!
    echo ========================================
    echo.
    echo APK Location:
    echo android\app\build\outputs\apk\release\app-release-unsigned.apk
    echo.
    explorer android\app\build\outputs\apk\release
) else (
    echo Invalid choice!
    pause
    exit /b 1
)

echo.
pause
