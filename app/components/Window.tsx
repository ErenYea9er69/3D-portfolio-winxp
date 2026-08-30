'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  isActive: boolean;
  isMinimized: boolean;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_CURSORS: Record<ResizeDir, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
};

const MIN_WIDTH = 220;
const MIN_HEIGHT = 140;

export default function Window({
  id,
  title,
  icon,
  children,
  isActive,
  isMinimized,
  initialPosition,
  initialSize,
  zIndex,
  onFocus,
  onClose,
  onMinimize,
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [restoreState, setRestoreState] = useState({ position: initialPosition, size: initialSize });
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState<ResizeDir | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const taskbarHeight = 30;

  // Constrain position within viewport bounds
  const constrainPosition = useCallback((x: number, y: number, currentSize: { width: number; height: number }) => {
    const titleBarHeight = 28;
    const minVisibleWidth = 100;
    const minVisibleHeight = titleBarHeight;
    
    const maxX = window.innerWidth - minVisibleWidth;
    const maxY = window.innerHeight - taskbarHeight - minVisibleHeight;
    const minX = -(currentSize.width - minVisibleWidth);
    const minY = 0;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  }, []);

  // Ensure window is within bounds on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (isMaximized) {
        setPosition({ x: 0, y: 0 });
        setSize({ width: window.innerWidth, height: window.innerHeight - taskbarHeight });
      } else {
        setPosition(prev => constrainPosition(prev.x, prev.y, size));
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial constraint check
    if (!isMaximized) {
      setPosition(prev => constrainPosition(prev.x, prev.y, size));
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [constrainPosition, isMaximized, size]);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 120);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.xp-window-controls')) return;
    if (isMaximized) return; // Don't allow dragging when maximized
    
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    onFocus();
    e.preventDefault();
  }, [position, onFocus, isMaximized]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.xp-window-controls')) return;
    if (isMaximized) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
    onFocus();
  }, [position, onFocus, isMaximized]);

  const handleResizeStart = useCallback((dir: ResizeDir) => (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    setResizeDir(dir);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      left: position.x,
      top: position.y,
    };
  }, [isMaximized, onFocus, size, position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;
        const constrained = constrainPosition(newX, newY, size);
        setPosition(constrained);
        return;
      }

      if (resizeDir) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        let { width, height, left, top } = resizeStart.current;

        if (resizeDir.includes('e')) {
          width = Math.max(MIN_WIDTH, resizeStart.current.width + dx);
        }
        if (resizeDir.includes('s')) {
          height = Math.max(MIN_HEIGHT, resizeStart.current.height + dy);
        }
        if (resizeDir.includes('w')) {
          const proposedWidth = resizeStart.current.width - dx;
          width = Math.max(MIN_WIDTH, proposedWidth);
          left = resizeStart.current.left + (resizeStart.current.width - width);
        }
        if (resizeDir.includes('n')) {
          const proposedHeight = resizeStart.current.height - dy;
          height = Math.max(MIN_HEIGHT, proposedHeight);
          top = resizeStart.current.top + (resizeStart.current.height - height);
        }

        // Keep top from going above the visible area
        top = Math.max(0, top);

        setSize({ width, height });
        setPosition({ x: left, y: top });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.current.x;
      const newY = touch.clientY - dragStart.current.y;
      const constrained = constrainPosition(newX, newY, size);
      
      setPosition(constrained);
      e.preventDefault();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setResizeDir(null);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging || resizeDir) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, resizeDir, constrainPosition, size]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 80);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      // Restore to previous size and position
      setPosition(restoreState.position);
      setSize(restoreState.size);
      setIsMaximized(false);
    } else {
      // Save current state and maximize
      setRestoreState({ position, size });
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight - taskbarHeight });
      setIsMaximized(true);
    }
    onFocus();
  };

  const handleTitleBarDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.xp-window-controls')) return;
    handleMaximize();
  };

  if (isMinimized) return null;

  const edgeThickness = 5;
  const cornerSize = 9;

  const resizeHandles: { dir: ResizeDir; style: React.CSSProperties }[] = [
    { dir: 'n', style: { top: -edgeThickness / 2, left: cornerSize, right: cornerSize, height: edgeThickness } },
    { dir: 's', style: { bottom: -edgeThickness / 2, left: cornerSize, right: cornerSize, height: edgeThickness } },
    { dir: 'e', style: { right: -edgeThickness / 2, top: cornerSize, bottom: cornerSize, width: edgeThickness } },
    { dir: 'w', style: { left: -edgeThickness / 2, top: cornerSize, bottom: cornerSize, width: edgeThickness } },
    { dir: 'ne', style: { top: -cornerSize / 2, right: -cornerSize / 2, width: cornerSize, height: cornerSize } },
    { dir: 'nw', style: { top: -cornerSize / 2, left: -cornerSize / 2, width: cornerSize, height: cornerSize } },
    { dir: 'se', style: { bottom: -cornerSize / 2, right: -cornerSize / 2, width: cornerSize, height: cornerSize } },
    { dir: 'sw', style: { bottom: -cornerSize / 2, left: -cornerSize / 2, width: cornerSize, height: cornerSize } },
  ];

  return (
    <div
      ref={windowRef}
      className={`xp-window ${isOpening ? 'window-opening' : ''} ${isClosing ? 'window-closing' : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        cursor: isDragging ? 'grabbing' : 'default',
        touchAction: 'none',
        borderRadius: isMaximized ? 0 : undefined,
        transition: isMaximized || restoreState ? 'none' : undefined,
      }}
      onMouseDown={onFocus}
    >
      <div 
        className={`xp-window-title ${isActive ? '' : 'inactive'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleTitleBarDoubleClick}
        style={{ 
          cursor: isMaximized ? 'default' : (isDragging ? 'grabbing' : 'grab'),
          borderRadius: isMaximized ? 0 : undefined,
        }}
      >
        <div className="xp-window-title-icon">{icon}</div>
        <span className="xp-window-title-text">{title}</span>
        <div className="xp-window-controls">
          <button 
            className="xp-window-btn xp-window-btn-minimize"
            onClick={onMinimize}
            title="Minimize"
          >
            <svg width="9" height="9" viewBox="0 0 9 9">
              <rect x="1" y="7" width="7" height="2" fill="white"/>
            </svg>
          </button>
          <button 
            className="xp-window-btn xp-window-btn-maximize"
            onClick={handleMaximize}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              // Restore icon (two overlapping squares)
              <svg width="9" height="9" viewBox="0 0 9 9">
                <rect x="2" y="0" width="6" height="6" fill="none" stroke="white" strokeWidth="1.2"/>
                <rect x="0" y="2" width="6" height="6" fill="black" stroke="white" strokeWidth="1.2"/>
              </svg>
            ) : (
              // Maximize icon (single square)
              <svg width="9" height="9" viewBox="0 0 9 9">
                <rect x="1" y="1" width="7" height="7" fill="none" stroke="white" strokeWidth="1.5"/>
              </svg>
            )}
          </button>
          <button 
            className="xp-window-btn xp-window-btn-close"
            onClick={handleClose}
            title="Close"
          >
            <svg width="9" height="9" viewBox="0 0 9 9">
              <path d="M1 1L8 8M8 1L1 8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="xp-window-content">
        {children}
      </div>

      {!isMaximized && resizeHandles.map(({ dir, style }) => (
        <div
          key={dir}
          onMouseDown={handleResizeStart(dir)}
          style={{
            position: 'absolute',
            zIndex: 5,
            cursor: RESIZE_CURSORS[dir],
            ...style,
          }}
        />
      ))}
    </div>
  );
}
