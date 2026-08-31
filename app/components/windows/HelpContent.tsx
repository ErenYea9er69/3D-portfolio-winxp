'use client';

import XPIcon from '../XPIcon';

export default function HelpContent() {
  const apps = [
    { icon: '/icons xp/Windows XP Icons/My Computer.png', name: 'My Computer - System info' },
    { icon: '/icons xp/Windows XP Icons/User Accounts.png', name: 'About Me - Profile' },
    { icon: '/icons xp/Windows XP Icons/Folder Closed.png', name: 'My Projects - Portfolio' },
    { icon: '/icons xp/Windows XP Icons/Performance.png', name: 'Skills - Tech stack' },
    { icon: '/icons xp/Windows XP Icons/Email.png', name: 'Contact - Get in touch' },
    { icon: '/icons xp/Windows XP Icons/Internet Explorer 6.png', name: 'Internet Explorer - Browse' },
    { icon: '/icons xp/Windows XP Icons/Notepad.png', name: 'Notepad - Text editor' },
    { icon: '/icons xp/Windows XP Icons/Calculator.png', name: 'Calculator - Math' },
    { icon: '/icons xp/Windows XP Icons/Paint.png', name: 'Paint - Drawing app' },
    { icon: '/icons xp/Windows XP Icons/Minesweeper.png', name: 'Minesweeper - Game' },
    { icon: '/icons xp/Windows XP Icons/Solitaire.png', name: 'Solitaire - Card game' },
    { icon: '/icons xp/Windows XP Icons/Game Controller.png', name: 'Snake - Classic game' },
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <XPIcon src="/icons xp/Windows XP Icons/Help and Support.png" size={28} alt="Help" />
        <div>
          <h2 style={{ margin: 0, fontSize: '14px' }}>Help and Support Center</h2>
          <p style={{ margin: '2px 0 0', color: '#666', fontSize: '10px' }}>
            Windows XP Portfolio Edition
          </p>
        </div>
      </div>

      <fieldset className="xp-fieldset">
        <legend>Welcome to Windows XP Portfolio!</legend>
        <p style={{ fontSize: '11px', lineHeight: '1.6', margin: '5px 0' }}>
          This is a Windows XP-style portfolio website created by Prasenjit Nayak. 
          It recreates the classic Windows XP experience in your browser.
        </p>
      </fieldset>

      <fieldset className="xp-fieldset">
        <legend>How to Use</legend>
        <ul style={{ fontSize: '11px', lineHeight: '1.8', margin: '5px 0', paddingLeft: '20px' }}>
          <li><strong>Desktop Icons:</strong> Double-click to open applications</li>
          <li><strong>Start Menu:</strong> Click the Start button to access programs</li>
          <li><strong>Windows:</strong> Drag title bar to move, click X to close</li>
          <li><strong>Taskbar:</strong> Click to switch between open windows</li>
          <li><strong>All Programs:</strong> Hover over &quot;All Programs&quot; in Start menu</li>
        </ul>
      </fieldset>

      <fieldset className="xp-fieldset">
        <legend>Available Applications</legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
          {apps.map((app, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XPIcon src={app.icon} size={16} />
              <span>{app.name}</span>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="xp-fieldset">
        <legend>Keyboard Shortcuts</legend>
        <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
          <div><strong>Double-click:</strong> Open application</div>
          <div><strong>Click title bar:</strong> Focus window</div>
          <div><strong>Drag title bar:</strong> Move window</div>
        </div>
      </fieldset>

      <div style={{ 
        marginTop: '15px', 
        textAlign: 'center',
        color: '#666',
        fontSize: '10px',
      }}>
        Built with Next.js, React, and CSS
      </div>
    </div>
  );
}
