import { getSafeModeLabel, isBypassPermissionsEnabled, isNativePushDisabled } from '@/utils/flags';

const DevSafeBanner = () => {
  const label = getSafeModeLabel();
  if (!label) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'linear-gradient(90deg, #FCD34D, #EA580C)',
      color: '#111827',
      fontWeight: 800,
      fontSize: 12,
      padding: '6px 10px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      {label}
    </div>
  );
};

export default DevSafeBanner;
