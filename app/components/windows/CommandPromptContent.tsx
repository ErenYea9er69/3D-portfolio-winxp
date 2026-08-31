'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface CommandPromptContentProps {
  onOpenApp?: (appId: string) => void;
}

interface HistoryLine {
  id: number;
  text: string;
  type?: 'input' | 'output' | 'error' | 'success' | 'matrix';
}

const DEFAULT_BANNER = [
  'Microsoft Windows XP [Version 5.1.2600.5512]',
  '(C) Copyright 1985-2001 Microsoft Corp.',
  '',
  'Windows XP Portfolio Edition Command Interpreter',
  'Type "help" to view available commands, or "matrix" for an easter egg.',
  '',
];

const AVAILABLE_COMMANDS = [
  'help', 'dir', 'ls', 'whoami', 'about', 'projects', 'skills', 'contact',
  'cls', 'clear', 'echo', 'date', 'time', 'ver', 'systeminfo', 'calc',
  'color', 'matrix', 'tree', 'ping', 'start', 'exit', 'sudo',
];

export default function CommandPromptContent({ onOpenApp }: CommandPromptContentProps) {
  const [lines, setLines] = useState<HistoryLine[]>(
    DEFAULT_BANNER.map((text, id) => ({ id, text, type: 'output' }))
  );
  const [inputValue, setInputValue] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMatrixRunning, setIsMatrixRunning] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const matrixIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Matrix animation runner
  useEffect(() => {
    if (!isMatrixRunning) {
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
      return;
    }

    const chars = '0123456789ABCDEF$#@%*+-<>~=';
    let count = 0;

    matrixIntervalRef.current = setInterval(() => {
      count++;
      if (count > 25) {
        setIsMatrixRunning(false);
        setLines(prev => [
          ...prev,
          { id: Date.now() + Math.random(), text: '[Matrix Stream Completed]', type: 'success' },
        ]);
        return;
      }

      let row = '';
      for (let i = 0; i < 45; i++) {
        row += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
      }
      setLines(prev => [
        ...prev,
        { id: Date.now() + Math.random(), text: row, type: 'matrix' },
      ]);
    }, 120);

    return () => {
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
    };
  }, [isMatrixRunning]);

  const processCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) {
      setLines(prev => [
        ...prev,
        { id: Date.now(), text: 'C:\\Documents and Settings\\Rayen> ', type: 'input' },
      ]);
      return;
    }

    // Add to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const fullInputLine: HistoryLine = {
      id: Date.now(),
      text: `C:\\Documents and Settings\\Rayen> ${trimmed}`,
      type: 'input',
    };

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const outputLines: string[] = [];
    let lineType: HistoryLine['type'] = 'output';

    switch (command) {
      case 'help':
        outputLines.push(
          'Available Windows XP Portfolio Commands:',
          '--------------------------------------------------',
          '  ABOUT       - Displays biography and background info',
          '  PROJECTS    - Lists all showcase projects with URLs',
          '  SKILLS      - Displays technical skills and proficiencies',
          '  CONTACT     - Lists contact email and social profiles',
          '  DIR / LS    - Displays directory files in current folder',
          '  WHOAMI      - Displays current logged on user',
          '  SYSTEMINFO  - Displays system configuration and RAM specs',
          '  CALC [expr] - Evaluates mathematical expressions (e.g. calc 24*7)',
          '  COLOR [code]- Changes terminal text color (0a=green, 0b=cyan, 0c=red, 0e=yellow, 0f=white)',
          '  MATRIX      - Streams the green matrix digital rain',
          '  TREE        - Displays graphical folder hierarchy',
          '  PING [host] - Tests latency to a remote server',
          '  START [app] - Launches app (notepad, calc, paint, minesweeper, solitaire, snake, wmp, control)',
          '  DATE / TIME - Displays current date and time',
          '  VER         - Displays Windows XP build version',
          '  CLS / CLEAR - Clears the terminal screen',
          '  EXIT        - Closes or resets command prompt session'
        );
        break;

      case 'cls':
      case 'clear':
        setLines([]);
        return;

      case 'whoami':
        outputLines.push('RAYEN-PC\\Rayen (Administrator)');
        break;

      case 'about':
        outputLines.push(
          'Rayen Ben Aissa - Full Stack Developer',
          'Location: Tunisia',
          'Bio: Passionate about building modern, delightful web applications, retro UI experiences, and developer tools.',
          'Education: B.Tech in CS & IT'
        );
        break;

      case 'projects':
        outputLines.push(
          'Showcase Projects:',
          '1. CleanType - Minimalist distraction-free writing app (Rust, Tauri, TypeScript)',
          '2. Wallpaperz - AI wallpaper generator & discovery platform (Next.js, TailwindCSS)',
          '3. 3D Carousel Gallery - Interactive 3D media player & gallery',
          '4. GitHub Buddy Finder - Connect with developers via GitHub activity'
        );
        break;

      case 'skills':
        outputLines.push(
          'Technical Proficiencies:',
          '• Frontend: React, Next.js, TypeScript, TailwindCSS, Framer Motion, HTML5/CSS3',
          '• Backend:  Node.js, Express.js, MongoDB, REST APIs, Prisma',
          '• Tools:    Git, GitHub, Vercel, VS Code, Vite, Docker, Rust/Tauri'
        );
        break;

      case 'contact':
        outputLines.push(
          'Contact Channels:',
          '• Email:    prasen.nayak@hotmail.com',
          '• GitHub:   https://github.com/StarKnightt',
          '• LinkedIn: https://linkedin.com/in/prasenjitnayak',
          '• Twitter:  https://x.com/Star_Knight12'
        );
        break;

      case 'dir':
      case 'ls':
        outputLines.push(
          ' Volume in drive C has no label.',
          ' Volume Serial Number is 4C28-91FA',
          '',
          ' Directory of C:\\Documents and Settings\\Rayen',
          '',
          '08/31/2026  01:30 AM    <DIR>          .',
          '08/31/2026  01:30 AM    <DIR>          ..',
          '08/31/2026  01:30 AM    <DIR>          My Documents',
          '08/31/2026  01:30 AM    <DIR>          Favorites',
          '08/31/2026  01:30 AM    <DIR>          Start Menu',
          '08/31/2026  01:30 AM             1,420 Resume.doc',
          '08/31/2026  01:30 AM             4,812 Portfolio_Source.ts',
          '08/31/2026  01:30 AM               512 secret_easter_egg.txt',
          '               3 File(s)          6,744 bytes',
          '               5 Dir(s)  98,421,840,896 bytes free'
        );
        break;

      case 'tree':
        outputLines.push(
          'Folder PATH listing for Volume C',
          'C:.',
          '├── My Documents',
          '│   ├── Projects',
          '│   ├── Artwork',
          '│   └── Source Code',
          '├── Desktop',
          '│   ├── My Computer',
          '│   ├── Recycle Bin',
          '│   └── Control Panel',
          '└── Program Files',
          '    ├── Accessories',
          '    ├── Games',
          '    └── Windows Media Player'
        );
        break;

      case 'ver':
        outputLines.push('Microsoft Windows XP [Version 5.1.2600.5512 Service Pack 3]');
        break;

      case 'date':
        outputLines.push(`Current date is: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' })}`);
        break;

      case 'time':
        outputLines.push(`Current time is: ${new Date().toLocaleTimeString('en-US')}`);
        break;

      case 'systeminfo':
        outputLines.push(
          'Host Name:                 RAYEN-PC',
          'OS Name:                   Microsoft Windows XP Professional',
          'OS Version:                5.1.2600 Service Pack 3 Build 2600',
          'System Manufacturer:       Creative Frameworks Inc.',
          'System Model:              XP Portfolio Workstation',
          'Processor(s):              1 Processor(s) Installed.',
          'Total Physical Memory:     65,536 MB',
          'Virtual Memory: Max Size:  131,072 MB',
          'Page File Location(s):     C:\\pagefile.sys'
        );
        break;

      case 'color': {
        const colorArg = args[0]?.toLowerCase();
        if (colorArg === '0a') {
          setTextColor('#00ff66');
          outputLines.push('Terminal text color set to Light Green.');
        } else if (colorArg === '0b') {
          setTextColor('#00ffff');
          outputLines.push('Terminal text color set to Light Aqua.');
        } else if (colorArg === '0c') {
          setTextColor('#ff4444');
          outputLines.push('Terminal text color set to Light Red.');
        } else if (colorArg === '0e') {
          setTextColor('#ffff00');
          outputLines.push('Terminal text color set to Light Yellow.');
        } else if (colorArg === '0f') {
          setTextColor('#ffffff');
          outputLines.push('Terminal text color set to Bright White.');
        } else if (colorArg === '07') {
          setTextColor('#cccccc');
          outputLines.push('Terminal text color set to Standard Gray.');
        } else {
          outputLines.push(
            'Color attributes are specified by two hex digits (e.g. color 0a):',
            '  0a = Green, 0b = Cyan, 0c = Red, 0e = Yellow, 0f = White, 07 = Default'
          );
        }
        break;
      }

      case 'calc': {
        const expr = args.join('');
        if (!expr) {
          outputLines.push('Usage: calc <expression> (e.g. calc 15 * 8 + 4)');
        } else {
          try {
            // Safely evaluate math expression with arithmetic operators only
            if (/^[0-9+\-*/().\s]+$/.test(expr)) {
              // eslint-disable-next-line no-eval
              const result = Function(`'use strict'; return (${expr})`)();
              outputLines.push(`Result: ${result}`);
            } else {
              outputLines.push('Error: Expression contains invalid characters.');
              lineType = 'error';
            }
          } catch {
            outputLines.push('Error: Syntax error in math expression.');
            lineType = 'error';
          }
        }
        break;
      }

      case 'matrix':
        setIsMatrixRunning(true);
        outputLines.push('Initializing Neural Digital Stream...');
        setTextColor('#00ff66');
        break;

      case 'ping': {
        const host = args[0] || 'google.com';
        outputLines.push(
          `Pinging ${host} [142.250.190.46] with 32 bytes of data:`,
          `Reply from 142.250.190.46: bytes=32 time=12ms TTL=117`,
          `Reply from 142.250.190.46: bytes=32 time=14ms TTL=117`,
          `Reply from 142.250.190.46: bytes=32 time=11ms TTL=117`,
          `Reply from 142.250.190.46: bytes=32 time=13ms TTL=117`,
          '',
          `Ping statistics for ${host}:`,
          `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`,
          `Approximate round trip times in milli-seconds:`,
          `    Minimum = 11ms, Maximum = 14ms, Average = 12ms`
        );
        break;
      }

      case 'start': {
        const target = args[0]?.toLowerCase();
        if (target) {
          onOpenApp?.(target);
          outputLines.push(`Launched '${target}'.`);
        } else {
          outputLines.push('Usage: start <app_name> (e.g. start notepad, start calc, start wmp)');
        }
        break;
      }

      case 'echo':
        outputLines.push(args.join(' '));
        break;

      case 'sudo':
        outputLines.push('Nice try! You are already running with Administrator privileges on Windows XP.');
        break;

      case 'exit':
        outputLines.push('Type exit again or close the window from the title bar.');
        break;

      default:
        outputLines.push(
          `'${trimmed}' is not recognized as an internal or external command,`,
          'operable program or batch file. Type "help" for a list of commands.'
        );
        lineType = 'error';
        break;
    }

    const newEntries: HistoryLine[] = [
      fullInputLine,
      ...outputLines.map((text, i) => ({
        id: Date.now() + i + 1,
        text,
        type: lineType,
      })),
    ];

    setLines(prev => [...prev, ...newEntries]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputValue(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIdx);
        setInputValue(commandHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputValue.trim().toLowerCase();
      if (!current) return;
      const match = AVAILABLE_COMMANDS.find(c => c.startsWith(current));
      if (match) setInputValue(match);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: '#000000',
        color: textColor,
        fontFamily: '"Lucida Console", "Consolas", "Courier New", monospace',
        fontSize: '12px',
        lineHeight: 1.4,
        padding: '12px',
        height: '100%',
        margin: '-8px',
        overflowY: 'auto',
        cursor: 'text',
        userSelect: 'text',
      }}
    >
      {/* Terminal History */}
      {lines.map((line) => (
        <div
          key={line.id}
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color:
              line.type === 'error'
                ? '#ff6b6b'
                : line.type === 'matrix'
                ? '#00ff66'
                : line.type === 'input'
                ? '#ffff88'
                : textColor,
          }}
        >
          {line.text}
        </div>
      ))}

      {/* Active Command Input Line */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
        <span style={{ color: '#ffff88', whiteSpace: 'nowrap', marginRight: '6px' }}>
          C:\Documents and Settings\Rayen&gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: textColor,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            padding: 0,
            caretColor: textColor,
          }}
        />
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
