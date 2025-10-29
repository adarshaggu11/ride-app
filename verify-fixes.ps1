#!/usr/bin/env pwsh
# Quick verification script to check if all fixes are applied correctly

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Package Consistency Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = "c:\Users\Adarsh Kumar Aggu\Downloads\mana-auto-oka-ride-main\mana-auto-oka-ride-main"
$errors = 0
$warnings = 0

# Check 1: MainActivity package
Write-Host "Checking MainActivity package..." -ForegroundColor Yellow
$mainActivity = Get-Content "$projectRoot\android\app\src\main\java\com\ridesharing\app\MainActivity.java" -Raw
if ($mainActivity -match "package com\.ridesharing\.app") {
    Write-Host "  ✅ MainActivity package: com.ridesharing.app" -ForegroundColor Green
} else {
    Write-Host "  ❌ MainActivity package is incorrect!" -ForegroundColor Red
    $errors++
}

# Check 2: build.gradle namespace
Write-Host "Checking build.gradle namespace..." -ForegroundColor Yellow
$buildGradle = Get-Content "$projectRoot\android\app\build.gradle" -Raw
if ($buildGradle -match 'namespace "com\.ridesharing\.app"') {
    Write-Host "  ✅ build.gradle namespace: com.ridesharing.app" -ForegroundColor Green
} else {
    Write-Host "  ❌ build.gradle namespace is incorrect!" -ForegroundColor Red
    $errors++
}

# Check 3: strings.xml package
Write-Host "Checking strings.xml package..." -ForegroundColor Yellow
$stringsXml = Get-Content "$projectRoot\android\app\src\main\res\values\strings.xml" -Raw
if ($stringsXml -match "com\.ridesharing\.app") {
    Write-Host "  ✅ strings.xml package: com.ridesharing.app" -ForegroundColor Green
} else {
    Write-Host "  ❌ strings.xml package is incorrect!" -ForegroundColor Red
    $errors++
}

# Check 4: capacitor.config.ts appId
Write-Host "Checking Capacitor config..." -ForegroundColor Yellow
$capacitorConfig = Get-Content "$projectRoot\capacitor.config.ts" -Raw
if ($capacitorConfig -match "appId: 'com\.ridesharing\.app'") {
    Write-Host "  ✅ Capacitor appId: com.ridesharing.app" -ForegroundColor Green
} else {
    Write-Host "  ❌ Capacitor appId is incorrect!" -ForegroundColor Red
    $errors++
}

# Check 5: MainActivity file exists in correct location
Write-Host "Checking MainActivity location..." -ForegroundColor Yellow
if (Test-Path "$projectRoot\android\app\src\main\java\com\ridesharing\app\MainActivity.java") {
    Write-Host "  ✅ MainActivity in correct directory" -ForegroundColor Green
} else {
    Write-Host "  ❌ MainActivity not in correct directory!" -ForegroundColor Red
    $errors++
}

# Check 6: Old MainActivity removed
Write-Host "Checking old MainActivity removed..." -ForegroundColor Yellow
if (-not (Test-Path "$projectRoot\android\app\src\main\java\com\manaride\app\MainActivity.java")) {
    Write-Host "  ✅ Old MainActivity removed" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Old MainActivity still exists (should be removed)" -ForegroundColor Yellow
    $warnings++
}

# Check 7: colors.xml exists
Write-Host "Checking colors.xml..." -ForegroundColor Yellow
if (Test-Path "$projectRoot\android\app\src\main\res\values\colors.xml") {
    Write-Host "  ✅ colors.xml exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ colors.xml is missing!" -ForegroundColor Red
    $errors++
}

# Check 8: ProGuard rules updated
Write-Host "Checking ProGuard rules..." -ForegroundColor Yellow
$proguardRules = Get-Content "$projectRoot\android\app\proguard-rules.pro" -Raw
if ($proguardRules -match "Keep Capacitor classes" -and $proguardRules -match "com\.ridesharing\.app\.MainActivity") {
    Write-Host "  ✅ ProGuard rules updated with Capacitor and MainActivity" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  ProGuard rules may need review" -ForegroundColor Yellow
    $warnings++
}

# Check 9: AndroidManifest permissions
Write-Host "Checking AndroidManifest permissions..." -ForegroundColor Yellow
$manifest = Get-Content "$projectRoot\android\app\src\main\AndroidManifest.xml" -Raw
$requiredPerms = @("ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION", "INTERNET", "CAMERA")
$missingPerms = @()

foreach ($perm in $requiredPerms) {
    if ($manifest -notmatch $perm) {
        $missingPerms += $perm
    }
}

if ($missingPerms.Count -eq 0) {
    Write-Host "  ✅ All essential permissions present" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Missing permissions: $($missingPerms -join ', ')" -ForegroundColor Yellow
    $warnings++
}

# Check 10: dist folder exists (web build)
Write-Host "Checking web build..." -ForegroundColor Yellow
if (Test-Path "$projectRoot\dist\index.html") {
    Write-Host "  ✅ Web build exists (dist/index.html)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Web build not found. Run: npm run build:prod" -ForegroundColor Yellow
    $warnings++
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Verification Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ All checks passed! Your project is ready to build." -ForegroundColor Green
    Write-Host "`nNext: Commit and push to trigger GitHub Actions build" -ForegroundColor Cyan
} elseif ($errors -eq 0) {
    Write-Host "✅ No critical errors found" -ForegroundColor Green
    Write-Host "⚠️  $warnings warning(s) - review recommended but not blocking" -ForegroundColor Yellow
} else {
    Write-Host "❌ Found $errors critical error(s)" -ForegroundColor Red
    if ($warnings -gt 0) {
        Write-Host "⚠️  Also found $warnings warning(s)" -ForegroundColor Yellow
    }
    Write-Host "`nPlease fix the errors before building." -ForegroundColor Red
}

Write-Host "`n========================================`n" -ForegroundColor Cyan

# Return exit code based on errors
exit $errors
