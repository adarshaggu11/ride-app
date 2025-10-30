import { Capacitor } from '@capacitor/core';

// Native dev mode: running on Android/iOS during development
export const isNativeDev = () => Capacitor.isNativePlatform() && import.meta.env.DEV;

// When flags are undefined, default to safe mode on native dev to avoid crashes
export const isBypassPermissionsEnabled = () => {
  const raw = (import.meta.env as any).VITE_BYPASS_PERMISSIONS as string | undefined;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return isNativeDev();
};

export const isNativePushDisabled = () => {
  const raw = (import.meta.env as any).VITE_DISABLE_NATIVE_PUSH as string | undefined;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return isNativeDev();
};

export const getSafeModeLabel = () => {
  const bypass = isBypassPermissionsEnabled();
  const pushOff = isNativePushDisabled();
  if (!bypass && !pushOff) return '';
  const parts: string[] = [];
  if (bypass) parts.push('permissions bypassed');
  if (pushOff) parts.push('push disabled');
  return `Testing mode: ${parts.join(' + ')}`;
};
