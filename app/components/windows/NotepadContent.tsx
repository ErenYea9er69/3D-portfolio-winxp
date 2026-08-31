'use client';

import { useState, useEffect } from 'react';
import { usePortfolioData } from '@/app/lib/usePortfolioData';

interface NotepadContentProps {
  initialText?: string;
}

export default function NotepadContent({ initialText }: NotepadContentProps) {
  const { saveDocument, listDocuments, isDbConnected } = usePortfolioData();
  const [text, setText] = useState(
    initialText ??
      `Welcome to Notepad!
  
This is a live cloud text editor connected to Neon PostgreSQL.
You can create notes, save them to the cloud database, or open existing notes from the File menu!

--------------------
Prasenjit Nayak
Full Stack Developer
Odisha, India
--------------------

Thanks for visiting my portfolio!`
  );

  const [docTitle, setDocTitle] = useState('Untitled.txt');
  const [docId, setDocId] = useState<string | undefined>(undefined);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitleInput, setSaveTitleInput] = useState('MyNote.txt');
  const [savedDocList, setSavedDocList] = useState<Array<{ id: string; title: string; updated_at: string }>>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Line and col count
  const [cursorPos, setCursorPos] = useState({ ln: 1, col: 1 });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    updateCursor(e.target);
  };

  const updateCursor = (el: HTMLTextAreaElement) => {
    const selStart = el.selectionStart;
    const lines = el.value.substring(0, selStart).split('\n');
    setCursorPos({
      ln: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  const handleOpenClick = async () => {
    setActiveMenu(null);
    try {
      const res = await listDocuments('notepad');
      if (res.success && res.data) {
        setSavedDocList(res.data);
      }
      setShowOpenModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectDoc = async (id: string, title: string, content: string) => {
    setDocId(id);
    setDocTitle(title);
    setText(content);
    setShowOpenModal(false);
    setStatusMessage(`Loaded "${title}"`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveClick = () => {
    setActiveMenu(null);
    setSaveTitleInput(docTitle);
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    try {
      const res = await saveDocument({
        id: docId,
        title: saveTitleInput.trim() || 'Untitled.txt',
        content: text,
        doc_type: 'notepad',
      });
      if (res.success) {
        setDocId(res.data.id);
        setDocTitle(res.data.title);
        setShowSaveModal(false);
        setStatusMessage(`Saved to Neon DB!`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNew = () => {
    setActiveMenu(null);
    setDocId(undefined);
    setDocTitle('Untitled.txt');
    setText('');
    setStatusMessage('New document created');
    setTimeout(() => setStatusMessage(null), 2000);
  };

  return (
    <div
      onClick={() => setActiveMenu(null)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        margin: '-8px',
        position: 'relative',
      }}
    >
      {/* Menu bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '2px 4px',
          borderBottom: '1px solid #aca899',
          background: '#ece9d8',
          fontSize: '11px',
          userSelect: 'none',
          position: 'relative',
        }}
      >
        {/* File Menu */}
        <div style={{ position: 'relative' }}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'file' ? null : 'file');
            }}
            style={{
              padding: '2px 6px',
              cursor: 'pointer',
              background: activeMenu === 'file' ? '#316ac5' : 'transparent',
              color: activeMenu === 'file' ? 'white' : 'black',
            }}
          >
            File
          </span>
          {activeMenu === 'file' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: '#ffffff',
                border: '1px solid #716f64',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                zIndex: 9999,
                minWidth: '150px',
                padding: '2px',
              }}
            >
              <div
                onClick={handleNew}
                className="xp-menu-item"
                style={{ padding: '4px 12px', cursor: 'pointer', fontSize: '11px' }}
              >
                📄 New
              </div>
              <div
                onClick={handleOpenClick}
                className="xp-menu-item"
                style={{ padding: '4px 12px', cursor: 'pointer', fontSize: '11px' }}
              >
                📂 Open from Cloud DB...
              </div>
              <div
                onClick={handleSaveClick}
                className="xp-menu-item"
                style={{ padding: '4px 12px', cursor: 'pointer', fontSize: '11px' }}
              >
                💾 Save to Neon DB
              </div>
            </div>
          )}
        </div>

        <span
          onClick={() => {
            setText('');
            setStatusMessage('Cleared text');
            setTimeout(() => setStatusMessage(null), 2000);
          }}
          style={{ padding: '2px 6px', cursor: 'pointer' }}
        >
          Clear
        </span>

        {statusMessage && (
          <span style={{ marginLeft: 'auto', color: '#0066cc', fontSize: '10px', fontWeight: 'bold' }}>
            {statusMessage}
          </span>
        )}

        {isDbConnected && !statusMessage && (
          <span style={{ marginLeft: 'auto', color: '#2e7d32', fontSize: '9px' }}>
            🟢 Neon Cloud Sync
          </span>
        )}
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyUp={(e) => updateCursor(e.currentTarget)}
        onClick={(e) => updateCursor(e.currentTarget)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '6px',
          fontFamily: 'Lucida Console, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.4',
          background: 'white',
        }}
        spellCheck={false}
      />

      {/* Status bar */}
      <div
        style={{
          padding: '2px 8px',
          borderTop: '1px solid #aca899',
          background: '#ece9d8',
          fontSize: '10px',
          color: '#444',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{docTitle}</span>
        <span>
          Ln {cursorPos.ln}, Col {cursorPos.col}
        </span>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: '#ece9d8',
              border: '2px solid #0055ea',
              borderRadius: '4px',
              padding: '12px',
              width: '280px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '8px', color: '#0a246a' }}>
              Save Document to Neon DB
            </div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>File Name:</label>
            <input
              type="text"
              className="xp-input"
              value={saveTitleInput}
              onChange={(e) => setSaveTitleInput(e.target.value)}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button className="xp-button" onClick={() => setShowSaveModal(false)}>
                Cancel
              </button>
              <button className="xp-button" onClick={handleConfirmSave} style={{ fontWeight: 'bold' }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Modal */}
      {showOpenModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: '#ece9d8',
              border: '2px solid #0055ea',
              borderRadius: '4px',
              padding: '12px',
              width: '320px',
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '8px', color: '#0a246a' }}>
              Open from Neon Database
            </div>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                background: 'white',
                border: '1px solid #7f9db9',
                padding: '4px',
                marginBottom: '10px',
                maxHeight: '160px',
              }}
            >
              {savedDocList.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#888', padding: '8px', textAlign: 'center' }}>
                  No saved notes found.
                </div>
              ) : (
                savedDocList.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={async () => {
                      const res = await listDocuments();
                      const full = (res.data || []).find((d: { id: string }) => d.id === doc.id);
                      if (full) handleSelectDoc(full.id, full.title, full.content);
                    }}
                    style={{
                      padding: '4px 6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#316ac5', e.currentTarget.style.color = 'white')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'white', e.currentTarget.style.color = 'black')}
                  >
                    <span>📄 {doc.title}</span>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="xp-button" onClick={() => setShowOpenModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
