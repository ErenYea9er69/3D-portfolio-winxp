'use client';

import { useState } from 'react';
import XPIcon from '../XPIcon';

interface RunDialogContentProps {
  onOpenApp: (appId: string) => void;
}

export default function RunDialogContent({ onOpenApp }: RunDialogContentProps) {
  const [command, setCommand] = useState('');
  const [error, setError] = useState('');

  const appMap: Record<string, string> = {
    'notepad': 'notepad',
    'notepad.exe': 'notepad',
    'calc': 'calculator',
    'calc.exe': 'calculator',
    'calculator': 'calculator',
    'minesweeper': 'minesweeper',
    'winmine': 'minesweeper',
    'winmine.exe': 'minesweeper',
    'solitaire': 'solitaire',
    'sol': 'solitaire',
    'sol.exe': 'solitaire',
    'spider': 'spidersolitaire',
    'spider.exe': 'spidersolitaire',
    'spidersolitaire': 'spidersolitaire',
    'pinball': 'pinball',
    'pinball.exe': 'pinball',
    'wordpad': 'wordpad',
    'wordpad.exe': 'wordpad',
    'write': 'wordpad',
    'write.exe': 'wordpad',
    'taskmgr': 'taskmgr',
    'taskmgr.exe': 'taskmgr',
    'taskmanager': 'taskmgr',
    'task manager': 'taskmgr',
    'tasks': 'taskmgr',
    'msn': 'msnmsgr',
    'msnmsgr': 'msnmsgr',
    'msnmsgr.exe': 'msnmsgr',
    'messenger': 'msnmsgr',
    'chat': 'msnmsgr',
    'shimgvw': 'pictureviewer',
    'shimgvw.dll': 'pictureviewer',
    'pictureviewer': 'pictureviewer',
    'pictures': 'pictureviewer',
    'picture': 'pictureviewer',
    'photo': 'pictureviewer',
    'photos': 'pictureviewer',
    'paint': 'paint',
    'mspaint': 'paint',
    'mspaint.exe': 'paint',
    'snake': 'snake',
    'iexplore': 'iexplorer',
    'iexplore.exe': 'iexplorer',
    'explorer': 'mycomputer',
    'explorer.exe': 'mycomputer',
    'help': 'help',
    'about': 'about',
    'projects': 'projects',
    'skills': 'skills',
    'contact': 'contact',
    'cmd': 'cmd',
    'cmd.exe': 'cmd',
    'command': 'cmd',
    'prompt': 'cmd',
    'terminal': 'cmd',
    'wmp': 'mediaplayer',
    'wmplayer': 'mediaplayer',
    'wmplayer.exe': 'mediaplayer',
    'media': 'mediaplayer',
    'music': 'mediaplayer',
    'control': 'controlpanel',
    'controlpanel': 'controlpanel',
    'control panel': 'controlpanel',
    'settings': 'controlpanel',
    'display': 'dispprops',
    'desk.cpl': 'dispprops',
  };

  const handleRun = () => {
    const cmd = command.toLowerCase().trim();
    
    if (!cmd) {
      setError('Please enter a command.');
      return;
    }

    const appId = appMap[cmd];
    if (appId) {
      onOpenApp(appId);
      setCommand('');
      setError('');
    } else {
      setError(`Windows cannot find '${command}'. Make sure you typed the name correctly.`);
    }
  };

  return (
    <div style={{ padding: '5px 0' }}>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/Run.png" size={32} alt="Run" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 10px', fontSize: '11px' }}>
            Type the name of a program, and Windows will open it for you.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>Open:</label>
            <input
              type="text"
              value={command}
              onChange={(e) => {
                setCommand(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRun();
              }}
              placeholder="notepad, calc, help..."
              style={{
                flex: 1,
                padding: '4px 6px',
                border: '1px solid #7f9db9',
                fontSize: '11px',
                fontFamily: 'Tahoma, sans-serif',
              }}
              autoFocus
            />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffc107',
          padding: '8px',
          marginBottom: '10px',
          fontSize: '10px',
          color: '#856404',
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        fontSize: '10px', 
        color: '#666', 
        marginBottom: '10px',
        padding: '8px',
        background: '#f5f5f5',
        border: '1px solid #ddd',
      }}>
        <strong>Available commands:</strong>
        <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <span>notepad</span>
          <span>calc</span>
          <span>minesweeper</span>
          <span>solitaire</span>
          <span>paint</span>
          <span>snake</span>
          <span>iexplore</span>
          <span>explorer</span>
          <span>help</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button className="xp-button" onClick={handleRun}>
          OK
        </button>
        <button className="xp-button" onClick={() => onOpenApp('')}>
          Cancel
        </button>
        <button className="xp-button" onClick={() => onOpenApp('iexplorer')}>
          Browse...
        </button>
      </div>
    </div>
  );
}
