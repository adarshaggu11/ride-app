# Quick APK Build Script
# Run this after installing Android Studio

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RideShare App - APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Android SDK exists
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (-not (Test-Path $sdkPath)) {
    Write-Host "❌ Android SDK not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Android Studio first:" -ForegroundColor Yellow
    Write-Host "https://developer.android.com/studio" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Android SDK found at: $sdkPath" -ForegroundColor Green
Write-Host ""

# Create local.properties if it doesn't exist
$localPropsPath = "android\local.properties"
if (-not (Test-Path $localPropsPath)) {
    Write-Host "📝 Creating local.properties..." -ForegroundColor Yellow
    $sdkPathEscaped = $sdkPath -replace '\\', '\\'
    "sdk.dir=$sdkPathEscaped" | Out-File -FilePath $localPropsPath -Encoding ASCII
    Write-Host "✅ local.properties created" -ForegroundColor Green
} else {
    Write-Host "✅ local.properties exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Building APK..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Build production web assets
Write-Host "Step 1/3: Building web assets..." -ForegroundColor Yellow
npm run build:prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Web build failed!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Web build complete" -ForegroundColor Green
Write-Host ""

# Step 2: Sync to Android
Write-Host "Step 2/3: Syncing to Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Sync failed!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Sync complete" -ForegroundColor Green
Write-Host ""

# Step 3: Build APK
Write-Host "Step 3/3: Building APK..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose build type:" -ForegroundColor Cyan
Write-Host "1. Debug APK (faster, for testing)" -ForegroundColor White
Write-Host "2. Release APK (optimized, for production)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Building Debug APK..." -ForegroundColor Yellow
    cd android
    .\gradlew assembleDebug
    cd ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ DEBUG APK BUILD SUCCESSFUL!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "APK Location:" -ForegroundColor Cyan
        Write-Host "android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Yellow
        Write-Host ""
        
        # Try to open the folder
        $apkFolder = "android\app\build\outputs\apk\debug"
        if (Test-Path $apkFolder) {
            Write-Host "Opening APK folder..." -ForegroundColor Cyan
            explorer.exe $apkFolder
        }
    } else {
        Write-Host ""
        Write-Host "❌ APK build failed!" -ForegroundColor Red
        Write-Host "Try opening the project in Android Studio first." -ForegroundColor Yellow
    }
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Building Release APK..." -ForegroundColor Yellow
    cd android
    .\gradlew assembleRelease
    cd ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ RELEASE APK BUILD SUCCESSFUL!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "APK Location:" -ForegroundColor Cyan
        Write-Host "android\app\build\outputs\apk\release\app-release-unsigned.apk" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "⚠️  Note: This APK is unsigned. For production, you need to sign it." -ForegroundColor Yellow
        Write-Host ""
        
        # Try to open the folder
        $apkFolder = "android\app\build\outputs\apk\release"
        if (Test-Path $apkFolder) {
            Write-Host "Opening APK folder..." -ForegroundColor Cyan
            explorer.exe $apkFolder
        }
    } else {
        Write-Host ""
        Write-Host "❌ APK build failed!" -ForegroundColor Red
        Write-Host "Try opening the project in Android Studio first." -ForegroundColor Yellow
    }
} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
pause
