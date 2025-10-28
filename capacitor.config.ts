import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.manaride.app',
  appName: 'Mana Auto Oka Ride',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  }
};

export default config;
