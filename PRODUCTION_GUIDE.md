# Production Deployment Guide

## 🚀 Production Build Checklist

### Before Building for Production

1. **Environment Configuration**
   - [ ] Copy `.env.production` and configure all API keys
   - [ ] Set `VITE_GOOGLE_MAPS_API_KEY` with production key
   - [ ] Configure `VITE_API_BASE_URL` with your backend URL
   - [ ] Set `VITE_WS_URL` for WebSocket connections
   - [ ] Add payment gateway keys if applicable

2. **App Configuration**
   - [ ] Update `capacitor.config.ts` with correct `appId` and `appName`
   - [ ] Verify `package.json` version number
   - [ ] Update Android `versionCode` and `versionName` in `android/app/build.gradle`

3. **Code Quality**
   - [ ] Run `npm run type-check` to check TypeScript errors
   - [ ] Run `npm run lint` to check for linting issues
   - [ ] Remove any `console.log` statements (or use logger utility)
   - [ ] Test all features thoroughly

4. **Security**
   - [ ] Ensure `.env` files are in `.gitignore`
   - [ ] Remove any hardcoded API keys or secrets
   - [ ] Enable HTTPS only in production
   - [ ] Review security headers and CORS settings

## 📦 Building Production APK

### Step 1: Build Web App
```bash
npm run build:prod
```

### Step 2: Sync with Capacitor
```bash
npm run android:sync
# or
npx cap sync android
```

### Step 3: Build Debug APK (for testing)
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Build Release APK (unsigned)
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 🔐 Signing Release APK

### Generate Keystore (First Time Only)
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Store this keystore file securely! You'll need it for all future updates.

### Configure Signing

1. Create `android/keystore.properties`:
```properties
storeFile=my-release-key.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=my-key-alias
keyPassword=YOUR_KEY_PASSWORD
```

2. Update `android/app/build.gradle` (uncomment signing config section)

3. Build signed release:
```bash
cd android
./gradlew assembleRelease
```

## 🧪 Testing Production Build

### Test on Physical Device
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Test Checklist
- [ ] App launches without errors
- [ ] Maps load correctly with production API key
- [ ] Authentication flow works
- [ ] All screens navigate properly
- [ ] Ride booking functionality works
- [ ] Driver mode functions correctly
- [ ] Offline mode handles network issues
- [ ] No console errors in production
- [ ] App performance is optimal

## 📱 Google Play Store Submission

### Prerequisites
1. **Google Play Developer Account** ($25 one-time fee)
2. **Signed Release APK** or **AAB (Android App Bundle)**
3. **App Assets**:
   - App icon (512x512 PNG)
   - Feature graphic (1024x500)
   - Screenshots (at least 2, max 8)
   - High-res icon (512x512)
   - Privacy policy URL

### Build AAB (Recommended by Google)
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Upload to Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing
3. Fill in store listing details
4. Upload APK/AAB under "Release" → "Production"
5. Set pricing (Free/Paid)
6. Complete content rating questionnaire
7. Add target audience and age ratings
8. Review and publish

## 🔄 GitHub Actions CI/CD

The repository includes `.github/workflows/build-apk.yml` which automatically:
- Builds web app on every push to main
- Syncs with Capacitor
- Builds debug APK
- Uploads artifact for download

For production releases:
1. Update version in `package.json`
2. Create git tag: `git tag v1.0.0`
3. Push tag: `git push origin v1.0.0`
4. GitHub Actions will build automatically

## 🌐 Backend Deployment

### Required Backend Services
1. **REST API** for ride management
2. **WebSocket Server** for real-time updates
3. **Database** (PostgreSQL, MongoDB, etc.)
4. **File Storage** for user uploads
5. **Payment Gateway Integration**

### Environment Variables Needed
- Database connection strings
- JWT secrets
- API keys for third-party services
- Payment gateway credentials
- Google Maps API key (server-side)

## 📊 Monitoring & Analytics

### Recommended Services
- **Sentry** - Error tracking and crash reporting
- **Google Analytics** - User behavior tracking
- **Firebase Analytics** - Mobile app analytics
- **LogRocket** - Session replay and debugging

### Integration Steps
1. Create accounts with monitoring services
2. Add SDK packages to `package.json`
3. Initialize in `src/main.tsx`
4. Configure error boundaries
5. Track key events (ride bookings, payments, etc.)

## 🔒 Security Best Practices

- [ ] Enable ProGuard/R8 for code obfuscation
- [ ] Use HTTPS for all API calls
- [ ] Implement certificate pinning
- [ ] Validate all user inputs
- [ ] Secure local storage (encrypt sensitive data)
- [ ] Implement rate limiting on backend
- [ ] Add fraud detection for payments
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 📈 Performance Optimization

- [ ] Enable code splitting (already configured)
- [ ] Optimize images (compress, use WebP)
- [ ] Implement lazy loading for routes
- [ ] Cache API responses where appropriate
- [ ] Use service workers for offline functionality
- [ ] Monitor bundle size with `npm run build:prod`
- [ ] Profile app performance with Chrome DevTools

## 🐛 Common Issues & Solutions

### Build Fails with Gradle Error
```bash
cd android
./gradlew clean
./gradlew assembleRelease --stacktrace
```

### Maps Not Loading
- Check Google Maps API key is set in `.env.production`
- Ensure API key has proper restrictions for production
- Enable required APIs in Google Cloud Console

### APK Size Too Large
- Review bundle analysis: install `rollup-plugin-visualizer`
- Remove unused dependencies
- Compress images more aggressively
- Consider splitting into multiple APKs by architecture

## 📞 Support & Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Developer Docs**: https://developer.android.com
- **Play Console Help**: https://support.google.com/googleplay
- **Vite Production Guide**: https://vitejs.dev/guide/build.html

## 🎯 Post-Launch Checklist

- [ ] Monitor crash reports daily
- [ ] Track user reviews and ratings
- [ ] Analyze usage metrics
- [ ] Plan regular updates
- [ ] Fix critical bugs immediately
- [ ] Respond to user feedback
- [ ] Update backend APIs as needed
- [ ] Regular security patches

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-28  
**Author:** Development Team
