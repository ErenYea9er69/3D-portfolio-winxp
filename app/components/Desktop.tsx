'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import DesktopIcon from './DesktopIcon';
import AboutContent from './windows/AboutContent';
import ProjectsContent from './windows/ProjectsContent';
import SkillsContent from './windows/SkillsContent';
import ContactContent from './windows/ContactContent';
import NotepadContent from './windows/NotepadContent';
import CalculatorContent from './windows/CalculatorContent';
import MinesweeperContent from './windows/MinesweeperContent';
import InternetExplorerContent from './windows/InternetExplorerContent';
import MyComputerContent from './windows/MyComputerContent';
import HelpContent from './windows/HelpContent';
import RunDialogContent from './windows/RunDialogContent';
import RecycleBinContent from './windows/RecycleBinContent';
import SolitaireContent from './windows/SolitaireContent';
import PaintContent from './windows/PaintContent';
import SnakeContent from './windows/SnakeContent';
import ContextMenu, { MenuItem } from './ContextMenu';

interface ShutdownDialogProps {
  onCancel: () => void;
  onShutdown: () => void;
  onRestart: () => void;
  onLogOff: () => void;
}

function ShutdownDialog({ onCancel, onShutdown, onRestart, onLogOff }: ShutdownDialogProps) {
  const [selected, setSelected] = useState<'shutdown' | 'restart' | 'standby'>('shutdown');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(180deg, #1b4882 0%, #0f2e52 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #4b89ca 0%, #3674b8 30%, #2a5f9e 100%)',
        borderRadius: '20px',
        padding: '30px 40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        maxWidth: '400px',
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏻</div>
        <h2 style={{ color: 'white', margin: '0 0 20px', fontSize: '16px', fontWeight: 'normal' }}>
          What do you want the computer to do?
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px' }}>
          {[
            { id: 'standby', icon: '😴', label: 'Stand By' },
            { id: 'shutdown', icon: '⏻', label: 'Turn Off' },
            { id: 'restart', icon: '🔄', label: 'Restart' },
          ].map((option) => (
            <div
              key={option.id}
              onClick={() => setSelected(option.id as typeof selected)}
              style={{
                cursor: 'pointer',
                padding: '10px 15px',
                borderRadius: '8px',
                background: selected === option.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '5px',
                filter: option.id === 'shutdown' ? 'hue-rotate(0deg) saturate(1.5)' : 'none',
                color: option.id === 'shutdown' ? '#ff6b6b' : 'white',
              }}>
                {option.icon}
              </div>
              <div style={{ color: 'white', fontSize: '11px' }}>{option.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            className="xp-button"
            onClick={() => {
              if (selected === 'shutdown') onShutdown();
              else if (selected === 'restart') onRestart();
              else onLogOff();
            }}
            style={{ minWidth: '80px' }}
          >
            OK
          </button>
          <button className="xp-button" onClick={onCancel} style={{ minWidth: '80px' }}>
            Cancel
          </button>
          <button className="xp-button" onClick={onLogOff} style={{ minWidth: '80px' }}>
            Log Off
          </button>
        </div>
      </div>
    </div>
  );
}

function ShutdownScreen({ message }: { message: string }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
    }}>
      <div style={{ color: '#ff6600', fontSize: '18px', marginBottom: '10px' }}>
        {message}
      </div>
      <div style={{ color: '#888', fontSize: '12px' }}>
        {message === 'Windows is shutting down...' ? 'Please wait...' : 'Refreshing...'}
      </div>
    </div>
  );
}

interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const initialWindows: WindowState[] = [
  {
    id: 'mycomputer',
    title: 'My Computer',
    icon: '💻',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 100, y: 50 },
    size: { width: 420, height: 450 },
  },
  {
    id: 'about',
    title: 'About Me',
    icon: '👤',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 80, y: 40 },
    size: { width: 440, height: 420 },
  },
  {
    id: 'projects',
    title: 'My Projects',
    icon: '📁',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 140, y: 70 },
    size: { width: 500, height: 450 },
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: '📊',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 200, y: 50 },
    size: { width: 460, height: 500 },
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: '📧',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 160, y: 90 },
    size: { width: 400, height: 500 },
  },
  {
    id: 'notepad',
    title: 'Untitled - Notepad',
    icon: '📝',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 120, y: 60 },
    size: { width: 450, height: 350 },
  },
  {
    id: 'calculator',
    title: 'Calculator',
    icon: '🔢',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 300, y: 100 },
    size: { width: 280, height: 320 },
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: '💣',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 250, y: 80 },
    size: { width: 200, height: 310 },
  },
  {
    id: 'iexplorer',
    title: 'Internet Explorer',
    icon: '🌐',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 100, y: 30 },
    size: { width: 700, height: 500 },
  },
  {
    id: 'help',
    title: 'Help and Support Center',
    icon: '❓',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 150, y: 60 },
    size: { width: 450, height: 450 },
  },
  {
    id: 'run',
    title: 'Run',
    icon: '▶️',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 200, y: 150 },
    size: { width: 380, height: 200 },
  },
  {
    id: 'recycle',
    title: 'Recycle Bin',
    icon: '🗑️',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 180, y: 80 },
    size: { width: 400, height: 350 },
  },
  {
    id: 'solitaire',
    title: 'Solitaire',
    icon: '🃏',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 120, y: 40 },
    size: { width: 520, height: 480 },
  },
  {
    id: 'paint',
    title: 'Paint',
    icon: '🎨',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 80, y: 30 },
    size: { width: 550, height: 450 },
  },
  {
    id: 'snake',
    title: 'Snake',
    icon: '🐍',
    isOpen: false,
    isMinimized: false,
    zIndex: 1,
    position: { x: 200, y: 60 },
    size: { width: 360, height: 420 },
  },
];

