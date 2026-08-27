'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  subtitle?: string;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (id: string) => void;
  onLogOff: () => void;
  onShutdown: () => void;
  menuItems: MenuItem[];
}

export default function StartMenu({ isOpen, onClose, onItemClick, onLogOff, onShutdown, menuItems }: StartMenuProps) {
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  // Reset showAllPrograms when menu closes
  useEffect(() => {
    if (!isOpen) {
      setShowAllPrograms(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleItemClick = (id: string) => {
    onItemClick(id);
    onClose();
    setShowAllPrograms(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    setShowAllPrograms(false);
  };

  const leftItems = menuItems.slice(0, 6);
  const programItems = menuItems.slice(6);

  const allProgramsList = [
    { id: 'mycomputer', title: 'My Computer', icon: '💻' },
    { id: 'about', title: 'About Me', icon: '👤' },
    { id: 'projects', title: 'My Projects', icon: '📁' },
    { id: 'skills', title: 'Skills', icon: '📊' },
    { id: 'contact', title: 'Contact', icon: '📧' },
    { id: 'notepad', title: 'Notepad', icon: '📝' },
    { id: 'calculator', title: 'Calculator', icon: '🔢' },
    { id: 'minesweeper', title: 'Minesweeper', icon: '💣' },
    { id: 'solitaire', title: 'Solitaire', icon: '🃏' },
    { id: 'paint', title: 'Paint', icon: '🎨' },
    { id: 'snake', title: 'Snake', icon: '🐍' },
    { id: 'iexplorer', title: 'Internet Explorer', icon: '🌐' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
        }}
        onClick={handleBackdropClick}
      />
      
      {/* Start Menu */}
      <div className="xp-start-menu" style={{ animation: 'window-open 0.15s ease-out' }}>
        {/* Header with user */}
        <div className="xp-start-menu-header">
          <div className="xp-start-menu-avatar">👤</div>
          <span className="xp-start-menu-user">Prasenjit Nayak</span>
        </div>

        {/* Body */}
        <div className="xp-start-menu-body">
          {/* Left side - Programs (white) */}
          <div className="xp-start-menu-left" style={{ position: 'relative' }}>
            {/* Main items with icons */}
            {leftItems.map((item, index) => (
              <div key={item.id}>
                {index === 4 && <div className="xp-start-menu-divider" />}
                <div
                  className="xp-start-menu-item"
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="xp-start-menu-item-icon">{item.icon}</div>
                  <div className="xp-start-menu-item-text">
                    <span className="xp-start-menu-item-title">{item.title}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="xp-start-menu-divider" />
            
            {/* Apps section */}
            {programItems.map((item) => (
              <div
                key={item.id}
                className="xp-start-menu-item"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="xp-start-menu-item-icon" style={{ fontSize: '18px' }}>{item.icon}</div>
                <div className="xp-start-menu-item-text">
                  <span className="xp-start-menu-item-title">{item.title}</span>
                </div>
              </div>
            ))}
            
            <div className="xp-start-menu-divider" />
            
            <div 
              className="xp-start-menu-item all-programs-trigger"
              onMouseEnter={() => setShowAllPrograms(true)}
              onClick={(e) => {
                e.stopPropagation();
                setShowAllPrograms(!showAllPrograms);
              }}
              style={{ 
                background: showAllPrograms ? '#316ac5' : undefined,
                color: showAllPrograms ? 'white' : undefined,
              }}
            >
              <div className="xp-start-menu-item-icon" style={{ fontSize: '18px' }}>📂</div>
              <div className="xp-start-menu-item-text">
                <span className="xp-start-menu-item-title" style={{ color: showAllPrograms ? 'white' : undefined }}>
                  All Programs
                </span>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: showAllPrograms ? 'white' : '#000' }}>▶</span>
            </div>

            {/* All Programs Flyout */}
            {showAllPrograms && (
              <div 
                className="xp-all-programs-flyout"
                onMouseLeave={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX;
                  const y = e.clientY;
                  if (x < rect.left && y >= rect.top - 30 && y <= rect.bottom + 10) {
                    return;
                  }
                  setShowAllPrograms(false);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
                  Programs
                </div>
                {allProgramsList.map((item) => (
                  <div
                    key={item.id}
                    className="xp-start-menu-item"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="xp-start-menu-item-icon" style={{ fontSize: '16px', width: '20px', height: '20px' }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: '11px' }}>{item.title}</span>
                  </div>
                ))}
                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', fontWeight: 'bold', borderTop: '1px solid #ccc', marginTop: '4px' }}>
                  Accessories
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('notepad')}>
                  <div className="xp-start-menu-item-icon" style={{ fontSize: '16px', width: '20px', height: '20px' }}>📝</div>
                  <span style={{ fontSize: '11px' }}>Notepad</span>
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('calculator')}>
                  <div className="xp-start-menu-item-icon" style={{ fontSize: '16px', width: '20px', height: '20px' }}>🔢</div>
                  <span style={{ fontSize: '11px' }}>Calculator</span>
                </div>
                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', fontWeight: 'bold', borderTop: '1px solid #ccc', marginTop: '4px' }}>
                  Games
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('minesweeper')}>
                  <div className="xp-start-menu-item-icon" style={{ fontSize: '16px', width: '20px', height: '20px' }}>💣</div>
                  <span style={{ fontSize: '11px' }}>Minesweeper</span>
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('solitaire')}>
                  <div className="xp-start-menu-item-icon" style={{ fontSize: '16px', width: '20px', height: '20px' }}>🃏</div>
                  <span style={{ fontSize: '11px' }}>Solitaire</span>
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('snake')}>
                  <div className="xp-start-menu-item-icon" style={{ fontSize: '16px', width: '20px', height: '20px' }}>🐍</div>
                  <span style={{ fontSize: '11px' }}>Snake</span>
                </div>
                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', fontWeight: 'bold', borderTop: '1px solid #ccc', marginTop: '4px' }}>
                  Creativity
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('paint')}>
                  <div className="xp-start-menu-item-icon" style={{ fontSize: '16px', width: '20px', height: '20px' }}>🎨</div>
                  <span style={{ fontSize: '11px' }}>Paint</span>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Places (blue) */}
          <div className="xp-start-menu-right">
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('about')}
            >
              <div className="xp-start-menu-item-icon">👤</div>
              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>My Profile</span>
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('projects')}
            >
              <div className="xp-start-menu-item-icon">📁</div>
              <span style={{ fontSize: '11px' }}>My Projects</span>
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('skills')}
            >
              <div className="xp-start-menu-item-icon">📊</div>
              <span style={{ fontSize: '11px' }}>My Skills</span>
            </div>
            
            <div style={{ 
              height: '1px', 
              background: 'rgba(255,255,255,0.2)', 
              margin: '6px 8px' 
            }} />

            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('contact')}
            >
              <div className="xp-start-menu-item-icon">📧</div>
              <span style={{ fontSize: '11px' }}>Contact Me</span>
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('iexplorer')}
            >
              <div className="xp-start-menu-item-icon">🌐</div>
              <span style={{ fontSize: '11px' }}>Internet Explorer</span>
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('notepad')}
            >
              <div className="xp-start-menu-item-icon">📝</div>
              <span style={{ fontSize: '11px' }}>Notepad</span>
            </div>
            
            <div style={{ 
              height: '1px', 
              background: 'rgba(255,255,255,0.2)', 
              margin: '6px 8px' 
            }} />
            
            <div className="xp-start-menu-item" onClick={() => handleItemClick('help')}>
              <div className="xp-start-menu-item-icon">❓</div>
              <span style={{ fontSize: '11px' }}>Help and Support</span>
            </div>
            <div className="xp-start-menu-item" onClick={() => handleItemClick('iexplorer')}>
              <div className="xp-start-menu-item-icon">🔍</div>
              <span style={{ fontSize: '11px' }}>Search</span>
            </div>
            <div className="xp-start-menu-item" onClick={() => handleItemClick('run')}>
              <div className="xp-start-menu-item-icon">▶️</div>
              <span style={{ fontSize: '11px' }}>Run...</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="xp-start-menu-footer">
          <button className="xp-start-menu-footer-btn" onClick={() => { onClose(); onLogOff(); }}>
            <span style={{ fontSize: '14px' }}>🔐</span>
            <span>Log Off</span>
          </button>
          <button className="xp-start-menu-footer-btn" onClick={() => { onClose(); onShutdown(); }}>
            <span style={{ fontSize: '14px', color: '#ff6b6b' }}>⏻</span>
            <span>Turn Off Computer</span>
          </button>
        </div>
      </div>
    </>
  );
}
