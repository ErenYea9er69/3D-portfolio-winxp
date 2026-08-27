'use client';

import { useState } from 'react';

export default function InternetExplorerContent() {
  const [addressBar, setAddressBar] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [homeSearch, setHomeSearch] = useState('');

  const navigateTo = (input: string) => {
    if (!input.trim()) return;
    
    let finalUrl = input.trim();
    
    // If no dots, treat as search query
    if (!finalUrl.includes('.') && !finalUrl.startsWith('http')) {
      finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(finalUrl)}`;
    } 
    // Add https if missing
    else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    setAddressBar(finalUrl);
    setCurrentUrl(finalUrl);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const goHome = () => {
    setAddressBar('');
    setCurrentUrl('');
    setHomeSearch('');
  };

  // Home page when no URL
  if (!currentUrl && !isLoading) {
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        margin: '-8px',
      }}>
        {/* Toolbar */}
        <div style={{
          background: '#ece9d8',
          borderBottom: '1px solid #a5a29a',
          padding: '6px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}>
          <button 
            onClick={goHome}
            style={{ padding: '4px 12px', fontSize: '11px', cursor: 'pointer' }}
          >
            🏠 Home
          </button>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            border: '1px solid #7f9db9',
            padding: '3px 6px',
          }}>
            <input
              type="text"
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigateTo(addressBar)}
              placeholder="Type URL or search term, then click Go"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '11px',
                fontFamily: 'Tahoma, sans-serif',
              }}
            />
          </div>
          <button 
            onClick={() => navigateTo(addressBar)}
            style={{ padding: '4px 16px', fontSize: '11px', cursor: 'pointer' }}
          >
            Go
          </button>
        </div>

        {/* Home Page Content */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(180deg, #e8f4fc 0%, #fff 100%)',
          padding: '40px 20px',
          overflowY: 'auto',
        }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌐</div>
            <h1 style={{ fontSize: '22px', color: '#0066cc', margin: '0 0 5px', fontWeight: 'normal' }}>
              Internet Explorer
            </h1>
            <p style={{ color: '#666', fontSize: '11px', marginBottom: '25px' }}>
              Portfolio Edition
            </p>

            {/* Search Box */}
            <div style={{
              display: 'flex',
              maxWidth: '400px',
              margin: '0 auto 30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <input
                type="text"
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigateTo(homeSearch)}
                placeholder="Search with Bing..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '13px',
                  border: '1px solid #ccc',
                  borderRight: 'none',
                  outline: 'none',
                  fontFamily: 'Tahoma, sans-serif',
                }}
              />
              <button
                onClick={() => navigateTo(homeSearch)}
                style={{
                  padding: '12px 20px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                🔍 Search
              </button>
            </div>

            {/* Quick Links */}
            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>Quick Links:</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { name: 'Bing', url: 'https://www.bing.com' },
                  { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
                  { name: 'Archive.org', url: 'https://archive.org' },
                ].map(link => (
                  <button
                    key={link.name}
                    onClick={() => navigateTo(link.url)}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* My Links */}
            <div style={{ 
              background: 'white', 
              padding: '15px', 
              borderRadius: '6px',
              border: '1px solid #ddd',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '11px', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>
                My Links (open in new tab):
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', fontSize: '11px' }}>
                <a href="https://github.com/StarKnightt" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>💻 GitHub</a>
                <a href="https://github.com/StarKnightt/windows-xp-portfolio" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>⭐ Portfolio Source</a>
                <a href="https://youtube.com/@Star_Knight12" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>📺 YouTube</a>
                <a href="https://linkedin.com/in/prasenjitnayak" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>💼 LinkedIn</a>
                <a href="https://x.com/Star_Knight12" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>🐦 Twitter</a>
              </div>
            </div>

            <p style={{ fontSize: '9px', color: '#999' }}>
              Note: GitHub, Twitter, etc. block embedding, so they open in new tabs.
            </p>
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          padding: '3px 8px',
          background: '#ece9d8',
          borderTop: '1px solid #a5a29a',
          fontSize: '10px',
          color: '#444',
        }}>
          ✓ Ready
        </div>
      </div>
    );
  }

  // Browser with iframe
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      margin: '-8px',
    }}>
      {/* Toolbar */}
      <div style={{
        background: '#ece9d8',
        borderBottom: '1px solid #a5a29a',
        padding: '6px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <button 
          onClick={goHome}
          style={{ padding: '4px 12px', fontSize: '11px', cursor: 'pointer' }}
        >
          🏠 Home
        </button>
        <button 
          onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }}
          style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
        >
          🔄
        </button>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          border: '1px solid #7f9db9',
          padding: '3px 6px',
        }}>
          <input
            type="text"
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo(addressBar)}
            placeholder="Type URL or search..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '11px',
              fontFamily: 'Tahoma, sans-serif',
            }}
          />
        </div>
        <button 
          onClick={() => navigateTo(addressBar)}
          style={{ padding: '4px 16px', fontSize: '11px', cursor: 'pointer' }}
        >
          Go
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: 'white' }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '10px',
          }}>
            <div style={{ fontSize: '32px' }}>🌐</div>
            <div style={{ color: '#666' }}>Loading...</div>
          </div>
        ) : (
          <iframe
            src={currentUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Browser"
          />
        )}
      </div>

      {/* Status bar */}
      <div style={{
        padding: '3px 8px',
        background: '#ece9d8',
        borderTop: '1px solid #a5a29a',
        fontSize: '10px',
        color: '#444',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>{isLoading ? '⏳ Loading...' : '✓ Done'}</span>
        <span>{currentUrl && new URL(currentUrl).hostname}</span>
      </div>
    </div>
  );
}
