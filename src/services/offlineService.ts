// Offline & PWA Service
interface CacheConfig {
  staticAssets: string[];
  apiEndpoints: string[];
  cacheName: string;
  maxAge: number;
}

interface OfflineData {
  userId: string;
  lastSync: number;
  cachedRides: any[];
  cachedLocations: any[];
  pendingActions: any[];
}

class OfflineService {
  private cacheConfig: CacheConfig = {
    staticAssets: [
      '/',
      '/index.html',
      '/manifest.json',
      '/offline.html',
    ],
    apiEndpoints: [
      '/api/user/profile',
      '/api/rides/history',
      '/api/rewards',
    ],
    cacheName: 'mana-auto-v1',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  private db: IDBDatabase | null = null;

  constructor() {
    this.initIndexedDB();
    this.registerServiceWorker();
  }

  // Initialize IndexedDB for offline data
  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ManaAutoOffline', 1);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('rides')) {
          db.createObjectStore('rides', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('locations')) {
          db.createObjectStore('locations', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'userId' });
        }
      };
    });
  }

  // Register Service Worker for PWA
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                this.notifyUpdate();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private notifyUpdate(): void {
    // Show notification to user about app update
    if (confirm('New version available! Reload to update?')) {
      window.location.reload();
    }
  }

  // Cache management
  async cacheStaticAssets(): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheConfig.cacheName);
      await cache.addAll(this.cacheConfig.staticAssets);
      console.log('Static assets cached');
    }
  }

  async cacheAPIResponse(url: string, response: Response): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheConfig.cacheName);
      await cache.put(url, response.clone());
    }
  }

  async getCachedResponse(url: string): Promise<Response | undefined> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheConfig.cacheName);
      return await cache.match(url);
    }
    return undefined;
  }

  // Offline data storage
  async saveOfflineData(data: OfflineData): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return;

    const transaction = this.db.transaction(['userData'], 'readwrite');
    const store = transaction.objectStore('userData');
    await store.put(data);
  }

  async getOfflineData(userId: string): Promise<OfflineData | null> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userData'], 'readonly');
      const store = transaction.objectStore('userData');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Queue actions for later sync
  async queueAction(action: any): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return;

    const transaction = this.db.transaction(['pendingActions'], 'readwrite');
    const store = transaction.objectStore('pendingActions');
    await store.add({
      ...action,
      timestamp: Date.now(),
    });
  }

  async getPendingActions(): Promise<any[]> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readonly');
      const store = transaction.objectStore('pendingActions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearPendingActions(): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return;

    const transaction = this.db.transaction(['pendingActions'], 'readwrite');
    const store = transaction.objectStore('pendingActions');
    await store.clear();
  }

  // Sync data when online
  async syncWhenOnline(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Still offline, will retry...');
      return;
    }

    const pendingActions = await this.getPendingActions();

    for (const action of pendingActions) {
      try {
        // Execute pending action
        await this.executeAction(action);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }

    await this.clearPendingActions();
    console.log('Sync completed');
  }

  private async executeAction(action: any): Promise<void> {
    // Execute the queued action (API call, etc.)
    console.log('Executing action:', action);
  }

  // Network status monitoring
  setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      console.log('Back online - syncing data');
      this.syncWhenOnline();
      this.showNotification('You are back online!', 'success');
    });

    window.addEventListener('offline', () => {
      console.log('Gone offline - enabling offline mode');
      this.showNotification('You are offline. Limited functionality available.', 'warning');
    });
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  // Save ride for offline viewing
  async saveRideOffline(ride: any): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return;

    const transaction = this.db.transaction(['rides'], 'readwrite');
    const store = transaction.objectStore('rides');
    await store.put(ride);
  }

  async getOfflineRides(): Promise<any[]> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['rides'], 'readonly');
      const store = transaction.objectStore('rides');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Save locations for offline autocomplete
  async saveLocationOffline(location: any): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return;

    const transaction = this.db.transaction(['locations'], 'readwrite');
    const store = transaction.objectStore('locations');
    await store.put(location);
  }

  async searchOfflineLocations(query: string): Promise<any[]> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['locations'], 'readonly');
      const store = transaction.objectStore('locations');
      const request = store.getAll();

      request.onsuccess = () => {
        const allLocations = request.result;
        const filtered = allLocations.filter((loc: any) =>
          loc.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // PWA Installation
  async checkInstallable(): Promise<boolean> {
    return 'BeforeInstallPromptEvent' in window;
  }

  private installPromptEvent: any = null;

  setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPromptEvent = e;
      // Show custom install button
      this.showInstallButton();
    });
  }

  async promptInstall(): Promise<boolean> {
    if (!this.installPromptEvent) return false;

    this.installPromptEvent.prompt();
    const result = await this.installPromptEvent.userChoice;
    
    if (result.outcome === 'accepted') {
      console.log('App installed');
      return true;
    }
    
    return false;
  }

  private showInstallButton(): void {
    // Dispatch custom event to show install button in UI
    window.dispatchEvent(new CustomEvent('app-installable'));
  }

  private showNotification(message: string, type: 'success' | 'warning' | 'error'): void {
    // Dispatch event for UI to show notification
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { message, type },
    }));
  }

  // Clear old cache
  async clearOldCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== this.cacheConfig.cacheName)
          .map(name => caches.delete(name))
      );
    }
  }

  // Get cache size
  async getCacheSize(): Promise<number> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheConfig.cacheName);
      const keys = await cache.keys();
      let totalSize = 0;

      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }

      return totalSize;
    }
    return 0;
  }
}

export const offlineService = new OfflineService();
export type { CacheConfig, OfflineData };
