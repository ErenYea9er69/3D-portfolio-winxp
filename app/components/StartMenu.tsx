'use client';

import { useState, useEffect } from 'react';
import XPIcon from './XPIcon';

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
    { id: 'mycomputer', title: 'My Computer', icon: '/icons xp/Windows XP Icons/My Computer.png' },
    { id: 'about', title: 'About Me', icon: '/icons xp/Windows XP Icons/User Accounts.png' },
    { id: 'projects', title: 'My Projects', icon: '/icons xp/Windows XP Icons/Folder Closed.png' },
    { id: 'skills', title: 'Skills', icon: '/icons xp/Windows XP Icons/Performance.png' },
    { id: 'contact', title: 'Contact', icon: '/icons xp/Windows XP Icons/Email.png' },
    { id: 'notepad', title: 'Notepad', icon: '/icons xp/Windows XP Icons/Notepad.png' },
    { id: 'calculator', title: 'Calculator', icon: '/icons xp/Windows XP Icons/Calculator.png' },
    { id: 'minesweeper', title: 'Minesweeper', icon: '/icons xp/Windows XP Icons/Minesweeper.png' },
    { id: 'solitaire', title: 'Solitaire', icon: '/icons xp/Windows XP Icons/Solitaire.png' },
    { id: 'paint', title: 'Paint', icon: '/icons xp/Windows XP Icons/Paint.png' },
    { id: 'snake', title: 'Snake', icon: '/icons xp/Windows XP Icons/Game Controller.png' },
    { id: 'iexplorer', title: 'Internet Explorer', icon: '/icons xp/Windows XP Icons/Internet Explorer 6.png' },
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
          <div className="xp-start-menu-avatar" style={{ overflow: 'hidden', padding: '2px', background: 'white' }}>
            <XPIcon src="/icons xp/Windows XP Icons/User Accounts.png" size={38} alt="User Avatar" />
          </div>
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
                  <div className="xp-start-menu-item-icon">
                    <XPIcon src={item.icon} size={30} alt={item.title} />
                  </div>
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
                <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                  <XPIcon src={item.icon} size={20} alt={item.title} />
                </div>
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
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/Programs.png" size={20} alt="All Programs" />
              </div>
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
                    <div className="xp-start-menu-item-icon" style={{ width: '18px', height: '18px' }}>
                      <XPIcon src={item.icon} size={16} alt={item.title} />
                    </div>
                    <span style={{ fontSize: '11px' }}>{item.title}</span>
                  </div>
                ))}
                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', fontWeight: 'bold', borderTop: '1px solid #ccc', marginTop: '4px' }}>
                  Accessories
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('notepad')}>
                  <div className="xp-start-menu-item-icon" style={{ width: '18px', height: '18px' }}>
                    <XPIcon src="/icons xp/Windows XP Icons/Notepad.png" size={16} alt="Notepad" />
                  </div>
                  <span style={{ fontSize: '11px' }}>Notepad</span>
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('calculator')}>
                  <div className="xp-start-menu-item-icon" style={{ width: '18px', height: '18px' }}>
                    <XPIcon src="/icons xp/Windows XP Icons/Calculator.png" size={16} alt="Calculator" />
                  </div>
                  <span style={{ fontSize: '11px' }}>Calculator</span>
                </div>
                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', fontWeight: 'bold', borderTop: '1px solid #ccc', marginTop: '4px' }}>
                  Games
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('minesweeper')}>
                  <div className="xp-start-menu-item-icon" style={{ width: '18px', height: '18px' }}>
                    <XPIcon src="/icons xp/Windows XP Icons/Minesweeper.png" size={16} alt="Minesweeper" />
                  </div>
                  <span style={{ fontSize: '11px' }}>Minesweeper</span>
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('solitaire')}>
                  <div className="xp-start-menu-item-icon" style={{ width: '18px', height: '18px' }}>
                    <XPIcon src="/icons xp/Windows XP Icons/Solitaire.png" size={16} alt="Solitaire" />
                  </div>
                  <span style={{ fontSize: '11px' }}>Solitaire</span>
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('snake')}>
                  <div className="xp-start-menu-item-icon" style={{ width: '18px', height: '18px' }}>
                    <XPIcon src="/icons xp/Windows XP Icons/Game Controller.png" size={16} alt="Snake" />
                  </div>
                  <span style={{ fontSize: '11px' }}>Snake</span>
                </div>
                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', fontWeight: 'bold', borderTop: '1px solid #ccc', marginTop: '4px' }}>
                  Creativity
                </div>
                <div className="xp-start-menu-item" onClick={() => handleItemClick('paint')}>
                  <div className="xp-start-menu-item-icon" style={{ width: '18px', height: '18px' }}>
                    <XPIcon src="/icons xp/Windows XP Icons/Paint.png" size={16} alt="Paint" />
                  </div>
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
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/User Accounts.png" size={20} alt="My Profile" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>My Profile</span>
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('projects')}
            >
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/My Documents.png" size={20} alt="My Projects" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>My Projects</span>
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('skills')}
            >
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/Performance.png" size={20} alt="My Skills" />
              </div>
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
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/Email.png" size={20} alt="Contact Me" />
              </div>
              <span style={{ fontSize: '11px' }}>Contact Me</span>
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('iexplorer')}
            >
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/Internet Explorer 6.png" size={20} alt="Internet Explorer" />
              </div>
              <span style={{ fontSize: '11px' }}>Internet Explorer</span>
            </div>
            <div 
              className="xp-start-menu-item"
              onClick={() => handleItemClick('notepad')}
            >
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/Notepad.png" size={20} alt="Notepad" />
              </div>
              <span style={{ fontSize: '11px' }}>Notepad</span>
            </div>
            
            <div style={{ 
              height: '1px', 
              background: 'rgba(255,255,255,0.2)', 
              margin: '6px 8px' 
            }} />
            
            <div className="xp-start-menu-item" onClick={() => handleItemClick('help')}>
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/Help and Support.png" size={20} alt="Help and Support" />
              </div>
              <span style={{ fontSize: '11px' }}>Help and Support</span>
            </div>
            <div className="xp-start-menu-item" onClick={() => handleItemClick('iexplorer')}>
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/Search.png" size={20} alt="Search" />
              </div>
              <span style={{ fontSize: '11px' }}>Search</span>
            </div>
            <div className="xp-start-menu-item" onClick={() => handleItemClick('run')}>
              <div className="xp-start-menu-item-icon" style={{ width: '22px', height: '22px' }}>
                <XPIcon src="/icons xp/Windows XP Icons/Run.png" size={20} alt="Run" />
              </div>
              <span style={{ fontSize: '11px' }}>Run...</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="xp-start-menu-footer">
          <button className="xp-start-menu-footer-btn" onClick={() => { onClose(); onLogOff(); }}>
            <XPIcon src="/icons xp/Windows XP Icons/Logout.png" size={16} alt="Log Off" />
            <span>Log Off</span>
          </button>
          <button className="xp-start-menu-footer-btn" onClick={() => { onClose(); onShutdown(); }}>
            <XPIcon src="/icons xp/Windows XP Icons/Power.png" size={16} alt="Turn Off" />
            <span>Turn Off Computer</span>
          </button>
        </div>
      </div>
    </>
  );
}
