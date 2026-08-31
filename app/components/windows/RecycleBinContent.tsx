'use client';

import XPIcon from '../XPIcon';

export default function RecycleBinContent() {
  const deletedItems = [
    { name: 'old_resume_v1.doc', type: 'document', date: '2024-01-15' },
    { name: 'unused_project_idea.txt', type: 'text', date: '2024-03-22' },
    { name: 'screenshot_123.png', type: 'image', date: '2024-06-10' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'document': return '/icons xp/Windows XP Icons/Generic Document.png';
      case 'text': return '/icons xp/Windows XP Icons/Generic Text Document.png';
      case 'image': return '/icons xp/Windows XP Icons/Bitmap.png';
      default: return '/icons xp/Windows XP Icons/Folder Closed.png';
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <XPIcon src="/icons xp/Windows XP Icons/Recycle Bin (empty).png" size={28} alt="Recycle Bin" />
        <div>
          <h2 style={{ margin: 0, fontSize: '14px' }}>Recycle Bin</h2>
          <p style={{ margin: '2px 0 0', color: '#666', fontSize: '10px' }}>
            {deletedItems.length} item(s)
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '10px',
        padding: '5px',
        background: '#f5f5f5',
        borderRadius: '2px',
        fontSize: '10px'
      }}>
        <button className="xp-button" style={{ fontSize: '10px', padding: '2px 8px', minWidth: 'auto', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/Delete.png" size={14} />
          Empty Recycle Bin
        </button>
        <button className="xp-button" style={{ fontSize: '10px', padding: '2px 8px', minWidth: 'auto', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/Restore All Items.png" size={14} />
          Restore All
        </button>
      </div>

      {/* Items List */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #ccc',
        minHeight: '150px'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '24px 1fr 80px',
          padding: '4px 8px',
          background: 'linear-gradient(180deg, #fff 0%, #eee 100%)',
          borderBottom: '1px solid #ccc',
          fontSize: '10px',
          fontWeight: 'bold',
          alignItems: 'center'
        }}>
          <span></span>
          <span>Name</span>
          <span>Date Deleted</span>
        </div>

        {/* Items */}
        {deletedItems.map((item, i) => (
          <div 
            key={i}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '24px 1fr 80px',
              padding: '4px 8px',
              borderBottom: '1px solid #eee',
              fontSize: '11px',
              cursor: 'pointer',
              alignItems: 'center',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e8f4ff'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <XPIcon src={getIcon(item.type)} size={16} alt={item.name} />
            </span>
            <span>{item.name}</span>
            <span style={{ color: '#666' }}>{item.date}</span>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '15px', 
        textAlign: 'center',
        color: '#888',
        fontSize: '10px',
        fontStyle: 'italic'
      }}>
        These items are only for show - this is a portfolio demo!
      </div>
    </div>
  );
}
