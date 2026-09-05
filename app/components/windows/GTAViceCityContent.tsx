import React from 'react';

export default function GTAViceCityContent() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <iframe 
        src="https://joncodeofficial.github.io/gta-vice-city-wasm/" 
        style={{ flex: 1, border: 'none' }}
        title="GTA Vice City"
        allow="fullscreen; gamepad; keyboard"
      />
      <div style={{ padding: '8px', background: '#ece9d8', borderTop: '1px solid #a5a29a', fontSize: '11px', color: '#333' }}>
        <strong>Note:</strong> This is a reverse-engineered web port of GTA: Vice City. For legal reasons, you must provide your own 'game.tar.gz' file to play.
      </div>
    </div>
  );
}