const desktopIcons = [
  { id: 'mycomputer', icon: '💻', label: 'My Computer' },
  { id: 'about', icon: '👤', label: 'About Me' },
  { id: 'projects', icon: '📁', label: 'My Projects' },
  { id: 'skills', icon: '📊', label: 'Skills' },
  { id: 'contact', icon: '📧', label: 'Contact' },
  { id: 'iexplorer', icon: '🌐', label: 'Internet Explorer' },
  { id: 'notepad', icon: '📝', label: 'Notepad' },
  { id: 'calculator', icon: '🔢', label: 'Calculator' },
  { id: 'minesweeper', icon: '💣', label: 'Minesweeper' },
  { id: 'solitaire', icon: '🃏', label: 'Solitaire' },
  { id: 'paint', icon: '🎨', label: 'Paint' },
  { id: 'snake', icon: '🐍', label: 'Snake' },
  { id: 'help', icon: '❓', label: 'Help' },
  { id: 'recycle', icon: '🗑️', label: 'Recycle Bin' },
];

const menuItems = [
  { id: 'iexplorer', title: 'Internet Explorer', icon: '🌐' },
  { id: 'mycomputer', title: 'My Computer', icon: '💻' },
  { id: 'about', title: 'About Me', icon: '👤' },
  { id: 'projects', title: 'My Projects', icon: '📁' },
  { id: 'skills', title: 'Skills', icon: '📊' },
  { id: 'contact', title: 'Contact', icon: '📧' },
  // Apps below the divider
  { id: 'notepad', title: 'Notepad', icon: '📝' },
  { id: 'calculator', title: 'Calculator', icon: '🔢' },
  { id: 'minesweeper', title: 'Minesweeper', icon: '💣' },
];

// Grid geometry used for the free-drag / align-to-grid math.
// Matches the CSS grid used when Auto Arrange is on: 75px cells + 4px gap,
// starting at (10, 10) from the desktop's top-left corner.
const GRID_CELL_W = 79;
const GRID_CELL_H = 84;
const GRID_ORIGIN = { x: 10, y: 10 };

function snapToGrid(x: number, y: number) {
  const col = Math.round((x - GRID_ORIGIN.x) / GRID_CELL_W);
  const row = Math.round((y - GRID_ORIGIN.y) / GRID_CELL_H);
  return {
    x: GRID_ORIGIN.x + Math.max(0, col) * GRID_CELL_W,
    y: GRID_ORIGIN.y + Math.max(0, row) * GRID_CELL_H,
  };
}

