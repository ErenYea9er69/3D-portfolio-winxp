'use client';

import { useState } from 'react';

export default function NotepadContent() {
  const [text, setText] = useState(`Welcome to Notepad!
  
This is a simple text editor, just like the classic Windows XP Notepad.

Feel free to type anything here...

--------------------
Prasenjit Nayak
Full Stack Developer
Odisha, India
--------------------

Thanks for visiting my portfolio!`);

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'white',
      margin: '-8px',
    }}>
      {/* Menu bar */}
      <div style={{
        display: 'flex',
        gap: '2px',
        padding: '2px 4px',
        borderBottom: '1px solid #aca899',
        background: '#ece9d8',
        fontSize: '11px',
      }}>
        <span style={{ padding: '2px 6px', cursor: 'pointer' }}>File</span>
        <span style={{ padding: '2px 6px', cursor: 'pointer' }}>Edit</span>
        <span style={{ padding: '2px 6px', cursor: 'pointer' }}>Format</span>
        <span style={{ padding: '2px 6px', cursor: 'pointer' }}>View</span>
        <span style={{ padding: '2px 6px', cursor: 'pointer' }}>Help</span>
      </div>
      
      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '4px',
          fontFamily: 'Lucida Console, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.4',
          background: 'white',
        }}
        spellCheck={false}
      />
      
      {/* Status bar */}
      <div style={{
        padding: '2px 8px',
        borderTop: '1px solid #aca899',
        background: '#ece9d8',
        fontSize: '10px',
        color: '#444',
      }}>
        Ln 1, Col 1
      </div>
    </div>
  );
}
