'use client';

import { useState } from 'react';

export interface WallpaperOption {
  id: string;
  label: string;
  css: string;
  swatch: string;
}

interface DisplayPropertiesContentProps {
  wallpapers: WallpaperOption[];
  currentWallpaper: string;
  onApply: (id: string) => void;
}

const TABS = ['Themes', 'Desktop', 'Screen Saver', 'Appearance', 'Settings'];

export default function DisplayPropertiesContent({ wallpapers, currentWallpaper, onApply }: DisplayPropertiesContentProps) {
  const [tab, setTab] = useState('Desktop');
  const [pending, setPending] = useState(currentWallpaper);

  const pendingWallpaper = wallpapers.find(w => w.id === pending) ?? wallpapers[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: '-8px', background: '#ece9d8' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', padding: '6px 6px 0', gap: '2px', borderBottom: '1px solid #aca899' }}>
        {TABS.map(t => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              cursor: 'pointer',
              background: tab === t ? '#ece9d8' : '#c9c4b4',
              border: '1px solid #aca899',
              borderBottom: tab === t ? '1px solid #ece9d8' : '1px solid #aca899',
              borderRadius: '3px 3px 0 0',
              position: 'relative',
              top: '1px',
              fontWeight: tab === t ? 'bold' : 'normal',
            }}
          >
            {t}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '14px', overflowY: 'auto' }}>
        {tab === 'Desktop' ? (
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Monitor preview */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '160px', height: '120px',
                background: '#333',
                borderRadius: '6px 6px 2px 2px',
                padding: '8px',
              }}>
                <div style={{
                  width: '100%', height: '100%',
                  background: pendingWallpaper.css,
                  border: '2px solid #111',
                  borderRadius: '2px',
                }} />
              </div>
              <div style={{ width: '40px', height: '10px', background: '#555', margin: '0 auto' }} />
              <div style={{ width: '70px', height: '6px', background: '#444', margin: '0 auto', borderRadius: '2px' }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', marginBottom: '6px' }}>Background:</div>
              <div style={{
                background: '#fff',
                border: '1px inset #808080',
                height: '160px',
                overflowY: 'auto',
                padding: '4px',
              }}>
                {wallpapers.map(w => (
                  <div
                    key={w.id}
                    onClick={() => setPending(w.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '3px 4px',
                      cursor: 'pointer',
                      background: pending === w.id ? '#316ac5' : 'transparent',
                      color: pending === w.id ? '#fff' : '#000',
                    }}
                  >
                    <div style={{ width: '28px', height: '20px', background: w.swatch, border: '1px solid #888' }} />
                    <span style={{ fontSize: '11px' }}>{w.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>Position:</span>
                <select className="xp-select" style={{ fontSize: '11px' }} defaultValue="stretch">
                  <option value="stretch">Stretch</option>
                  <option value="center">Center</option>
                  <option value="tile">Tile</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '11px', color: '#555', padding: '30px 10px', textAlign: 'center' }}>
            The &quot;{tab}&quot; tab is not wired up in this portfolio demo.
            <br />Try the <b>Desktop</b> tab to change the wallpaper.
          </div>
        )}
      </div>

      {/* OK / Cancel / Apply bar */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: '8px',
        padding: '10px', borderTop: '1px solid #aca899',
      }}>
        <button className="xp-button" style={{ fontSize: '11px', minWidth: '70px' }} onClick={() => onApply(pending)}>
          OK
        </button>
        <button className="xp-button" style={{ fontSize: '11px', minWidth: '70px' }} onClick={() => setPending(currentWallpaper)}>
          Cancel
        </button>
        <button className="xp-button" style={{ fontSize: '11px', minWidth: '70px' }} onClick={() => onApply(pending)}>
          Apply
        </button>
      </div>
    </div>
  );
}
