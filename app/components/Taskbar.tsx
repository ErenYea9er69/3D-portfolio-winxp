'use client';

import { useState, useEffect } from 'react';

interface WindowInfo {
  id: string;
  title: string;
  icon: string;
  isMinimized: boolean;
}

interface TaskbarProps {
  windows: WindowInfo[];
  activeWindowId: string | null;
  onWindowClick: (id: string) => void;
  onStartClick: () => void;
  isStartMenuOpen: boolean;
}

function Clock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }));
      setDate(now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <span className="xp-clock">--:-- --</span>;

  return (
    <span className="xp-clock" title={date}>
      {time}
    </span>
  );
}

function WindowsFlag() {
  return (
    <div className="xp-windows-flag">
      <div className="xp-windows-flag-red" />
      <div className="xp-windows-flag-green" />
      <div className="xp-windows-flag-blue" />
      <div className="xp-windows-flag-yellow" />
    </div>
  );
}

function TaskbarButton({ 
  window, 
  isActive, 
  onClick 
}: { 
  window: WindowInfo; 
  isActive: boolean; 
  onClick: () => void;
}) {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      className={`xp-taskbar-item ${isActive ? 'active' : ''} ${window.isMinimized ? 'minimized' : ''}`}
      onClick={onClick}
      title={window.title}
      style={{
        animation: isNew ? 'taskbarSlideIn 0.15s ease-out' : 'none',
      }}
    >
      <span className="xp-taskbar-item-icon">{window.icon}</span>
      <span className="xp-taskbar-item-title">{window.title}</span>
    </button>
  );
}

export default function Taskbar({
  windows,
  activeWindowId,
  onWindowClick,
  onStartClick,
  isStartMenuOpen,
}: TaskbarProps) {
  return (
    <div className="xp-taskbar">
      {/* Start Button */}
      <button 
        className={`xp-start-button ${isStartMenuOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <div className="xp-start-button-icon">
          <WindowsFlag />
        </div>
        <span>start</span>
      </button>
      
      {/* Quick Launch Divider */}
      <div className="xp-taskbar-divider" />
      
      {/* Open Windows */}
      <div className="xp-taskbar-windows">
        {windows.length === 0 ? (
          <div className="xp-taskbar-empty" />
        ) : (
          windows.map(win => (
            <TaskbarButton
              key={win.id}
              window={win}
              isActive={activeWindowId === win.id && !win.isMinimized}
              onClick={() => onWindowClick(win.id)}
            />
          ))
        )}
      </div>

      {/* Tray Divider */}
      <div className="xp-taskbar-divider" />

      {/* System Tray */}
      <div className="xp-taskbar-tray">
        <div className="xp-tray-icons">
          <span className="xp-tray-icon" title="Volume">🔊</span>
          <span className="xp-tray-icon" title="Network - Connected">📶</span>
          <span className="xp-tray-icon" title="Security">🛡️</span>
        </div>
        <div className="xp-tray-clock">
          <Clock />
        </div>
      </div>

      <style jsx>{`
        @keyframes taskbarSlideIn {
          from {
            opacity: 0;
            transform: scaleX(0.8);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
