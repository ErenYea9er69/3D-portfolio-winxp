'use client';

import { useState, useEffect, useRef } from 'react';
import XPIcon from './XPIcon';

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
  onWindowAction: (id: string, action: 'restore' | 'minimize' | 'close') => void;
  onStartClick: () => void;
  isStartMenuOpen: boolean;
  onShowDesktop: () => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function CalendarFlyout({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '34px',
        right: '8px',
        width: '190px',
        background: '#fff',
        border: '1px solid #7998c9',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
        zIndex: 99999,
        borderRadius: '3px',
        overflow: 'hidden',
      }}
    >
      <div style={{
        background: 'linear-gradient(180deg, #4a90e2 0%, #2f6fc4 100%)',
        color: 'white',
        padding: '6px 8px',
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        {today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
      </div>
      <div style={{ padding: '8px' }}>
        <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '6px' }}>
          {MONTHS[month]} {year}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
          {WEEKDAYS.map(w => (
            <div key={w} style={{ color: '#888', fontSize: '10px', fontWeight: 'bold' }}>{w}</div>
          ))}
          {cells.map((d, i) => (
            <div
              key={i}
              style={{
                padding: '2px 0',
                borderRadius: '2px',
                background: d === today.getDate() ? '#ff8c00' : 'transparent',
                color: d === today.getDate() ? 'white' : '#000',
                fontWeight: d === today.getDate() ? 'bold' : 'normal',
              }}
            >
              {d ?? ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VolumeFlyout({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState(70);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '34px',
        right: '60px',
        width: '70px',
        height: '130px',
        background: '#fff',
        border: '1px solid #7998c9',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '10px',
        zIndex: 99999,
        borderRadius: '3px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 0',
      }}
    >
      <span style={{ marginBottom: '4px', fontWeight: 'bold' }}>Volume</span>
      <input
        type="range"
        min={0}
        max={100}
        value={muted ? 0 : level}
        onChange={(e) => { setLevel(Number(e.target.value)); if (muted) setMuted(false); }}
        style={{
          writingMode: 'vertical-lr',
          direction: 'rtl',
          width: '20px',
          height: '70px',
          accentColor: '#3366cc',
        }}
      />
      <label style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
        <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} />
        Mute
      </label>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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
    <>
      <span
        className="xp-clock"
        title={date}
        onClick={() => setShowCalendar(v => !v)}
        style={{ cursor: 'pointer' }}
      >
        {time}
      </span>
      {showCalendar && <CalendarFlyout onClose={() => setShowCalendar(false)} />}
    </>
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
  onClick,
  onAction,
}: { 
  window: WindowInfo; 
  isActive: boolean; 
  onClick: () => void;
  onAction: (action: 'restore' | 'minimize' | 'close') => void;
}) {
  const [isNew, setIsNew] = useState(true);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!menuPos) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuPos(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuPos]);

  return (
    <div style={{ position: 'relative', flex: '0 1 auto', minWidth: 0 }}>
      <button
        className={`xp-taskbar-item ${isActive ? 'active' : ''} ${window.isMinimized ? 'minimized' : ''}`}
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuPos({ x: e.clientX, y: e.clientY });
        }}
        title={window.title}
        style={{
          animation: isNew ? 'taskbarSlideIn 0.15s ease-out' : 'none',
        }}
      >
        <span className="xp-taskbar-item-icon">
          <XPIcon src={window.icon} size={15} />
        </span>
        <span className="xp-taskbar-item-title">{window.title}</span>
      </button>

      {menuPos && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            left: menuPos.x,
            top: menuPos.y - 90,
            minWidth: '140px',
            background: 'white',
            border: '1px solid #808080',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            padding: '2px 0',
            fontFamily: 'Tahoma, sans-serif',
            fontSize: '11px',
            zIndex: 99999,
          }}
        >
          {[
            { label: 'Restore', action: 'restore' as const, show: window.isMinimized },
            { label: 'Minimize', action: 'minimize' as const, show: !window.isMinimized },
            { label: 'Close', action: 'close' as const, show: true },
          ].filter(i => i.show).map(item => (
            <div
              key={item.action}
              onClick={() => { onAction(item.action); setMenuPos(null); }}
              style={{ padding: '4px 12px', cursor: 'pointer' }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#316ac5'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Taskbar({
  windows,
  activeWindowId,
  onWindowClick,
  onWindowAction,
  onStartClick,
  isStartMenuOpen,
  onShowDesktop,
}: TaskbarProps) {
  const [showVolume, setShowVolume] = useState(false);

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

      {/* Quick Launch */}
      <div className="xp-taskbar-divider" />
      <button
        className="xp-quicklaunch-btn"
        onClick={onShowDesktop}
        title="Show Desktop"
      >
        <XPIcon src="/icons xp/Windows XP Icons/Desktop.png" size={16} alt="Show Desktop" />
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
              onAction={(action) => onWindowAction(win.id, action)}
            />
          ))
        )}
      </div>

      {/* Tray Divider */}
      <div className="xp-taskbar-divider" />

      {/* System Tray */}
      <div className="xp-taskbar-tray">
        <div className="xp-tray-icons">
          <span
            className="xp-tray-icon"
            title="Volume"
            onClick={() => setShowVolume(v => !v)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <XPIcon src="/icons xp/Windows XP Icons/Volume.png" size={15} alt="Volume" />
          </span>
          <span className="xp-tray-icon" title="Network - Connected" style={{ display: 'flex', alignItems: 'center' }}>
            <XPIcon src="/icons xp/Windows XP Icons/Wireless Network Connection.png" size={15} alt="Network" />
          </span>
          <span className="xp-tray-icon" title="Security Center" style={{ display: 'flex', alignItems: 'center' }}>
            <XPIcon src="/icons xp/Windows XP Icons/Security Center.png" size={15} alt="Security Center" />
          </span>
        </div>
        <div className="xp-tray-clock">
          <Clock />
        </div>
      </div>

      {showVolume && <VolumeFlyout onClose={() => setShowVolume(false)} />}

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
