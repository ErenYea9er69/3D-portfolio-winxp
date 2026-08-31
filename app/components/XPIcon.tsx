'use client';

import React from 'react';

interface XPIconProps {
  src?: string;
  size?: number | string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function XPIcon({ 
  src, 
  size = 16, 
  alt = '', 
  className = '', 
  style 
}: XPIconProps) {
  if (!src) return null;

  const isImagePath = 
    src.startsWith('/') || 
    src.startsWith('http') || 
    src.endsWith('.png') || 
    src.endsWith('.svg') || 
    src.endsWith('.ico') || 
    src.endsWith('.jpg') || 
    src.endsWith('.webp');

  const sizePx = typeof size === 'number' ? `${size}px` : size;

  if (isImagePath) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={false}
        style={{
          width: sizePx,
          height: sizePx,
          objectFit: 'contain',
          display: 'inline-block',
          verticalAlign: 'middle',
          flexShrink: 0,
          userSelect: 'none',
          pointerEvents: 'none',
          ...style,
        }}
      />
    );
  }

  return (
    <span
      className={className}
      style={{
        fontSize: sizePx,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        userSelect: 'none',
        ...style,
      }}
    >
      {src}
    </span>
  );
}