interface DesktopProps {
  onLogOff: () => void;
}

export default function Desktop({ onLogOff }: DesktopProps) {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [highestZIndex, setHighestZIndex] = useState(1);
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);
  const [shutdownState, setShutdownState] = useState<'none' | 'shuttingdown' | 'restarting'>('none');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: 'desktop' | 'icon'; iconId?: string } | null>(null);

  // Icon arrangement state
  const [autoArrange, setAutoArrange] = useState(true);
  const [alignToGrid, setAlignToGrid] = useState(true);
  const [freePositions, setFreePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Rubber-band selection
  const [marquee, setMarquee] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const marqueeStart = useRef<{ x: number; y: number } | null>(null);
  const desktopAreaRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Restore-all state for the Show Desktop toggle
  const preShowDesktopMinimized = useRef<Set<string>>(new Set());
  const [isShowingDesktop, setIsShowingDesktop] = useState(false);

  const handleShutdown = useCallback(() => {
    setShowShutdownDialog(false);
    setShutdownState('shuttingdown');
    setTimeout(() => {
      sessionStorage.removeItem('xp-booted');
      window.location.reload();
    }, 2000);
  }, []);

  const handleRestart = useCallback(() => {
    setShowShutdownDialog(false);
    setShutdownState('restarting');
    setTimeout(() => {
      sessionStorage.removeItem('xp-booted');
      window.location.reload();
    }, 2000);
  }, []);

  const handleLogOffAction = useCallback(() => {
    setShowShutdownDialog(false);
    onLogOff();
  }, [onLogOff]);

  const openWindow = useCallback((id: string) => {
    setHighestZIndex(prev => prev + 1);
    setWindows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, isOpen: true, isMinimized: false, zIndex: highestZIndex + 1 }
        : w
    ));
    setActiveWindowId(id);
    setIsStartMenuOpen(false);
  }, [highestZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isOpen: false } : w
    ));
    if (activeWindowId === id) {
      const openWindows = windows.filter(w => w.isOpen && w.id !== id && !w.isMinimized);
      setActiveWindowId(openWindows.length > 0 
        ? openWindows.reduce((a, b) => a.zIndex > b.zIndex ? a : b).id 
        : null
      );
    }
  }, [activeWindowId, windows]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    if (activeWindowId === id) {
      const openWindows = windows.filter(w => w.isOpen && w.id !== id && !w.isMinimized);
      setActiveWindowId(openWindows.length > 0 
        ? openWindows.reduce((a, b) => a.zIndex > b.zIndex ? a : b).id 
        : null
      );
    }
  }, [activeWindowId, windows]);

  const focusWindow = useCallback((id: string) => {
    setHighestZIndex(prev => prev + 1);
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w
    ));
    setActiveWindowId(id);
  }, [highestZIndex]);

  const restoreWindow = useCallback((id: string) => {
    setHighestZIndex(prev => prev + 1);
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 } : w
    ));
    setActiveWindowId(id);
  }, [highestZIndex]);

  const handleTaskbarWindowClick = useCallback((id: string) => {
    const window = windows.find(w => w.id === id);
    if (!window) return;

    if (window.isMinimized) {
      restoreWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }, [windows, activeWindowId, restoreWindow, minimizeWindow, focusWindow]);

  const handleWindowAction = useCallback((id: string, action: 'restore' | 'minimize' | 'close') => {
    if (action === 'restore') restoreWindow(id);
    else if (action === 'minimize') minimizeWindow(id);
    else closeWindow(id);
  }, [restoreWindow, minimizeWindow, closeWindow]);

  const handleShowDesktop = useCallback(() => {
    if (isShowingDesktop) {
      // Restore whichever windows we minimized
      setWindows(prev => prev.map(w =>
        preShowDesktopMinimized.current.has(w.id) ? { ...w, isMinimized: false } : w
      ));
      setIsShowingDesktop(false);
    } else {
      const toMinimize = windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.id);
      preShowDesktopMinimized.current = new Set(toMinimize);
      setWindows(prev => prev.map(w =>
        toMinimize.includes(w.id) ? { ...w, isMinimized: true } : w
      ));
      setIsShowingDesktop(true);
    }
  }, [isShowingDesktop, windows]);

  const handleDesktopClick = () => {
    setSelectedIcons(new Set());
    setIsStartMenuOpen(false);
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, type: 'desktop' | 'icon', iconId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, type, iconId });
    setIsStartMenuOpen(false);
  };

  // ---- Icon selection helpers ----
  const selectOnly = (id: string) => setSelectedIcons(new Set([id]));
  const toggleSelect = (id: string) => {
    setSelectedIcons(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ---- Rubber-band marquee selection ----
  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    // Only start marquee on a plain left-click on empty desktop space
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.xp-desktop-icon')) return;

    const rect = desktopAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    marqueeStart.current = { x, y };
    setMarquee({ x0: x, y0: y, x1: x, y1: y });
  };

  useEffect(() => {
    if (!marquee) return;

    const handleMove = (e: MouseEvent) => {
      const rect = desktopAreaRef.current?.getBoundingClientRect();
      if (!rect || !marqueeStart.current) return;
      const x1 = e.clientX - rect.left;
      const y1 = e.clientY - rect.top;
      const box = {
        x0: marqueeStart.current.x,
        y0: marqueeStart.current.y,
        x1,
        y1,
      };
      setMarquee(box);

      const left = Math.min(box.x0, box.x1);
      const right = Math.max(box.x0, box.x1);
      const top = Math.min(box.y0, box.y1);
      const bottom = Math.max(box.y0, box.y1);

      const next = new Set<string>();
      Object.entries(iconRefs.current).forEach(([id, el]) => {
        if (!el || !desktopAreaRef.current) return;
        const desktopRect = desktopAreaRef.current.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const iconLeft = r.left - desktopRect.left;
        const iconTop = r.top - desktopRect.top;
        const iconRight = iconLeft + r.width;
        const iconBottom = iconTop + r.height;
        const intersects = iconLeft < right && iconRight > left && iconTop < bottom && iconBottom > top;
        if (intersects) next.add(id);
      });
      setSelectedIcons(next);
    };

    const handleUp = () => {
      setMarquee(null);
      marqueeStart.current = null;
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [marquee]);

  // ---- Free-drag icon dragging ----
  const beginIconDrag = (id: string) => (e: React.MouseEvent) => {
    if (autoArrange) return; // icons are locked in the grid
    if (e.button !== 0) return;
    e.stopPropagation();

    if (!selectedIcons.has(id)) selectOnly(id);

    const el = iconRefs.current[id];
    const rect = el?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDraggingIcon(id);
  };

  useEffect(() => {
    if (!draggingIcon) return;

    const handleMove = (e: MouseEvent) => {
      const desktopRect = desktopAreaRef.current?.getBoundingClientRect();
      if (!desktopRect) return;
      const x = e.clientX - desktopRect.left - dragOffset.current.x;
      const y = e.clientY - desktopRect.top - dragOffset.current.y;
      setFreePositions(prev => ({ ...prev, [draggingIcon]: { x: Math.max(0, x), y: Math.max(0, y) } }));
    };

    const handleUp = () => {
      setFreePositions(prev => {
        const pos = prev[draggingIcon];
        if (!pos || !alignToGrid) return prev;
        return { ...prev, [draggingIcon]: snapToGrid(pos.x, pos.y) };
      });
      setDraggingIcon(null);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [draggingIcon, alignToGrid]);

  // Capture current on-screen positions when Auto Arrange is switched off,
  // so icons don't jump when they become freely draggable.
  const disableAutoArrange = () => {
    const captured: Record<string, { x: number; y: number }> = {};
    desktopIcons.forEach(({ id }) => {
      const el = iconRefs.current[id];
      const desktopRect = desktopAreaRef.current?.getBoundingClientRect();
      if (!el || !desktopRect) return;
      const r = el.getBoundingClientRect();
      captured[id] = { x: r.left - desktopRect.left, y: r.top - desktopRect.top };
    });
    setFreePositions(prev => ({ ...prev, ...captured }));
    setAutoArrange(false);
  };

  const sortIconsByName = () => {
    const sorted = [...desktopIcons].sort((a, b) => a.label.localeCompare(b.label));
    const positions: Record<string, { x: number; y: number }> = {};
    const rowsPerColumn = 8;
    sorted.forEach((icon, i) => {
      const col = Math.floor(i / rowsPerColumn);
      const row = i % rowsPerColumn;
      positions[icon.id] = {
        x: GRID_ORIGIN.x + col * GRID_CELL_W,
        y: GRID_ORIGIN.y + row * GRID_CELL_H,
      };
    });
    setFreePositions(positions);
    setAutoArrange(false);
  };

  const getDesktopContextMenuItems = (): MenuItem[] => [
    {
      label: 'View',
      icon: '👁️',
      submenu: [
        { label: 'Large Icons', checked: true },
        { label: 'Tiles', disabled: true },
        { label: 'Icons', disabled: true },
        { label: 'List', disabled: true },
        { divider: true },
        { label: 'Arrange Icons Automatically', checked: autoArrange, onClick: () => setAutoArrange(true) },
      ],
    },
    {
      label: 'Arrange Icons By',
      icon: '📊',
      submenu: [
        { label: 'Name', onClick: sortIconsByName },
        { label: 'Type', disabled: true },
        { label: 'Size', disabled: true },
        { divider: true },
        {
          label: 'Auto Arrange',
          checked: autoArrange,
          onClick: () => (autoArrange ? disableAutoArrange() : setAutoArrange(true)),
        },
        {
          label: 'Align to Grid',
          checked: alignToGrid,
          onClick: () => setAlignToGrid(v => !v),
        },
      ],
    },
    { label: 'Refresh', icon: '🔄', onClick: () => window.location.reload() },
    { divider: true },
    { label: 'Paste', icon: '📋', disabled: true },
    { label: 'Paste Shortcut', disabled: true },
    { divider: true },
    {
      label: 'New',
      icon: '📄',
      submenu: [
        { label: 'Folder', disabled: true },
        { label: 'Shortcut', disabled: true },
        { label: 'Text Document', disabled: true },
      ],
    },
    { divider: true },
    { label: 'Properties', icon: '⚙️', onClick: () => openWindow('mycomputer') },
  ];

  const getIconContextMenuItems = (iconId: string): MenuItem[] => [
    { label: 'Open', icon: '📂', onClick: () => openWindow(iconId) },
    { divider: true },
    { label: 'Cut', icon: '✂️', disabled: true },
    { label: 'Copy', icon: '📋', disabled: true },
    { divider: true },
    { label: 'Create Shortcut', disabled: true },
    { label: 'Delete', icon: '🗑️', disabled: true },
    { label: 'Rename', disabled: true },
    { divider: true },
    { label: 'Properties', icon: '⚙️', onClick: () => openWindow(iconId) },
  ];

  const handleRunCommand = useCallback((appId: string) => {
    if (appId) {
      openWindow(appId);
    }
    closeWindow('run');
  }, [openWindow, closeWindow]);

  const renderWindowContent = (id: string) => {
    switch (id) {
      case 'mycomputer':
        return <MyComputerContent />;
      case 'about':
        return <AboutContent />;
      case 'projects':
        return <ProjectsContent />;
      case 'skills':
        return <SkillsContent />;
      case 'contact':
        return <ContactContent />;
      case 'notepad':
        return <NotepadContent />;
      case 'calculator':
        return <CalculatorContent />;
      case 'minesweeper':
        return <MinesweeperContent />;
      case 'iexplorer':
        return <InternetExplorerContent />;
      case 'help':
        return <HelpContent />;
      case 'run':
        return <RunDialogContent onOpenApp={handleRunCommand} />;
      case 'recycle':
        return <RecycleBinContent />;
      case 'solitaire':
        return <SolitaireContent />;
      case 'paint':
        return <PaintContent />;
      case 'snake':
        return <SnakeContent />;
      default:
        return null;
    }
  };

  const openWindows = windows.filter(w => w.isOpen);

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Desktop Area - Windows XP Bliss Wallpaper */}
      <div 
        ref={desktopAreaRef}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'url(/windows_xp_original-wallpaper-1920x1080.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        onClick={handleDesktopClick}
        onMouseDown={handleDesktopMouseDown}
        onContextMenu={(e) => handleContextMenu(e, 'desktop')}
      >
        {/* Desktop Icons */}
        {autoArrange ? (
          <div 
            className="xp-desktop-icons"
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              bottom: '10px',
              display: 'grid',
              gridTemplateRows: 'repeat(auto-fill, 80px)',
              gridAutoFlow: 'column',
              gridAutoColumns: '75px',
              gap: '4px',
              alignContent: 'start',
            }}
          >
            {desktopIcons.map(iconData => (
              <div key={iconData.id} ref={(el) => { iconRefs.current[iconData.id] = el; }}>
                <DesktopIcon
                  icon={iconData.icon}
                  label={iconData.label}
                  isSelected={selectedIcons.has(iconData.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (e.ctrlKey || e.metaKey) toggleSelect(iconData.id);
                    else selectOnly(iconData.id);
                    setContextMenu(null);
                  }}
                  onDoubleClick={() => openWindow(iconData.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!selectedIcons.has(iconData.id)) selectOnly(iconData.id);
                    handleContextMenu(e, 'icon', iconData.id);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          desktopIcons.map(iconData => {
            const pos = freePositions[iconData.id] || GRID_ORIGIN;
            return (
              <div
                key={iconData.id}
                ref={(el) => { iconRefs.current[iconData.id] = el; }}
                style={{ position: 'absolute', left: pos.x, top: pos.y }}
              >
                <DesktopIcon
                  icon={iconData.icon}
                  label={iconData.label}
                  isSelected={selectedIcons.has(iconData.id)}
                  onMouseDown={beginIconDrag(iconData.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (e.ctrlKey || e.metaKey) toggleSelect(iconData.id);
                    else selectOnly(iconData.id);
                    setContextMenu(null);
                  }}
                  onDoubleClick={() => openWindow(iconData.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!selectedIcons.has(iconData.id)) selectOnly(iconData.id);
                    handleContextMenu(e, 'icon', iconData.id);
                  }}
                />
              </div>
            );
          })
        )}

        {/* Rubber-band selection box */}
        {marquee && (
          <div
            style={{
              position: 'absolute',
              left: Math.min(marquee.x0, marquee.x1),
              top: Math.min(marquee.y0, marquee.y1),
              width: Math.abs(marquee.x1 - marquee.x0),
              height: Math.abs(marquee.y1 - marquee.y0),
              background: 'rgba(49, 106, 197, 0.25)',
              border: '1px solid rgba(49, 106, 197, 0.9)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        )}



        {/* Windows */}
        {openWindows.map(window => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            isActive={activeWindowId === window.id}
            isMinimized={window.isMinimized}
            initialPosition={window.position}
            initialSize={window.size}
            zIndex={window.zIndex}
            onFocus={() => focusWindow(window.id)}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
          >
            {renderWindowContent(window.id)}
          </Window>
        ))}

        {/* Start Menu */}
        <StartMenu
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
          onItemClick={openWindow}
          onLogOff={handleLogOffAction}
          onShutdown={() => setShowShutdownDialog(true)}
          menuItems={menuItems}
        />

        {/* Shutdown Dialog */}
        {showShutdownDialog && (
          <ShutdownDialog
            onCancel={() => setShowShutdownDialog(false)}
            onShutdown={handleShutdown}
            onRestart={handleRestart}
            onLogOff={handleLogOffAction}
          />
        )}

        {/* Shutdown/Restart Screen */}
        {shutdownState === 'shuttingdown' && (
          <ShutdownScreen message="Windows is shutting down..." />
        )}
        {shutdownState === 'restarting' && (
          <ShutdownScreen message="Windows is restarting..." />
        )}

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={contextMenu.type === 'desktop' 
              ? getDesktopContextMenuItems() 
              : getIconContextMenuItems(contextMenu.iconId || '')}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>

      {/* Taskbar */}
      <Taskbar
        windows={openWindows.map(w => ({
          id: w.id,
          title: w.title,
          icon: w.icon,
          isMinimized: w.isMinimized,
        }))}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarWindowClick}
        onWindowAction={handleWindowAction}
        onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        isStartMenuOpen={isStartMenuOpen}
        onShowDesktop={handleShowDesktop}
      />
    </div>
  );
}
