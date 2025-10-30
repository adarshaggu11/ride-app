import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "next-themes";
// Register PWA Service Worker and setup offline features on app start
import "./services/offlineService";

console.log('🚀 Dropout App Starting...', {
  platform: typeof window !== 'undefined' ? 'web' : 'unknown',
  env: import.meta.env.MODE,
  capacitor: !!(window as any).Capacitor
});

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('❌ Root element not found!');
    throw new Error('Root element not found');
  }

  console.log('✅ Root element found, creating React app...');
  
  createRoot(rootElement).render(
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  );
  
  console.log('✅ React app rendered successfully');
} catch (error) {
  console.error('❌ Critical error during app startup:', error);
  
  // Show error message in DOM
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#f3f4f6;font-family:system-ui,sans-serif;padding:20px;">
        <div style="background:white;border-radius:12px;padding:32px;max-width:400px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#fee2e2;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:32px;">⚠️</span>
            </div>
            <h1 style="font-size:24px;font-weight:bold;color:#111;margin:0 0 8px;">App Startup Error</h1>
            <p style="color:#666;font-size:14px;margin:0;">Unable to start the application</p>
          </div>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px;">
            <pre style="color:#dc2626;font-size:12px;margin:0;white-space:pre-wrap;word-wrap:break-word;">${error instanceof Error ? error.message : String(error)}</pre>
          </div>
          <button onclick="location.reload()" style="width:100%;background:#2563eb;color:white;border:none;padding:12px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;">
            Reload App
          </button>
        </div>
      </div>
    `;
  }
}
