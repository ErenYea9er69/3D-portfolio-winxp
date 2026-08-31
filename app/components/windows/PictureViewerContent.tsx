'use client';

import { useState, useRef, useEffect } from 'react';
import XPIcon from '../XPIcon';
import { usePortfolioData } from '@/app/lib/usePortfolioData';

interface PictureItem {
  id: string;
  title: string;
  src: string;
  dimensions?: string;
  size?: string;
}

export default function PictureViewerContent() {
  const { pictures: dbPictures, isDbConnected } = usePortfolioData();
  const [gallery, setGallery] = useState<PictureItem[]>(dbPictures);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isBestFit, setIsBestFit] = useState(true);
  const [isSlideshow, setIsSlideshow] = useState(false);

  useEffect(() => {
    if (dbPictures && dbPictures.length > 0) {
      setGallery(dbPictures);
    }
  }, [dbPictures]);

  // Pan offset when zoomed in
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentPicture = gallery[currentIndex] || gallery[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setIsBestFit(false);
    setZoom((prev) => Math.min(4, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setIsBestFit(false);
    setZoom((prev) => Math.max(0.25, Number((prev - 0.25).toFixed(2))));
  };

  const handleActualSize = () => {
    setIsBestFit(false);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleBestFit = () => {
    setIsBestFit(true);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleRotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleDelete = () => {
    if (gallery.length <= 1) return;
    setGallery((prev) => prev.filter((_, i) => i !== currentIndex));
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
  };

  // Slideshow auto-advance
  const toggleSlideshow = () => {
    setIsSlideshow(!isSlideshow);
  };

  // Drag and drop custom picture
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      const newPic: PictureItem = {
        id: `user-${Date.now()}`,
        title: file.name,
        src: url,
        size: `${Math.round(file.size / 1024)} KB`,
      };
      setGallery((prev) => [newPic, ...prev]);
      setCurrentIndex(0);
      setRotation(0);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const newPic: PictureItem = {
        id: `user-${Date.now()}`,
        title: file.name,
        src: url,
        size: `${Math.round(file.size / 1024)} KB`,
      };
      setGallery((prev) => [newPic, ...prev]);
      setCurrentIndex(0);
      setRotation(0);
    }
  };

  // Mouse pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1 || !isBestFit) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#eef2fb',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
        userSelect: 'none',
      }}
    >
      {/* File input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />

      {/* Top Title / Info Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 8px',
        background: '#ece9d8',
        borderBottom: '1px solid #d4d0c8',
        fontSize: '11px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/Windows Picture and Fax Viewer.png" size={16} alt="" />
          <span style={{ fontWeight: 'bold' }}>{currentPicture?.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isDbConnected && (
            <span style={{ fontSize: '9px', color: '#2e7d32' }}>🟢 DB Gallery</span>
          )}
          <div style={{ color: '#555', fontSize: '10px' }}>
            {gallery.length > 0 ? `Image ${currentIndex + 1} of ${gallery.length}` : 'No Images'}
            {currentPicture?.size ? ` • ${currentPicture.size}` : ''}
            {currentPicture?.dimensions ? ` • ${currentPicture.dimensions}` : ''}
          </div>
        </div>
      </div>

      {/* Main Image Viewport Area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          flex: 1,
          position: 'relative',
          background: '#4a607a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: zoom > 1 || !isBestFit ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {currentPicture && (
          <img
            src={currentPicture.src}
            alt={currentPicture.title}
            draggable={false}
            style={{
              maxWidth: isBestFit ? '96%' : 'none',
              maxHeight: isBestFit ? '96%' : 'none',
              width: isBestFit ? 'auto' : undefined,
              height: isBestFit ? 'auto' : undefined,
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Drag and drop hint overlay if empty */}
        {gallery.length === 0 && (
          <div style={{ color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</div>
            <div>Drag and drop photos here to view</div>
          </div>
        )}
      </div>

      {/* Classic Windows XP Picture Viewer Bottom Toolbar */}
      <div style={{
        background: 'linear-gradient(180deg, #f7f6f0 0%, #ece9d8 100%)',
        borderTop: '1px solid #919b9c',
        padding: '4px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        boxShadow: 'inset 0 1px 0 #fff',
      }}>
        {/* Previous */}
        <button
          className="xp-button"
          onClick={handlePrev}
          title="Previous Image (Left Arrow)"
          style={{ minWidth: '32px', padding: '3px 8px' }}
        >
          ◀
        </button>

        {/* Next */}
        <button
          className="xp-button"
          onClick={handleNext}
          title="Next Image (Right Arrow)"
          style={{ minWidth: '32px', padding: '3px 8px' }}
        >
          ▶
        </button>

        <div style={{ width: '1px', height: '20px', background: '#ccc', margin: '0 4px' }} />

        {/* Best Fit */}
        <button
          className="xp-button"
          onClick={handleBestFit}
          title="Best Fit (Resize to fit window)"
          style={{ minWidth: '32px', padding: '3px 6px', fontWeight: isBestFit ? 'bold' : 'normal' }}
        >
          🗖
        </button>

        {/* Actual Size 100% */}
        <button
          className="xp-button"
          onClick={handleActualSize}
          title="Actual Size (100%)"
          style={{ minWidth: '32px', padding: '3px 6px' }}
        >
          1:1
        </button>

        {/* Slideshow */}
        <button
          className="xp-button"
          onClick={toggleSlideshow}
          title="Start Slide Show"
          style={{
            minWidth: '32px',
            padding: '3px 6px',
            background: isSlideshow ? 'linear-gradient(180deg, #ffe7c6 0%, #ffd9a8 100%)' : undefined,
          }}
        >
          🎞️
        </button>

        {/* Zoom In */}
        <button
          className="xp-button"
          onClick={handleZoomIn}
          title="Zoom In"
          style={{ minWidth: '32px', padding: '3px 6px' }}
        >
          🔍+
        </button>

        {/* Zoom Out */}
        <button
          className="xp-button"
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{ minWidth: '32px', padding: '3px 6px' }}
        >
          🔍-
        </button>

        <div style={{ width: '1px', height: '20px', background: '#ccc', margin: '0 4px' }} />

        {/* Rotate Counter Clockwise */}
        <button
          className="xp-button"
          onClick={handleRotateCounterClockwise}
          title="Rotate Counter-Clockwise (90 deg)"
          style={{ minWidth: '32px', padding: '3px 6px' }}
        >
          ↺
        </button>

        {/* Rotate Clockwise */}
        <button
          className="xp-button"
          onClick={handleRotateClockwise}
          title="Rotate Clockwise (90 deg)"
          style={{ minWidth: '32px', padding: '3px 6px' }}
        >
          ↻
        </button>

        <div style={{ width: '1px', height: '20px', background: '#ccc', margin: '0 4px' }} />

        {/* Open Local Image File */}
        <button
          className="xp-button"
          onClick={() => fileInputRef.current?.click()}
          title="Open Picture from your computer"
          style={{ minWidth: '65px', padding: '3px 8px' }}
        >
          📂 Open...
        </button>

        {/* Delete Picture */}
        <button
          className="xp-button"
          onClick={handleDelete}
          title="Delete from viewer"
          style={{ minWidth: '32px', padding: '3px 6px' }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
