## Project health report — 2025-10-29

This report summarizes issues and risks found after a quick end-to-end audit of the repository. It covers frontend (Vite + React + TS), PWA/Push, Firebase, Android (Capacitor), and backend (Express + MongoDB).

### Summary

- Build: PASS (frontend Vite build succeeded)
- TypeScript: PASS (no type errors found with `tsc --noEmit`)
- Lint: WARNINGS PRESENT (96 warnings, no errors)

---

## Frontend (Vite + React)

Severity: Medium

- Manual chunks: The `map-vendor` chunk was generated empty during production build, indicating `@googlemaps/js-api-loader` is not included in the final bundle (likely tree-shaken or dynamically imported). This is not a build blocker but suggests the chunking config may not match actual import paths.
- PWA service worker not registered: `public/sw.js` exists and `src/services/offlineService.ts` registers it, but `offlineService` isn’t imported anywhere. Result: service worker won’t register, so offline caching and local notifications via `navigator.serviceWorker.ready` may fail on web.
- Theme provider missing: `src/components/ui/sonner.tsx` uses `next-themes`’ `useTheme` without a `ThemeProvider` at the app root. It will fall back to `system`, but dynamic theme switching won’t work as intended.
- Bundle size: Main JS bundle ~758 kB gzip ~173 kB; React vendor ~158 kB gzip ~52 kB; UI vendor ~41 kB gzip ~14 kB; CSS ~107 kB gzip ~17 kB. This is okay for a feature-rich app but worth monitoring for low-end devices.

Recommendations

- Import `offlineService` once at app startup (e.g., in `main.tsx`) so `sw.js` is registered and update prompts work.
- If web push is desired, ensure service worker registration happens before using `navigator.serviceWorker.ready` in `pushNotificationService`.
- Add a `ThemeProvider` (from `next-themes`) around the app or replace `useTheme` with a simple theme state if SSR isn’t used.
- Consider adjusting `manualChunks` to only split used vendors to avoid empty chunks, or remove the `map-vendor` entry if the maps loader is dynamically loaded.

---

## PWA & Push Notifications

Severity: High (if web push/offline is required)

- Service worker registration: As noted, not currently executed because `offlineService` is not imported anywhere.
- Precache scope: Custom `public/sw.js` only precaches a short static list. Vite’s output assets aren’t precached, so the app won’t be reliably offline beyond `index.html`/`offline.html`/`manifest.json`.
- Notification flow: `pushNotificationService` depends on `navigator.serviceWorker.ready`, which will never resolve to a valid registration if the SW isn’t registered first.
- Navigation from notifications: `pushNotifications.ts` uses `window.location.href` to navigate on actions. In SPA this causes full reloads; prefer using React Router navigation.

Recommendations

- Decide between custom SW vs Vite PWA plugin. If staying custom, extend `PRECACHE_ASSETS` at build time or add a lightweight precache manifest. If not, integrate `vite-plugin-pwa`.
- Ensure SW registration occurs before any code that calls `navigator.serviceWorker.ready`.
- Replace `window.location.href` navigations with Router `navigate` (or a central notification handler that talks to the router).

---

## Firebase configuration (Web)

Severity: High (if Firebase features are required)

- Modular vs compat mismatch: App code uses Firebase v12 modular imports, while `public/firebase-messaging-sw.js` loads compat scripts (`firebase-app-compat.js`, `firebase-messaging-compat.js`) at v10.7.1. Mixing versions/modules is fragile.
- Hardcoded credentials in service worker: `firebase-messaging-sw.js` contains hardcoded keys. While Firebase API keys aren’t secret, shipping multiple mismatched configs can cause runtime issues.
- Storage bucket domain: Both `public/firebase-messaging-sw.js` and `android/app/google-services.json` reference `firebasestorage.app`. The canonical Firebase storage bucket domain is `project-id.appspot.com`. Using a non-standard domain may break storage or messaging-related features.
- Env-driven config: `src/config/firebase.ts` reads from `VITE_FIREBASE_*` env vars, but none are committed here. `isFirebaseConfigured()` will be false, so the app will log a warning and skip Firebase initialization.

Recommendations

- Standardize on Firebase v12 modular. Replace `firebase-messaging-sw.js` with a v12 modular-compatible service worker or use the recommended messaging SW setup for v12.
- Fix storage bucket to `dropout586586.appspot.com` if that’s the actual bucket.
- Provide `.env` or `.env.local` with `VITE_FIREBASE_*` values and ensure they’re injected at build time.
- If web push is not a goal, remove `firebase-messaging-sw.js` and related references to avoid confusion.

