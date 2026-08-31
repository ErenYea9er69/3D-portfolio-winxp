'use client';

import { useState, useEffect, useRef } from 'react';
import XPIcon from '../XPIcon';

interface ControlPanelContentProps {
  onOpenApp?: (appId: string) => void;
}

// Synthesize authentic Windows XP sound effects using Web Audio API
function playSynthesizedXPSound(type: string) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    if (type === 'startup') {
      // Classic uplifting 5-chord XP chime progression (Eb - Bb - G - Bb - C)
      const notes = [
        { f: 311.13, t: 0.0, d: 1.2 }, // Eb4
        { f: 466.16, t: 0.15, d: 1.1 }, // Bb4
        { f: 392.00, t: 0.35, d: 1.3 }, // G4
        { f: 466.16, t: 0.55, d: 1.2 }, // Bb4
        { f: 523.25, t: 0.8, d: 1.8 }, // C5
        { f: 622.25, t: 0.8, d: 2.0 }, // Eb5
      ];
      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.exponentialRampToValueAtTime(0.18, now + t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.1);
      });
    } else if (type === 'shutdown') {
      // Classic downward 4-chord progression
      const notes = [
        { f: 523.25, t: 0.0, d: 0.7 }, // C5
        { f: 466.16, t: 0.2, d: 0.7 }, // Bb4
        { f: 392.00, t: 0.45, d: 0.8 }, // G4
        { f: 311.13, t: 0.7, d: 1.5 }, // Eb4
      ];
      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.exponentialRampToValueAtTime(0.15, now + t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.1);
      });
    } else if (type === 'ding') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'error') {
      // Classic heavy chord / low thump
      [130.81, 196.00].forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      });
    } else if (type === 'tada') {
      // Victory fanfare (G4 -> C5 -> E5 -> G5)
      const notes = [
        { f: 392.00, t: 0.0, d: 0.2 },
        { f: 523.25, t: 0.12, d: 0.2 },
        { f: 659.25, t: 0.24, d: 0.2 },
        { f: 783.99, t: 0.36, d: 1.0 },
      ];
      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.15, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } else if (type === 'recycle') {
      // Crumple / whoosh noise
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start(now);
    }
  } catch (err) {
    console.error('Audio playback error', err);
  }
}

