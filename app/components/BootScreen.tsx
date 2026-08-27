'use client';

import { useEffect, useState } from 'react';

interface BootScreenProps {
  onBootComplete: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<'boot' | 'welcome'>('boot');

  useEffect(() => {
    // Boot phase - 5 seconds
    const bootTimer = setTimeout(() => {
      setPhase('welcome');
    }, 5000);

    return () => clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    if (phase === 'welcome') {
      const welcomeTimer = setTimeout(onBootComplete, 1200);
      return () => clearTimeout(welcomeTimer);
    }
  }, [phase, onBootComplete]);

  // Welcome screen
  if (phase === 'welcome') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #0050d0 0%, #3080e8 50%, #60a8f8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'welcomeFadeIn 0.8s ease-out'
        }}>
          <div style={{
            fontSize: '36px',
            color: 'white',
            fontWeight: 'bold',
            fontStyle: 'italic',
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            letterSpacing: '3px'
          }}>
            welcome
          </div>
        </div>
        <style jsx>{`
          @keyframes welcomeFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // Main XP boot screen - matching the authentic look
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    }}>
      {/* Windows XP Logo - Wavy Flag Style */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '80px',
        animation: 'logoFadeIn 0.8s ease-out'
      }}>
        {/* Windows Flag - Wavy 3D style */}
        <svg width="220" height="180" viewBox="0 0 220 180" style={{ marginBottom: '10px' }}>
          {/* Red/Orange - top left */}
          <path 
            d="M 30 25 
               Q 55 15, 80 20 
               Q 95 22, 105 30 
               L 105 85 
               Q 95 80, 80 78 
               Q 55 75, 30 80 
               Z" 
            fill="url(#redGradient)"
          />
          {/* Green - top right */}
          <path 
            d="M 115 30 
               Q 125 22, 140 20 
               Q 165 15, 190 25 
               L 190 80 
               Q 165 75, 140 78 
               Q 125 80, 115 85 
               Z" 
            fill="url(#greenGradient)"
          />
          {/* Blue - bottom left */}
          <path 
            d="M 30 90 
               Q 55 85, 80 88 
               Q 95 90, 105 95 
               L 105 150 
               Q 95 155, 80 158 
               Q 55 162, 30 155 
               Z" 
            fill="url(#blueGradient)"
          />
          {/* Yellow - bottom right */}
          <path 
            d="M 115 95 
               Q 125 90, 140 88 
               Q 165 85, 190 90 
               L 190 155 
               Q 165 162, 140 158 
               Q 125 155, 115 150 
               Z" 
            fill="url(#yellowGradient)"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4e00" />
              <stop offset="50%" stopColor="#ff6a00" />
              <stop offset="100%" stopColor="#ff8c00" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7fba00" />
              <stop offset="50%" stopColor="#8ec919" />
              <stop offset="100%" stopColor="#a3d532" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00a4ef" />
              <stop offset="50%" stopColor="#19b0f4" />
              <stop offset="100%" stopColor="#32bcf8" />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb900" />
              <stop offset="50%" stopColor="#ffc519" />
              <stop offset="100%" stopColor="#ffd132" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Microsoft text */}
        <div style={{
          fontSize: '16px',
          color: '#888',
          letterSpacing: '0.5px',
          fontFamily: 'Tahoma, sans-serif',
          marginBottom: '2px'
        }}>
          Microsoft<sup style={{ fontSize: '9px' }}>®</sup>
        </div>
        
        {/* Windows XP text */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{
            fontSize: '56px',
            fontWeight: 'bold',
            fontStyle: 'italic',
            color: 'white',
            letterSpacing: '-2px',
            fontFamily: 'Tahoma, sans-serif',
          }}>
            Windows
          </span>
          <span style={{
            fontSize: '48px',
            fontWeight: 'bold',
            fontStyle: 'italic',
            color: '#ff6600',
            marginLeft: '4px',
            position: 'relative',
            top: '-12px',
            fontFamily: 'Tahoma, sans-serif',
          }}>
            xp
          </span>
          <sup style={{
            fontSize: '10px',
            color: '#888',
            position: 'relative',
            top: '-30px',
            marginLeft: '2px'
          }}>™</sup>
        </div>
      </div>

      {/* Progress Bar - Authentic XP style */}
      <div style={{
        width: '180px',
        height: '20px',
        background: 'transparent',
        border: '1px solid #444',
        borderRadius: '2px',
        padding: '3px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Animated blocks */}
        <div style={{
          position: 'absolute',
          top: '3px',
          left: '3px',
          right: '3px',
          bottom: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            gap: '3px',
            animation: 'xpProgressSlide 1.8s linear infinite',
            width: 'fit-content'
          }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                style={{
                  width: '11px',
                  height: '12px',
                  background: 'linear-gradient(180deg, #4a9eff 0%, #2070d0 40%, #1050a0 100%)',
                  borderRadius: '1px',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Copyright - bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        color: '#888',
        fontSize: '11px',
        fontFamily: 'Tahoma, sans-serif'
      }}>
        Copyright © Portfolio Corporation
      </div>

      {/* Microsoft logo - bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '28px',
        right: '30px',
        color: '#888',
        fontSize: '14px',
        fontFamily: 'Tahoma, sans-serif',
        fontStyle: 'italic',
        fontWeight: 'bold'
      }}>
        Portfolio<sup style={{ fontSize: '8px' }}>®</sup>
      </div>

      <style jsx>{`
        @keyframes xpProgressSlide {
          0% {
            transform: translateX(-60px);
          }
          100% {
            transform: translateX(180px);
          }
        }
        @keyframes logoFadeIn {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
}