---

## Android (Capacitor)

Severity: Medium

- Release signing not configured: `android/app/build.gradle` has release signing commented out. Release builds will be unsigned unless configured.
- google-services plugin: Applied conditionally and `google-services.json` is present. However, the storage bucket uses `firebasestorage.app` (see Firebase section), which is suspect.
- SDK levels: `compileSdkVersion/targetSdkVersion` 35 and `minSdk` 23 look fine. AGP 8.7.2 is current.

Recommendations

- Configure keystore/signing for release builds or set up Play App Signing and use upload key locally.
- Validate the Firebase `google-services.json` contents (esp. storage bucket).

---

## Backend (Express + MongoDB)

Severity: Medium

- Environment dependencies: Requires `MONGODB_URI` and `FRONTEND_URL`. Defaults to `mongodb://localhost:27017/mana-auto-ride` and `http://localhost:8080`.
- Security basics present: Uses `helmet`, `compression`, `cors` (but origins are wide-open to a single host). No rate limiting on routes by default, though dependency exists.
- Tests: No automated tests.

Recommendations

- Add a `.env.example` documenting required env vars.
- Tighten CORS for production and add `express-rate-limit` on auth and sensitive routes.
- Add minimal integration tests (health, auth endpoints) and a lint config for the backend.

---

## Code quality (ESLint)

Severity: Low to Medium

- 96 warnings; common themes:
  - `@typescript-eslint/no-explicit-any`: Widespread usage in services and components.
  - `react-hooks/exhaustive-deps`: Several effects missing dependencies, especially in `MapComponent.tsx` and `HomeScreen.tsx`. This can cause subtle state bugs.
  - `react-refresh/only-export-components`: Some UI files export values other than components; this only affects dev fast-refresh behavior.
  - `no-require-imports`: One `require()` in `tailwind.config.ts`.

Recommendations

- Gradually replace `any` with concrete interfaces/types (start with API payloads and service result types).
- Fix the highest-risk `useEffect` dependency warnings where handlers mutate map markers or rely on closures.
- Consider relaxing some rules via overrides for generated UI primitives if needed.

---

## Configuration flags and environment

Severity: Low to Medium

- `PRODUCTION_MODE` is hardcoded `false` in `src/config/production.ts`. Several flags (mock OTP, mock vehicles) depend on this.

Recommendations

- Use env-driven toggles (e.g., `VITE_PRODUCTION_MODE=true`) instead of editing source for release.

---

## Security and privacy

Severity: Medium

- Local storage usage: Some modules write directly to `localStorage` (e.g., `pushNotifications.ts` saves the FCM token), bypassing the `safeStorage` helpers. On devices that disable storage or hit quota, this can throw.
- Public keys in repo: Firebase keys in `google-services.json` and messaging SW are expected, but verify they match the intended project and restrict API key usage to the app bundle IDs/origins where possible.

Recommendations

- Replace direct `localStorage` with `safeStorage` helpers everywhere for consistency.
- Verify Firebase key restrictions in the Google Cloud Console.

---

## Quick wins (low-risk improvements)

1) Register the service worker at startup

- Import `offlineService` in `src/main.tsx` (side-effect import) so SW registers and update checks work.

2) Align Firebase versions

- Update or remove `public/firebase-messaging-sw.js`; if web push is needed, implement the v12 modular messaging SW and feed env vars.

3) Add ThemeProvider

- Wrap app with `ThemeProvider` from `next-themes` or remove `useTheme` if you don’t need theme switching.

4) Wire env flags

- Replace hardcoded `PRODUCTION_MODE` with env toggles and reference via `import.meta.env`.

5) Address top `useEffect` dependency warnings

- Start with `MapComponent.tsx` and `HomeScreen.tsx` to prevent stale closures and intermittent UI bugs.

---

## Verification logs (this session)

- Installed deps and ran build successfully.
- Type check: no errors.
- Lint: 96 warnings, 0 errors.
- Build output (selected):
  - `dist/assets/index-*.js ~757.5 kB (gzip ~172.6 kB)`
  - `dist/assets/react-vendor-*.js ~157.8 kB (gzip ~51.6 kB)`
  - Note: “Generated an empty chunk: map-vendor”.

---

## Next steps

- Confirm whether web PWA and web push are in-scope. If yes, prioritize SW registration and Firebase messaging alignment.
- Provide `.env` files for both frontend and backend; add `.env.example` to the repo.
- Decide on release signing path for Android and fix Firebase storage bucket config.
- Plan a short sprint to reduce `any` usage and the most risky `useEffect` warnings.

— End of report —
