'use client';

import { useEffect, useRef } from 'react';

export interface MenuItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (!menuRef.current) return;
    
    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    
    if (rect.right > window.innerWidth) {
      menu.style.left = `${x - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight - 30) { // Account for taskbar
      menu.style.top = `${y - rect.height}px`;
    }
  }, [x, y]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="xp-context-menu"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 99999,
        minWidth: '180px',
        background: 'white',
        border: '1px solid #808080',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
        padding: '2px 0',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
      }}
    >
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={index}
              style={{
                height: '1px',
                background: '#c0c0c0',
                margin: '3px 2px',
              }}
            />
          );
        }

        return (
          <div
            key={index}
            onClick={() => {
              if (!item.disabled && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
            style={{
              padding: '4px 25px 4px 28px',
              cursor: item.disabled ? 'default' : 'pointer',
              color: item.disabled ? '#808080' : '#000',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
            }}
            onMouseOver={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.background = '#316ac5';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = item.disabled ? '#808080' : '#000';
            }}
          >
            {item.icon && (
              <span style={{ 
                position: 'absolute', 
                left: '6px',
                fontSize: '12px',
              }}>
                {item.icon}
              </span>
            )}
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
