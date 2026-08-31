'use client';

import { useEffect, useRef, useState } from 'react';
import XPIcon from './XPIcon';

export interface MenuItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  divider?: boolean;
  disabled?: boolean;
  checked?: boolean;
  submenu?: MenuItem[];
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

function MenuList({
  items,
  onClose,
}: {
  items: MenuItem[];
  onClose: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openLeft, setOpenLeft] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={listRef}
      className="xp-context-menu"
      style={{
        minWidth: '190px',
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

        const hasSubmenu = !!item.submenu && item.submenu.length > 0;

        return (
          <div
            key={index}
            style={{ position: 'relative' }}
            onMouseEnter={(e) => {
              if (item.disabled) return;
              setOpenIndex(index);
              if (hasSubmenu) {
                const rect = e.currentTarget.getBoundingClientRect();
                setOpenLeft(rect.right + 190 > window.innerWidth);
              }
            }}
          >
            <div
              onClick={() => {
                if (item.disabled) return;
                if (hasSubmenu) return;
                if (item.onClick) item.onClick();
                onClose();
              }}
              style={{
                padding: '4px 22px 4px 28px',
                cursor: item.disabled ? 'default' : 'pointer',
                color: item.disabled ? '#808080' : '#000',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
                background: openIndex === index && !item.disabled ? '#316ac5' : 'transparent',
              }}
              onMouseOver={(e) => {
                if (!item.disabled) {
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = item.disabled ? '#808080' : '#000';
              }}
            >
              {item.checked && (
                <span style={{ position: 'absolute', left: '6px', fontSize: '11px' }}>✓</span>
              )}
              {item.icon && !item.checked && (
                <span style={{ position: 'absolute', left: '6px', display: 'flex', alignItems: 'center' }}>
                  <XPIcon src={item.icon} size={15} />
                </span>
              )}
              <span style={{ flex: 1 }}>{item.label}</span>
              {hasSubmenu && (
                <span style={{ fontSize: '9px', marginLeft: '6px' }}>▶</span>
              )}
            </div>

            {hasSubmenu && openIndex === index && (
              <div
                style={{
                  position: 'absolute',
                  top: '-3px',
                  left: openLeft ? 'auto' : '100%',
                  right: openLeft ? '100%' : 'auto',
                  zIndex: 1,
                }}
              >
                <MenuList items={item.submenu!} onClose={onClose} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (!wrapperRef.current) return;

    const menu = wrapperRef.current;
    const rect = menu.getBoundingClientRect();

    if (rect.right > window.innerWidth) {
      menu.style.left = `${Math.max(0, x - rect.width)}px`;
    }
    if (rect.bottom > window.innerHeight - 30) {
      menu.style.top = `${Math.max(0, y - rect.height)}px`;
    }
  }, [x, y]);

  // Close on click outside / Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
      ref={wrapperRef}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 99999,
      }}
    >
      <MenuList items={items} onClose={onClose} />
    </div>
  );
}