export default function ControlPanelContent({ onOpenApp }: ControlPanelContentProps) {
  const [viewMode, setViewMode] = useState<'category' | 'classic'>('category');
  const [activeTab, setActiveTab] = useState<'main' | 'sounds' | 'system' | 'security'>('main');
  const [soundScheme, setSoundScheme] = useState('Windows Default');
  const [activeSoundPlaying, setActiveSoundPlaying] = useState<string | null>(null);

  const [uptime, setUptime] = useState('0h 0m 0s');

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const hrs = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      setUptime(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const playSound = (name: string, type: string) => {
    setActiveSoundPlaying(name);
    playSynthesizedXPSound(type);
    setTimeout(() => setActiveSoundPlaying(null), 1000);
  };

  const categories = [
    {
      id: 'appearance',
      title: 'Appearance and Themes',
      icon: '/icons xp/Windows XP Icons/Appearance.png',
      desc: 'Change the computer’s theme or background, or choose a screen saver.',
      action: () => onOpenApp?.('dispprops'),
    },
    {
      id: 'sounds',
      title: 'Sounds, Speech, and Audio Devices',
      icon: '/icons xp/Windows XP Icons/Audio Devices.png',
      desc: 'Change the sound scheme for your computer, or configure speakers and recording devices.',
      action: () => setActiveTab('sounds'),
    },
    {
      id: 'performance',
      title: 'Performance and Maintenance',
      icon: '/icons xp/Windows XP Icons/Performance.png',
      desc: 'View information about your computer, manage system resources, and optimize speeds.',
      action: () => setActiveTab('system'),
    },
    {
      id: 'security',
      title: 'Security Center',
      icon: '/icons xp/Windows XP Icons/Security Center.png',
      desc: 'Manage Internet security settings and ensure firewall and antivirus protection are active.',
      action: () => setActiveTab('security'),
    },
    {
      id: 'useraccounts',
      title: 'User Accounts',
      icon: '/icons xp/Windows XP Icons/User Accounts.png',
      desc: 'Change user settings and passwords for people who share this computer.',
      action: () => onOpenApp?.('about'),
    },
    {
      id: 'network',
      title: 'Network and Internet Connections',
      icon: '/icons xp/Windows XP Icons/Network and Internet.png',
      desc: 'Connect to the Internet, set up home networks, or change connection settings.',
      action: () => onOpenApp?.('contact'),
    },
    {
      id: 'datetime',
      title: 'Date, Time, Language, and Regional Options',
      icon: '/icons xp/Windows XP Icons/Date and Time.png',
      desc: 'Change the date, time, and time zone for your computer.',
      action: () => setActiveTab('system'),
    },
  ];

  const classicApplets = [
    { name: 'Appearance and Themes', icon: '/icons xp/Windows XP Icons/Appearance.png', action: () => onOpenApp?.('dispprops') },
    { name: 'Audio Devices', icon: '/icons xp/Windows XP Icons/Audio Devices.png', action: () => setActiveTab('sounds') },
    { name: 'Calculator', icon: '/icons xp/Windows XP Icons/Calculator.png', action: () => onOpenApp?.('calculator') },
    { name: 'Date and Time', icon: '/icons xp/Windows XP Icons/Date and Time.png', action: () => setActiveTab('system') },
    { name: 'Display Properties', icon: '/icons xp/Windows XP Icons/Display Properties.png', action: () => onOpenApp?.('dispprops') },
    { name: 'Firewall', icon: '/icons xp/Windows XP Icons/Firewall.png', action: () => setActiveTab('security') },
    { name: 'Fonts', icon: '/icons xp/Windows XP Icons/Fonts.png', action: () => setActiveTab('system') },
    { name: 'Game Controllers', icon: '/icons xp/Windows XP Icons/Game Controller.png', action: () => onOpenApp?.('snake') },
    { name: 'Internet Options', icon: '/icons xp/Windows XP Icons/Internet Options.png', action: () => onOpenApp?.('iexplorer') },
    { name: 'Keyboard', icon: '/icons xp/Windows XP Icons/Keyboard.png', action: () => onOpenApp?.('notepad') },
    { name: 'Mouse', icon: '/icons xp/Windows XP Icons/Mouse.png', action: () => setActiveTab('system') },
    { name: 'Network Connections', icon: '/icons xp/Windows XP Icons/Network Connections.png', action: () => onOpenApp?.('contact') },
    { name: 'Performance Monitor', icon: '/icons xp/Windows XP Icons/Performance Monitor.png', action: () => setActiveTab('system') },
    { name: 'Power Options', icon: '/icons xp/Windows XP Icons/Power Options.png', action: () => setActiveTab('system') },
    { name: 'Printers and Faxes', icon: '/icons xp/Windows XP Icons/Printers and Faxes.png', action: () => onOpenApp?.('mycomputer') },
    { name: 'Regional Settings', icon: '/icons xp/Windows XP Icons/Regional Settings.png', action: () => setActiveTab('system') },
    { name: 'Security Center', icon: '/icons xp/Windows XP Icons/Security Center.png', action: () => setActiveTab('security') },
    { name: 'System Properties', icon: '/icons xp/Windows XP Icons/System Properties.png', action: () => setActiveTab('system') },
    { name: 'Task Manager', icon: '/icons xp/Windows XP Icons/Task Manager.png', action: () => onOpenApp?.('taskmgr') },
    { name: 'Taskbar and Start Menu', icon: '/icons xp/Windows XP Icons/Taskbar and Start Menu.png', action: () => onOpenApp?.('dispprops') },
    { name: 'User Accounts', icon: '/icons xp/Windows XP Icons/User Accounts.png', action: () => onOpenApp?.('about') },
    { name: 'Windows Media Player', icon: '/icons xp/Windows XP Icons/Windows Media Player 10.png', action: () => onOpenApp?.('mediaplayer') },
    { name: 'Windows Messenger', icon: '/icons xp/Windows XP Icons/MSN Messenger.png', action: () => onOpenApp?.('msnmsgr') },
    { name: 'Picture & Fax Viewer', icon: '/icons xp/Windows XP Icons/Windows Picture and Fax Viewer.png', action: () => onOpenApp?.('pictureviewer') },
    { name: 'Command Prompt', icon: '/icons xp/Windows XP Icons/Command Prompt.png', action: () => onOpenApp?.('cmd') },
  ];

  const soundEvents = [
    { name: 'Windows XP Startup', type: 'startup', desc: 'Played when starting Windows' },
    { name: 'Windows XP Shutdown', type: 'shutdown', desc: 'Played during system shutdown' },
    { name: 'Critical Stop / Error', type: 'error', desc: 'Error warning sound' },
    { name: 'Information / Asterisk', type: 'ding', desc: 'Notification chime' },
    { name: 'Tada / Success', type: 'tada', desc: 'Completion fanfare' },
    { name: 'Empty Recycle Bin', type: 'recycle', desc: 'Paper crumple sound effect' },
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      margin: '-8px',
      background: '#fff',
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '11px',
      overflow: 'hidden',
    }}>
      {/* Left Sidebar (Iconic XP Taskbar Navigation) */}
      <div style={{
        width: '180px',
        background: 'linear-gradient(180deg, #7ba2d4 0%, #638ec5 100%)',
        padding: '12px 10px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderRight: '1px solid #4a75ab',
        overflowY: 'auto',
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/Control Panel.png" size={32} alt="Control Panel" />
          <span style={{ fontWeight: 'bold', fontSize: '13px', textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
            Control Panel
          </span>
        </div>

        {/* View switcher card */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '4px',
          padding: '8px',
          color: '#0c3276',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '11px' }}>
            Control Panel Views
          </div>
          <div
            onClick={() => { setViewMode('category'); setActiveTab('main'); }}
            style={{
              cursor: 'pointer',
              color: viewMode === 'category' && activeTab === 'main' ? '#0054e3' : '#333',
              fontWeight: viewMode === 'category' && activeTab === 'main' ? 'bold' : 'normal',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>📁</span> Switch to Category View
          </div>
          <div
            onClick={() => { setViewMode('classic'); setActiveTab('main'); }}
            style={{
              cursor: 'pointer',
              color: viewMode === 'classic' ? '#0054e3' : '#333',
              fontWeight: viewMode === 'classic' ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🔲</span> Switch to Classic View
          </div>
        </div>

        {/* Quick Applets Navigation */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '4px',
          padding: '8px',
          color: '#0c3276',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '11px' }}>
            Interactive Applets
          </div>
          <div
            onClick={() => setActiveTab('sounds')}
            style={{
              cursor: 'pointer',
              color: activeTab === 'sounds' ? '#0054e3' : '#333',
              fontWeight: activeTab === 'sounds' ? 'bold' : 'normal',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <XPIcon src="/icons xp/Windows XP Icons/Audio Devices.png" size={16} />
            <span>Soundboard</span>
          </div>
          <div
            onClick={() => setActiveTab('system')}
            style={{
              cursor: 'pointer',
              color: activeTab === 'system' ? '#0054e3' : '#333',
              fontWeight: activeTab === 'system' ? 'bold' : 'normal',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <XPIcon src="/icons xp/Windows XP Icons/System Properties.png" size={16} />
            <span>System Stats</span>
          </div>
          <div
            onClick={() => setActiveTab('security')}
            style={{
              cursor: 'pointer',
              color: activeTab === 'security' ? '#0054e3' : '#333',
              fontWeight: activeTab === 'security' ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <XPIcon src="/icons xp/Windows XP Icons/Security Center.png" size={16} />
            <span>Security Center</span>
          </div>
        </div>

        {/* See Also Card */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '4px',
          padding: '8px',
          color: '#0c3276',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '11px' }}>
            See Also
          </div>
          <div
            onClick={() => onOpenApp?.('help')}
            style={{ cursor: 'pointer', color: '#0054e3', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <XPIcon src="/icons xp/Windows XP Icons/Help and Support.png" size={14} /> Help and Support
          </div>
          <div
            onClick={() => onOpenApp?.('dispprops')}
            style={{ cursor: 'pointer', color: '#0054e3', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <XPIcon src="/icons xp/Windows XP Icons/Display Properties.png" size={14} /> Display Properties
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        padding: '16px 20px',
        overflowY: 'auto',
        background: '#ffffff',
      }}>
        {/* Category View - Main Screen */}
        {activeTab === 'main' && viewMode === 'category' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h1 style={{ fontSize: '16px', color: '#0a246a', margin: '0 0 4px', fontWeight: 'bold' }}>
                Pick a category
              </h1>
              <p style={{ color: '#666', margin: 0, fontSize: '11px' }}>
                Configure and customize your Windows XP Portfolio Edition settings.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={cat.action}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#eef5ff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: '40px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <XPIcon src={cat.icon} size={36} alt={cat.title} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#0a246a', fontSize: '11px', marginBottom: '2px' }}>
                      {cat.title}
                    </div>
                    <div style={{ color: '#555', fontSize: '10px', lineHeight: 1.3 }}>
                      {cat.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classic View - Grid of Applets */}
        {activeTab === 'main' && viewMode === 'classic' && (
          <div>
            <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '15px', color: '#0a246a', margin: '0 0 2px', fontWeight: 'bold' }}>
                  Classic Control Panel
                </h1>
                <p style={{ color: '#666', margin: 0, fontSize: '10px' }}>
                  Double-click or click an item to open settings.
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))',
              gap: '10px',
            }}>
              {classicApplets.map((item) => (
                <div
                  key={item.name}
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '8px 4px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: '1px solid transparent',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#e8f4ff';
                    e.currentTarget.style.borderColor = '#b8d4f0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                    <XPIcon src={item.icon} size={32} alt={item.name} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#333', lineHeight: 1.2, wordBreak: 'break-word' }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sounds & Audio Devices Tab */}
        {activeTab === 'sounds' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <button
                className="xp-button"
                onClick={() => setActiveTab('main')}
                style={{ padding: '2px 8px', minWidth: 'auto', minHeight: 'auto', fontSize: '10px' }}
              >
                ◀ Back
              </button>
              <h2 style={{ margin: 0, fontSize: '14px', color: '#0a246a' }}>
                Sounds and Audio Scheme
              </h2>
            </div>

            <fieldset className="xp-fieldset" style={{ marginBottom: '14px' }}>
              <legend>Sound Scheme</legend>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <select
                  value={soundScheme}
                  onChange={(e) => setSoundScheme(e.target.value)}
                  style={{
                    padding: '3px 8px',
                    border: '1px solid #7f9db9',
                    fontFamily: 'Tahoma, sans-serif',
                    fontSize: '11px',
                    flex: 1,
                  }}
                >
                  <option value="Windows Default">Windows Default</option>
                  <option value="Retro Utopia">Windows Utopia</option>
                  <option value="No Sounds">No Sounds</option>
                </select>
                <button
                  className="xp-button"
                  style={{ fontSize: '10px', minWidth: '70px' }}
                  onClick={() => playSound('Startup', 'startup')}
                >
                  ▶ Test Scheme
                </button>
              </div>
            </fieldset>

            <fieldset className="xp-fieldset">
              <legend>Program Events (Click Play to preview)</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {soundEvents.map((evt) => (
                  <div
                    key={evt.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: activeSoundPlaying === evt.name ? '#e8f4ff' : '#f9f9f9',
                      border: '1px solid #e0e0e0',
                      borderRadius: '3px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#0a246a' }}>
                        {evt.name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#666' }}>{evt.desc}</div>
                    </div>
                    <button
                      className="xp-button"
                      onClick={() => playSound(evt.name, evt.type)}
                      style={{
                        padding: '2px 10px',
                        fontSize: '10px',
                        minWidth: '60px',
                        minHeight: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>▶</span> Play
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {/* System Properties & Live Specs */}
        {activeTab === 'system' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <button
                className="xp-button"
                onClick={() => setActiveTab('main')}
                style={{ padding: '2px 8px', minWidth: 'auto', minHeight: 'auto', fontSize: '10px' }}
              >
                ◀ Back
              </button>
              <h2 style={{ margin: 0, fontSize: '14px', color: '#0a246a' }}>
                System Properties & Performance
              </h2>
            </div>

            <fieldset className="xp-fieldset" style={{ marginBottom: '12px' }}>
              <legend>System Information</legend>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <XPIcon src="/icons xp/Windows XP Icons/System Properties.png" size={48} alt="System" />
                <div style={{ flex: 1, fontSize: '11px', lineHeight: 1.6 }}>
                  <div><strong>Microsoft Windows XP</strong></div>
                  <div style={{ color: '#555' }}>Portfolio Professional Edition</div>
                  <div style={{ color: '#555' }}>Service Pack 3 (Build 2600.xpsp_sp3_gdr)</div>
                </div>
              </div>
            </fieldset>

            <fieldset className="xp-fieldset" style={{ marginBottom: '12px' }}>
              <legend>Performance & Hardware</legend>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#666', width: '120px' }}>Computer:</td>
                    <td style={{ fontWeight: 'bold' }}>RAYEN-WORKSTATION</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#666' }}>Processor:</td>
                    <td>Intel(R) Core(TM) i9 Architecture @ 4.80GHz</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#666' }}>Physical RAM:</td>
                    <td>64.0 GB of High-Speed Memory</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#666' }}>Session Uptime:</td>
                    <td style={{ color: '#0a246a', fontWeight: 'bold' }}>{uptime}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#666' }}>Rendering Engine:</td>
                    <td>React 19 Next.js Hardware Accelerated Canvas</td>
                  </tr>
                </tbody>
              </table>
            </fieldset>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="xp-button" onClick={() => onOpenApp?.('dispprops')}>
                Display Settings...
              </button>
              <button className="xp-button" onClick={() => onOpenApp?.('cmd')}>
                Command Prompt...
              </button>
            </div>
          </div>
        )}

        {/* Security Center Tab */}
        {activeTab === 'security' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <button
                className="xp-button"
                onClick={() => setActiveTab('main')}
                style={{ padding: '2px 8px', minWidth: 'auto', minHeight: 'auto', fontSize: '10px' }}
              >
                ◀ Back
              </button>
              <h2 style={{ margin: 0, fontSize: '14px', color: '#0a246a' }}>
                Windows Security Center
              </h2>
            </div>

            <div style={{
              background: '#eef8ee',
              border: '1px solid #4caf50',
              borderRadius: '4px',
              padding: '10px 14px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <XPIcon src="/icons xp/Windows XP Icons/Security Center.png" size={32} alt="Protected" />
              <div>
                <div style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '12px' }}>
                  Your computer is protected!
                </div>
                <div style={{ fontSize: '10px', color: '#555' }}>
                  All security services are active and configured with recommended settings.
                </div>
              </div>
            </div>

            <fieldset className="xp-fieldset" style={{ marginBottom: '12px' }}>
              <legend>Security Essentials</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Firewall', status: 'ON', desc: 'Windows Firewall is actively shielding network ports.', icon: '/icons xp/Windows XP Icons/Firewall.png' },
                  { name: 'Automatic Updates', status: 'ON', desc: 'Windows is set to automatically download and install updates.', icon: '/icons xp/Windows XP Icons/Windows Update.png' },
                  { name: 'Virus Protection', status: 'ON', desc: 'Antivirus definitions are up to date and monitoring file activity.', icon: '/icons xp/Windows XP Icons/Virus Protection.png' },
                ].map((sec) => (
                  <div key={sec.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <XPIcon src={sec.icon} size={24} />
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{sec.name}</div>
                        <div style={{ fontSize: '10px', color: '#666' }}>{sec.desc}</div>
                      </div>
                    </div>
                    <span style={{
                      background: '#d4edda',
                      color: '#155724',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      fontWeight: 'bold',
                      fontSize: '10px',
                    }}>
                      ✓ {sec.status}
                    </span>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
}
