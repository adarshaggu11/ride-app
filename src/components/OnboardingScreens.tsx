import { useState } from "react";

interface OnboardingScreensProps {
  onComplete: () => void;
}

const OnboardingScreens = ({ onComplete }: OnboardingScreensProps) => {
  console.log('🎨 Onboarding loaded');

  const handleComplete = () => {
    console.log('✅ Onboarding complete clicked');
    try {
      onComplete();
    } catch (error) {
      console.error('❌ Error in onComplete:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#2563eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>⚡</div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          Welcome to Dropout
        </h1>
        
        <p style={{
          fontSize: '18px',
          marginBottom: '32px',
          opacity: 0.9
        }}>
          Your trusted ride-sharing platform
        </p>
        
        <button
          onClick={handleComplete}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: 'white',
            color: '#2563eb',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreens;
