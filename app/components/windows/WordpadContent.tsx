'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import XPIcon from '../XPIcon';

const FONT_FAMILIES = [
  'Times New Roman',
  'Arial',
  'Courier New',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Comic Sans MS',
  'Trebuchet MS',
  'Impact',
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const COLORS = [
  '#000000', '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#c0c0c0',
  '#808080', '#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff', '#ffffff',
];

export default function WordpadContent() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState(12);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [wordCount, setWordCount] = useState(0);
  const [modified, setModified] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const execCommand = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    setModified(true);
  }, []);

  const handleBold = () => { execCommand('bold'); setIsBold(!isBold); };
  const handleItalic = () => { execCommand('italic'); setIsItalic(!isItalic); };
  const handleUnderline = () => { execCommand('underline'); setIsUnderline(!isUnderline); };

  const handleFontFamily = (f: string) => {
    setFontFamily(f);
    execCommand('fontName', f);
  };

  const handleFontSize = (s: number) => {
    setFontSize(s);
    // document.execCommand fontSize uses 1-7 scale, we use CSS instead
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      execCommand('fontSize', '3');
      // After setting, find the font element and replace with span
      const fonts = editorRef.current?.querySelectorAll('font[size="3"]');
      fonts?.forEach(el => {
        (el as HTMLElement).removeAttribute('size');
        (el as HTMLElement).style.fontSize = `${s}px`;
      });
    }
  };

  const handleColor = (color: string) => {
    setTextColor(color);
    execCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const handleAlign = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align);
    const cmds = { left: 'justifyLeft', center: 'justifyCenter', right: 'justifyRight' };
    execCommand(cmds[align]);
  };

  const updateWordCount = useCallback(() => {
    const text = editorRef.current?.innerText || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
  }, []);

  // Update format state on selection change
  useEffect(() => {
    const check = () => {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
    };
    document.addEventListener('selectionchange', check);
    return () => document.removeEventListener('selectionchange', check);
  }, []);

  const toolbarBtnStyle = (active: boolean = false): React.CSSProperties => ({
    width: '23px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: active ? '1px solid #3169c6' : '1px solid transparent',
    borderRadius: '2px',
    background: active ? 'rgba(49, 105, 198, 0.15)' : 'transparent',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: active ? 'bold' : 'normal',
  });

  const separatorStyle: React.CSSProperties = {
    width: '1px',
    height: '18px',
    background: '#aca899',
    margin: '0 3px',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#f0efe4',
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '11px',
    }}>
      {/* Menu bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1px 4px',
        borderBottom: '1px solid #aca899',
        gap: '8px',
        background: '#f0efe4',
      }}>
        {['File', 'Edit', 'View', 'Insert', 'Format', 'Help'].map(menu => (
          <span
            key={menu}
            onClick={menu === 'Help' ? () => setShowAbout(true) : undefined}
            style={{
              padding: '2px 6px',
              cursor: 'pointer',
              borderRadius: '2px',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background = '#c1d0e8';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background = 'transparent';
            }}
          >
            {menu}
          </span>
        ))}
      </div>

      {/* Main Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        borderBottom: '1px solid #ddd',
        gap: '1px',
        background: 'linear-gradient(180deg, #fafafa 0%, #eee 100%)',
        flexWrap: 'wrap',
      }}>
        {/* New / Open / Save icons */}
        <div
          style={toolbarBtnStyle()}
          title="New"
          onClick={() => {
            if (editorRef.current) editorRef.current.innerHTML = '';
            setModified(false);
          }}
        >
          📄
        </div>
        <div style={toolbarBtnStyle()} title="Open">📂</div>
        <div style={toolbarBtnStyle()} title="Save">💾</div>
        <div style={separatorStyle} />
        {/* Print / Preview */}
        <div style={toolbarBtnStyle()} title="Print">🖨️</div>
        <div style={toolbarBtnStyle()} title="Print Preview">🔍</div>
        <div style={separatorStyle} />
        {/* Undo / Redo */}
        <div style={toolbarBtnStyle()} title="Undo" onClick={() => execCommand('undo')}>↩</div>
        <div style={toolbarBtnStyle()} title="Redo" onClick={() => execCommand('redo')}>↪</div>
        <div style={separatorStyle} />
        {/* Cut / Copy / Paste */}
        <div style={toolbarBtnStyle()} title="Cut" onClick={() => execCommand('cut')}>✂</div>
        <div style={toolbarBtnStyle()} title="Copy" onClick={() => document.execCommand('copy')}>📋</div>
        <div style={toolbarBtnStyle()} title="Paste" onClick={() => execCommand('paste')}>📥</div>
      </div>

      {/* Format Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        borderBottom: '1px solid #ddd',
        gap: '3px',
        background: 'linear-gradient(180deg, #fafafa 0%, #eee 100%)',
        flexWrap: 'wrap',
      }}>
        {/* Font family */}
        <select
          value={fontFamily}
          onChange={e => handleFontFamily(e.target.value)}
          style={{
            width: '120px',
            height: '20px',
            fontSize: '11px',
            border: '1px solid #7f9db9',
            borderRadius: '0',
            background: '#fff',
            fontFamily: fontFamily,
          }}
        >
          {FONT_FAMILIES.map(f => (
            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
          ))}
        </select>

        {/* Font size */}
        <select
          value={fontSize}
          onChange={e => handleFontSize(Number(e.target.value))}
          style={{
            width: '45px',
            height: '20px',
            fontSize: '11px',
            border: '1px solid #7f9db9',
            borderRadius: '0',
            background: '#fff',
          }}
        >
          {FONT_SIZES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div style={separatorStyle} />

        {/* Bold / Italic / Underline */}
        <div
          style={{ ...toolbarBtnStyle(isBold), fontWeight: 'bold', fontFamily: 'serif' }}
          onClick={handleBold}
          title="Bold (Ctrl+B)"
        >B</div>
        <div
          style={{ ...toolbarBtnStyle(isItalic), fontStyle: 'italic', fontFamily: 'serif' }}
          onClick={handleItalic}
          title="Italic (Ctrl+I)"
        >I</div>
        <div
          style={{ ...toolbarBtnStyle(isUnderline), textDecoration: 'underline', fontFamily: 'serif' }}
          onClick={handleUnderline}
          title="Underline (Ctrl+U)"
        >U</div>

        <div style={separatorStyle} />

        {/* Text color */}
        <div style={{ position: 'relative' }}>
          <div
            style={{ ...toolbarBtnStyle(), flexDirection: 'column', gap: 0, width: '28px' }}
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Font Color"
          >
            <span style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: 1 }}>A</span>
            <div style={{ width: '16px', height: '3px', background: textColor, marginTop: '-1px' }} />
          </div>
          {showColorPicker && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#f0efe4',
              border: '1px solid #7f9db9',
              padding: '4px',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 18px)',
              gap: '2px',
              zIndex: 1000,
              boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}>
              {COLORS.map(c => (
                <div
                  key={c}
                  onClick={() => handleColor(c)}
                  style={{
                    width: '16px',
                    height: '16px',
                    background: c,
                    border: c === textColor ? '2px solid #000' : '1px solid #888',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight */}
        <div
          style={toolbarBtnStyle()}
          onClick={() => execCommand('hiliteColor', '#ffff00')}
          title="Highlight"
        >
          <span style={{ background: '#ffff00', padding: '0 2px', fontSize: '10px' }}>ab</span>
        </div>

        <div style={separatorStyle} />

        {/* Alignment */}
        <div
          style={toolbarBtnStyle(textAlign === 'left')}
          onClick={() => handleAlign('left')}
          title="Align Left"
        >☰</div>
        <div
          style={toolbarBtnStyle(textAlign === 'center')}
          onClick={() => handleAlign('center')}
          title="Center"
        >
          <span style={{ fontSize: '9px' }}>≡</span>
        </div>
        <div
          style={toolbarBtnStyle(textAlign === 'right')}
          onClick={() => handleAlign('right')}
          title="Align Right"
        >☷</div>

        <div style={separatorStyle} />

        {/* Bullet list */}
        <div
          style={toolbarBtnStyle()}
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >•≡</div>
      </div>

      {/* Ruler */}
      <div style={{
        height: '18px',
        background: '#fff',
        borderBottom: '1px solid #ddd',
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: '4px',
      }}>
        <svg width="100%" height="18" style={{ position: 'absolute', top: 0, left: 0 }}>
          {Array.from({ length: 80 }, (_, i) => {
            const x = 4 + i * 7.5;
            const isInch = i % 10 === 0;
            const isHalf = i % 5 === 0;
            return (
              <g key={i}>
                <line
                  x1={x} y1={isInch ? 4 : isHalf ? 8 : 12}
                  x2={x} y2={18}
                  stroke="#666"
                  strokeWidth={isInch ? 1 : 0.5}
                />
                {isInch && i > 0 && (
                  <text x={x} y={12} textAnchor="middle" fontSize="8" fill="#666">
                    {i / 10}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {/* Indent markers */}
        <div style={{
          position: 'absolute',
          left: '4px',
          top: '0',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '6px solid #333',
        }} />
      </div>

      {/* Editor area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: '#fff',
        padding: '8px 0',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            updateWordCount();
            setModified(true);
          }}
          onClick={() => setShowColorPicker(false)}
          style={{
            width: '95%',
            minHeight: '100%',
            padding: '20px 30px',
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            color: '#000',
            outline: 'none',
            lineHeight: 1.6,
            background: '#fff',
            boxShadow: '0 0 0 1px #ddd',
          }}
          dangerouslySetInnerHTML={{
            __html: `<p style="font-family: 'Times New Roman'; font-size: 14px; color: #333;">Welcome to WordPad!</p>
<p style="font-family: 'Times New Roman'; font-size: 12px; color: #555;">This is a rich text editor styled like the classic Windows XP WordPad. You can format text using the toolbar above — try <b>bold</b>, <i>italic</i>, <u>underline</u>, change fonts, sizes, colors, and alignment.</p>
<p style="font-family: 'Times New Roman'; font-size: 12px; color: #555;">Start typing to create your document...</p>`
          }}
        />
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 8px',
        background: '#f0efe4',
        borderTop: '1px solid #aca899',
        fontSize: '10px',
        color: '#555',
      }}>
        <span>{modified ? 'Modified' : 'Ready'}</span>
        <span>Words: {wordCount}</span>
      </div>

      {/* About dialog */}
      {showAbout && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        }}>
          <div style={{
            background: '#f0efe4',
            border: '2px solid #0054e3',
            borderRadius: '6px',
            padding: '20px',
            width: '280px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '10px', marginBottom: '4px' }}>
              <XPIcon src="/icons xp/Windows XP Icons/Wordpad.png" size={32} alt="WordPad" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>WordPad</div>
            <div style={{ fontSize: '10px', color: '#555', marginBottom: '12px' }}>
              Rich Text Document Editor<br />
              Windows XP Portfolio Edition
            </div>
            <button className="xp-button" onClick={() => setShowAbout(false)} style={{ padding: '2px 20px' }}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
