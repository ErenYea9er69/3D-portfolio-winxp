'use client';

import XPIcon from '../XPIcon';

export default function FolderContent({ name }: { name: string }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: '-8px', background: '#fff' }}>
      <div style={{
        display: 'flex', gap: '12px', padding: '3px 6px',
        borderBottom: '1px solid #aca899', background: '#ece9d8', fontSize: '11px',
      }}>
        <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 6px',
        borderBottom: '1px solid #aca899', background: '#f2f0e6', fontSize: '11px', color: '#888',
      }}>
        <span>Address</span>
        <div style={{ flex: 1, background: '#fff', border: '1px inset #808080', padding: '2px 6px', color: '#333', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/Folder Opened.png" size={16} />
          <span>{name}</span>
        </div>
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '11px', gap: '8px',
      }}>
        <XPIcon src="/icons xp/Windows XP Icons/Folder Closed.png" size={48} />
        <span>This folder is empty.</span>
      </div>
      <div style={{
        padding: '2px 8px', borderTop: '1px solid #aca899', background: '#ece9d8',
        fontSize: '10px', color: '#444',
      }}>
        0 objects
      </div>
    </div>
  );
}
