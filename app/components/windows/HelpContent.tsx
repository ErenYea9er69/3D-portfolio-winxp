'use client';

export default function HelpContent() {
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
        <span style={{ fontSize: '24px' }}>❓</span>
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
          <div>💻 My Computer - System info</div>
          <div>👤 About Me - Profile</div>
          <div>📁 My Projects - Portfolio</div>
          <div>📊 Skills - Tech stack</div>
          <div>📧 Contact - Get in touch</div>
          <div>🌐 Internet Explorer - Browse</div>
          <div>📝 Notepad - Text editor</div>
          <div>🔢 Calculator - Math</div>
          <div>🎨 Paint - Drawing app</div>
          <div>💣 Minesweeper - Game</div>
          <div>🃏 Solitaire - Card game</div>
          <div>🐍 Snake - Classic game</div>
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
