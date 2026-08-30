'use client';

import { useState, useEffect, useCallback } from 'react';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';

// Log Off Screen - shows "Logging off..." then welcome screen
function LogOffScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(180deg, #335ea8 0%, #1d4a8a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'white', fontSize: '24px', marginBottom: '10px' }}>
          Logging off...
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
          Saving your settings...
        </div>
      </div>
    </div>
  );
}

// Welcome/Login Screen
function WelcomeScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(180deg, #335ea8 0%, #1d4a8a 50%, #0c3064 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
    }}>
      {/* Windows Logo */}
      <div style={{ marginBottom: '40px' }}>
        <svg viewBox="0 0 88 88" width="80" height="80">
          <defs>
            <linearGradient id="flag1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5f00" />
              <stop offset="100%" stopColor="#ffb900" />
            </linearGradient>
            <linearGradient id="flag2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00b900" />
              <stop offset="100%" stopColor="#00d600" />
            </linearGradient>
            <linearGradient id="flag3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0070ff" />
              <stop offset="100%" stopColor="#00b4ff" />
            </linearGradient>
            <linearGradient id="flag4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff0000" />
              <stop offset="100%" stopColor="#ff6a00" />
            </linearGradient>
          </defs>
          <path d="M1,1 L40,1 L35,40 L1,44 Z" fill="url(#flag4)" />
          <path d="M45,1 L87,5 L87,40 L41,40 Z" fill="url(#flag2)" />
          <path d="M1,48 L35,48 L40,87 L1,83 Z" fill="url(#flag3)" />
          <path d="M41,48 L87,48 L83,87 L45,87 Z" fill="url(#flag1)" />
        </svg>
      </div>

      {/* Welcome Text */}
      <div style={{ 
        color: 'white', 
        fontSize: '32px', 
        fontWeight: 300, 
        marginBottom: '40px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        fontFamily: 'Tahoma, sans-serif',
      }}>
        Welcome
      </div>

      {/* User Card */}
      <div 
        onClick={onLogin}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          padding: '15px 40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(180deg, #87ceeb 0%, #4169e1 100%)',
          borderRadius: '4px',
          border: '2px solid rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          👤
        </div>
        <div>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
            Prasenjit Nayak
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>
            Click to log in
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
      }}>
        Windows XP Portfolio Edition
      </div>
    </div>
  );
}

// Sleep Screen - shows sleep.gif with a wake-up button
function SleepScreen({ onWakeUp }: { onWakeUp: () => void }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show the wake-up button after a brief delay so the transition feels natural
    const timer = setTimeout(() => setShowButton(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      cursor: 'default',
    }}>
      {/* Corner GIFs */}
      <img
        src="/sleep1.gif"
        alt="Sleep animation 1"
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '350px',
          height: '250px',
          objectFit: 'contain',
          animation: 'sleepFadeIn 1s ease-out',
          opacity: 0.9,
        }}
      />
      <img
        src="/sleep2.gif"
        alt="Sleep animation 2"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '350px',
          height: '250px',
          objectFit: 'contain',
          animation: 'sleepFadeIn 1s ease-out 0.2s both',
          opacity: 0.9,
        }}
      />
      <img
        src="/sleep3.gif"
        alt="Sleep animation 3"
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '350px',
          height: '250px',
          objectFit: 'contain',
          animation: 'sleepFadeIn 1s ease-out 0.4s both',
          opacity: 0.9,
        }}
      />
      <img
        src="/sleep4.gif"
        alt="Sleep animation 4"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '350px',
          height: '250px',
          objectFit: 'contain',
          animation: 'sleepFadeIn 1s ease-out 0.6s both',
          opacity: 0.9,
        }}
      />

      {/* SVG Filter for removing white background */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="remove-white" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            -3 -3 -3 0 8.8
          " />
        </filter>
      </svg>

      {/* Dance GIFs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', zIndex: 2 }}>
        {[1, 2, 3, 4].map((i) => (
          <img
            key={`dance-${i}`}
            src="/dance.gif"
            alt={`Dance ${i}`}
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              animation: 'sleepFadeIn 1s ease-out',
              filter: 'url(#remove-white)',
            }}
          />
        ))}
      </div>

      {/* Main Center GIF */}
      <img
        src="/sleep.gif"
        alt="Computer sleeping"
        style={{
          maxWidth: '450px',
          maxHeight: '400px',
          objectFit: 'contain',
          animation: 'sleepFadeIn 1s ease-out',
          marginBottom: '40px',
          zIndex: 2,
        }}
      />

      {/* Wake Up Button */}
      <button
        onClick={onWakeUp}
        style={{
          opacity: showButton ? 1 : 0,
          transform: showButton ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out',
          background: 'linear-gradient(180deg, #4a9eff 0%, #2060c0 50%, #1848a0 100%)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          padding: '14px 40px',
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: 'Tahoma, sans-serif',
          cursor: 'pointer',
          letterSpacing: '1px',
          boxShadow: '0 0 20px rgba(74, 158, 255, 0.4), 0 4px 15px rgba(0,0,0,0.5)',
          animation: showButton ? 'wakeButtonPulse 2s ease-in-out infinite' : 'none',
          position: 'relative',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'linear-gradient(180deg, #5ab0ff 0%, #3070d0 50%, #2858b0 100%)';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(74, 158, 255, 0.6), 0 4px 20px rgba(0,0,0,0.5)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(180deg, #4a9eff 0%, #2060c0 50%, #1848a0 100%)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(74, 158, 255, 0.4), 0 4px 15px rgba(0,0,0,0.5)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <img 
            src="/bye.gif" 
            alt="Wake up icon" 
            style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
          />
          Wake Up
        </div>
      </button>

      <div style={{
        color: 'rgba(255,255,255,0.3)',
        fontSize: '11px',
        marginTop: '20px',
        fontFamily: 'Tahoma, sans-serif',
        opacity: showButton ? 1 : 0,
        transition: 'opacity 0.6s ease-out 0.3s',
      }}>
        Click to start Windows
      </div>

      <style jsx>{`
        @keyframes sleepFadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes wakeButtonPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(74, 158, 255, 0.4), 0 4px 15px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 35px rgba(74, 158, 255, 0.7), 0 4px 20px rgba(0,0,0,0.5); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [appState, setAppState] = useState<'boot' | 'welcome' | 'loggingoff' | 'desktop' | 'sleep'>('boot');

  useEffect(() => {
    // Check if user has already seen boot screen this session
    const hasBooted = sessionStorage.getItem('xp-booted');
    if (hasBooted) {
      setAppState('desktop');
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem('xp-booted', 'true');
    setAppState('desktop');
  }, []);

  const handleLogOff = useCallback(() => {
    setAppState('loggingoff');
  }, []);

  const handleLogOffComplete = useCallback(() => {
    setAppState('welcome');
  }, []);

  const handleLogin = useCallback(() => {
    setAppState('desktop');
  }, []);

  const handleShutdown = useCallback(() => {
    setAppState('sleep');
  }, []);

  const handleWakeUp = useCallback(() => {
    sessionStorage.removeItem('xp-booted');
    setAppState('boot');
  }, []);

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {appState === 'boot' && <BootScreen onBootComplete={handleBootComplete} />}
      {appState === 'loggingoff' && <LogOffScreen onComplete={handleLogOffComplete} />}
      {appState === 'welcome' && <WelcomeScreen onLogin={handleLogin} />}
      {appState === 'desktop' && <Desktop onLogOff={handleLogOff} onShutdown={handleShutdown} />}
      {appState === 'sleep' && <SleepScreen onWakeUp={handleWakeUp} />}
    </main>
  );
}
