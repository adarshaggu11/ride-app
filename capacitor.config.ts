import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dropout.app',
  appName: 'Dropout',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  }
};

export default config;
