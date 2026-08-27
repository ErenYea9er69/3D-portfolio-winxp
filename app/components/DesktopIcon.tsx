'use client';

import { MouseEvent } from 'react';

interface DesktopIconProps {
  icon: string;
  label: string;
  isSelected: boolean;
  onClick: (e: MouseEvent) => void;
  onDoubleClick: () => void;
  onContextMenu?: (e: MouseEvent) => void;
}

export default function DesktopIcon({ 
  icon, 
  label, 
  isSelected, 
  onClick, 
  onDoubleClick,
  onContextMenu,
}: DesktopIconProps) {
  return (
    <div
      className={`xp-desktop-icon ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <div className="xp-desktop-icon-image">{icon}</div>
      <span className="xp-desktop-icon-label">{label}</span>
    </div>
  );
}
