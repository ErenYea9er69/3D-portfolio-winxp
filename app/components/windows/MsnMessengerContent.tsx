'use client';

import { useState, useEffect, useRef } from 'react';
import XPIcon from '../XPIcon';

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  senderName: string;
  text: string;
  time: string;
  isNudge?: boolean;
}

interface Buddy {
  id: string;
  name: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  statusText: string;
  avatar: string;
}

const BUDDIES: Buddy[] = [
  {
    id: 'prasenjit',
    name: 'Prasenjit Nayak (Dev)',
    status: 'online',
    statusText: '⚡ Building fast web apps | Available for hire!',
    avatar: '/icons xp/Windows XP Icons/User Accounts.png',
  },
  {
    id: 'clippy',
    name: 'Clippy',
    status: 'online',
    statusText: '📎 It looks like you are exploring a portfolio...',
    avatar: '/icons xp/Windows XP Icons/Help and Support.png',
  },
  {
    id: 'billg',
    name: 'Bill G.',
    status: 'away',
    statusText: '🖥️ 640K ought to be enough for anybody',
    avatar: '/icons xp/Windows XP Icons/My Computer.png',
  },
  {
    id: 'bonzi',
    name: 'Bonzi Buddy',
    status: 'offline',
    statusText: 'Hello there, friend!',
    avatar: '/icons xp/Windows XP Icons/Game Controller.png',
  },
];

const EMOTICONS = [
  { code: ':-)', emoji: '🙂', label: 'Smile' },
  { code: ':-D', emoji: '😀', label: 'Open Mouth' },
  { code: ';-)', emoji: '😉', label: 'Wink' },
  { code: ':-P', emoji: '😛', label: 'Tongue Out' },
  { code: '(H)', emoji: '😎', label: 'Cool Glasses' },
  { code: '(A)', emoji: '😇', label: 'Angel' },
  { code: ':@', emoji: '😡', label: 'Angry' },
  { code: ':-O', emoji: '😮', label: 'Surprised' },
  { code: '(L)', emoji: '❤️', label: 'Red Heart' },
  { code: '(K)', emoji: '💋', label: 'Kiss' },
  { code: '(Y)', emoji: '👍', label: 'Thumbs Up' },
  { code: '(N)', emoji: '👎', label: 'Thumbs Down' },
  { code: '(star)', emoji: '⭐', label: 'Star' },
  { code: '(music)', emoji: '🎵', label: 'Music' },
  { code: '(beer)', emoji: '🍺', label: 'Beer' },
  { code: '(coffee)', emoji: '☕', label: 'Coffee' },
];

function playMsnAudio(type: 'send' | 'receive' | 'nudge') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'receive') {
      // Classic MSN 2-tone alert chime (F5 -> A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(698.46, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(880.00, now + 0.08);
      gain2.gain.setValueAtTime(0.14, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.32);
    } else if (type === 'send') {
      // Gentle outgoing click/pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'nudge') {
      // Low vibration rumble + 2 high screech tones (MSN Nudge buzzer)
      const oscLow = ctx.createOscillator();
      const gainLow = ctx.createGain();
      oscLow.type = 'sawtooth';
      oscLow.frequency.setValueAtTime(140, now);
      gainLow.gain.setValueAtTime(0.2, now);
      gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      oscLow.connect(gainLow);
      gainLow.connect(ctx.destination);
      oscLow.start(now);
      oscLow.stop(now + 0.5);

      const oscHigh = ctx.createOscillator();
      const gainHigh = ctx.createGain();
      oscHigh.type = 'triangle';
      oscHigh.frequency.setValueAtTime(880, now);
      oscHigh.frequency.setValueAtTime(1174.66, now + 0.12);
      gainHigh.gain.setValueAtTime(0.18, now);
      gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      oscHigh.connect(gainHigh);
      gainHigh.connect(ctx.destination);
      oscHigh.start(now);
      oscHigh.stop(now + 0.5);
    }
  } catch {
    // Audio Context not allowed or muted
  }
}

function getBotReply(msg: string, buddyId: string): string {
  const lower = msg.toLowerCase();

  if (buddyId === 'clippy') {
    if (lower.includes('project') || lower.includes('work')) {
      return '📎 It looks like you want to see projects! You can check out "My Projects" folder on the desktop or ask Prasenjit directly.';
    }
    if (lower.includes('hire') || lower.includes('contact')) {
      return '📎 It looks like you want to get in touch! Use the "Contact Me" program or email Prasenjit directly.';
    }
    return '📎 Would you like me to write a formal letter for you, or perhaps help you configure Windows XP?';
  }

  if (buddyId === 'billg') {
    if (lower.includes('xp') || lower.includes('windows')) {
      return 'Windows XP represents the biggest leap forward in consumer computing since Windows 95! The Luna theme is magnificent.';
    }
    return 'Innovation is about making technology accessible to everyone on the planet.';
  }

  // Default: Prasenjit AI Portfolio Bot
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hey there! 😊 Welcome to my Windows XP portfolio! Ask me anything about my tech stack, projects, experience, or click the Nudge button!';
  }
  if (lower.includes('project') || lower.includes('work') || lower.includes('portfolio')) {
    return '🚀 Here are a few highlights:\n1. 3D Windows XP Desktop (Next.js, TypeScript, Web Audio, CSS3)\n2. Fullstack Web Apps & AI Tools\n3. Interactive 3D Canvas Visualizations\nDouble click "My Projects" on the desktop to view live demos!';
  }
  if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) {
    return '💻 My primary tech stack includes:\n• Frontend: React, Next.js, TypeScript, Tailwind CSS, Three.js / WebGL\n• Backend: Node.js, Python, PostgreSQL, REST & GraphQL APIs\n• Tools: Git, Docker, Linux, Cloudflare, Vercel (H)';
  }
  if (lower.includes('contact') || lower.includes('hire') || lower.includes('email') || lower.includes('reach')) {
    return '📬 You can reach me via the Contact app on the desktop, through GitHub, or send a message right here! I am open to fullstack & frontend roles (Y)';
  }
  if (lower.includes('game') || lower.includes('pinball') || lower.includes('play')) {
    return '🎮 Don\'t forget to play 3D Pinball Space Cadet, Solitaire, Spider Solitaire, and Minesweeper right here in this OS! Have fun!';
  }
  if (lower.includes('joke') || lower.includes('funny') || lower.includes('meme')) {
    return '😄 Why do Java programmers have to wear glasses?\nBecause they don\'t C#! :-D';
  }
  if (lower.includes('nudge')) {
    return '⚡ Wow, that shook my screen! I\'m awake and ready to code! (H)';
  }

  return 'Thanks for your message! 😊 I\'m always excited to collaborate on innovative web applications and creative interactive experiences. What would you like to know more about?';
}

export default function MsnMessengerContent() {
  const [selectedBuddyId, setSelectedBuddyId] = useState<string>('prasenjit');
  const [myStatus, setMyStatus] = useState<string>('Online');
  const [myPersonalMsg, setMyPersonalMsg] = useState<string>('⚡ Fullstack Dev | Exploring Windows XP Web OS');
  const [inputText, setInputText] = useState<string>('');
  const [isNudging, setIsNudging] = useState<boolean>(false);
  const [showEmoticonPicker, setShowEmoticonPicker] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [chatLogs, setChatLogs] = useState<Record<string, Message[]>>({
    prasenjit: [
      {
        id: 'msg-1',
        sender: 'bot',
        senderName: 'Prasenjit Nayak (Dev)',
        text: 'Hey! Welcome to MSN Messenger. What would you like to know about my work, skills, or projects? 😊',
        time: '12:00 PM',
      },
    ],
    clippy: [
      {
        id: 'msg-2',
        sender: 'bot',
        senderName: 'Clippy',
        text: '📎 Hello! It looks like you are checking out an interactive portfolio. Can I help you with anything?',
        time: '12:00 PM',
      },
    ],
    billg: [
      {
        id: 'msg-3',
        sender: 'bot',
        senderName: 'Bill G.',
        text: 'Welcome to the digital decade. Feel free to ping me.',
        time: '12:00 PM',
      },
    ],
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const activeBuddy = BUDDIES.find(b => b.id === selectedBuddyId) || BUDDIES[0];
  const activeMessages = chatLogs[selectedBuddyId] || [];

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      text: userText,
      time: timeStr,
    };

    setChatLogs(prev => ({
      ...prev,
      [selectedBuddyId]: [...(prev[selectedBuddyId] || []), userMsg],
    }));

    setInputText('');
    setShowEmoticonPicker(false);
    playMsnAudio('send');

    // Simulate realistic typing & bot response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponseText = getBotReply(userText, selectedBuddyId);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        senderName: activeBuddy.name,
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatLogs(prev => ({
        ...prev,
        [selectedBuddyId]: [...(prev[selectedBuddyId] || []), botMsg],
      }));
      playMsnAudio('receive');
    }, 900 + Math.random() * 600);
  };

  const handleSendNudge = () => {
    setIsNudging(true);
    playMsnAudio('nudge');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nudgeMsg: Message = {
      id: `nudge-${Date.now()}`,
      sender: 'system',
      senderName: 'System',
      text: '💥 You have just sent a Nudge!',
      time: now,
      isNudge: true,
    };

    setChatLogs(prev => ({
      ...prev,
      [selectedBuddyId]: [...(prev[selectedBuddyId] || []), nudgeMsg],
    }));

    setTimeout(() => {
      setIsNudging(false);
    }, 600);

    // Bot reacts to nudge after 1.2s
    setTimeout(() => {
      const returnNudge: Message = {
        id: `reply-nudge-${Date.now()}`,
        sender: 'bot',
        senderName: activeBuddy.name,
        text: '⚡ Whoa! That nudge shook my entire monitor! How can I help you? (H)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatLogs(prev => ({
        ...prev,
        [selectedBuddyId]: [...(prev[selectedBuddyId] || []), returnNudge],
      }));
      playMsnAudio('receive');
    }, 1200);
  };

  return (
    <div
      className={isNudging ? 'msn-nudge-active' : ''}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#e4ebf8',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
        userSelect: 'none',
      }}
    >
      {/* Top MSN Messenger Header Bar */}
      <div style={{
        background: 'linear-gradient(180deg, #74a0dd 0%, #4b7bc7 50%, #2f62b5 100%)',
        padding: '6px 10px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1c4a92',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/MSN Messenger.png" size={22} alt="MSN" />
          <span style={{ fontWeight: 'bold', fontSize: '12px', textShadow: '1px 1px 1px #113366' }}>
            MSN Messenger 7.5
          </span>
        </div>
        <div style={{ fontSize: '10px', opacity: 0.9 }}>
          .NET Messenger Service
        </div>
      </div>

      {/* User Status Bar Card */}
      <div style={{
        background: '#dbe5f7',
        padding: '6px 10px',
        borderBottom: '1px solid #b3c5e7',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        {/* User Avatar */}
        <div style={{
          width: '38px',
          height: '38px',
          border: '1px solid #7a97c9',
          background: '#fff',
          padding: '2px',
          borderRadius: '3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <XPIcon src="/icons xp/Windows XP Icons/User Accounts.png" size={32} alt="Avatar" />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 'bold', color: '#103875' }}>Prasenjit Nayak</span>
            <select
              value={myStatus}
              onChange={(e) => setMyStatus(e.target.value)}
              style={{
                fontSize: '10px',
                border: '1px solid #7a97c9',
                borderRadius: '2px',
                background: '#fff',
                padding: '1px 3px',
              }}
            >
              <option value="Online">🟢 (Online)</option>
              <option value="Busy">🔴 (Busy)</option>
              <option value="Away">🟠 (Away)</option>
              <option value="BRB">🟡 (Be Right Back)</option>
              <option value="Offline">⚪ (Appear Offline)</option>
            </select>
          </div>

          <input
            type="text"
            value={myPersonalMsg}
            onChange={(e) => setMyPersonalMsg(e.target.value)}
            title="Personal status message"
            style={{
              width: '100%',
              fontSize: '10px',
              border: 'none',
              background: 'transparent',
              color: '#335588',
              outline: 'none',
              padding: '2px 0 0 0',
              fontStyle: 'italic',
            }}
          />
        </div>
      </div>

      {/* Main Split: Buddy List (Left) + Chat Window (Right) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Buddy List Sidebar */}
        <div style={{
          width: '155px',
          background: '#f4f7fd',
          borderRight: '1px solid #b3c5e7',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '4px 8px',
            background: '#e0eaf8',
            fontWeight: 'bold',
            fontSize: '10px',
            color: '#2b508e',
            borderBottom: '1px solid #c9d8ee',
          }}>
            Contacts ({BUDDIES.filter(b => b.status !== 'offline').length} online)
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
            {BUDDIES.map(buddy => {
              const isSelected = buddy.id === selectedBuddyId;
              return (
                <div
                  key={buddy.id}
                  onClick={() => setSelectedBuddyId(buddy.id)}
                  style={{
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    background: isSelected ? '#316ac5' : 'transparent',
                    color: isSelected ? '#fff' : '#000',
                  }}
                >
                  <span style={{ fontSize: '10px' }}>
                    {buddy.status === 'online' ? '🟢' : buddy.status === 'busy' ? '🔴' : buddy.status === 'away' ? '🟠' : '⚪'}
                  </span>
                  <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    <div style={{ fontWeight: buddy.status === 'online' ? 'bold' : 'normal', fontSize: '11px' }}>
                      {buddy.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '6px 8px', borderTop: '1px solid #c9d8ee', fontSize: '10px', color: '#666' }}>
            💡 Tip: Click Nudge to vibrate!
          </div>
        </div>

        {/* Chat Conversation Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
          {/* Buddy Header */}
          <div style={{
            padding: '6px 10px',
            background: '#ebf2fc',
            borderBottom: '1px solid #cddcf2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <XPIcon src={activeBuddy.avatar} size={22} alt="" />
              <div>
                <div style={{ fontWeight: 'bold', color: '#1b3f7e' }}>{activeBuddy.name}</div>
                <div style={{ fontSize: '10px', color: '#6688aa' }}>{activeBuddy.statusText}</div>
              </div>
            </div>
            <button
              onClick={handleSendNudge}
              title="Send a Nudge (shake the window!)"
              style={{
                background: 'linear-gradient(180deg, #fffae6 0%, #ffd480 100%)',
                border: '1px solid #cc9900',
                borderRadius: '3px',
                padding: '3px 8px',
                fontSize: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#664400',
              }}
            >
              ⚡ Nudge!
            </button>
          </div>

          {/* Chat Messages Log */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {activeMessages.map(m => {
              if (m.isNudge) {
                return (
                  <div
                    key={m.id}
                    style={{
                      textAlign: 'center',
                      color: '#cc3300',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      padding: '4px',
                      background: '#fff2ea',
                      borderRadius: '4px',
                      border: '1px dashed #ffaa88',
                    }}
                  >
                    {m.text}
                  </div>
                );
              }

              const isMe = m.sender === 'user';
              return (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '10px', color: isMe ? '#003399' : '#cc3300', fontWeight: 'bold' }}>
                    {m.senderName} says ({m.time}):
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#000',
                    padding: '2px 0 0 8px',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.4',
                  }}>
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>
                {activeBuddy.name} is typing a message...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Emoticon Picker Popover */}
          {showEmoticonPicker && (
            <div style={{
              position: 'absolute',
              bottom: '75px',
              right: '20px',
              background: '#fff',
              border: '1px solid #7a97c9',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              padding: '6px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 30px)',
              gap: '4px',
              zIndex: 100,
            }}>
              {EMOTICONS.map(e => (
                <button
                  key={e.code}
                  onClick={() => {
                    setInputText(prev => `${prev} ${e.code} `);
                    setShowEmoticonPicker(false);
                  }}
                  title={`${e.label} (${e.code})`}
                  style={{
                    border: '1px solid #e0e0e0',
                    background: '#f8f8f8',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '3px',
                    borderRadius: '2px',
                  }}
                >
                  {e.emoji}
                </button>
              ))}
            </div>
          )}

          {/* Text Input & Controls Toolbar */}
          <div style={{
            padding: '6px 8px',
            background: '#ebf2fc',
            borderTop: '1px solid #cddcf2',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            {/* Action icons bar */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowEmoticonPicker(!showEmoticonPicker)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '1px',
                }}
                title="Choose an emoticon"
              >
                😊
              </button>
              <button
                type="button"
                onClick={handleSendNudge}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '1px',
                }}
                title="Nudge"
              >
                ⚡
              </button>
              <span style={{ fontSize: '10px', color: '#6688aa', marginLeft: 'auto' }}>
                Press Enter to send
              </span>
            </div>

            {/* Input box and Send button */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Message ${activeBuddy.name}...`}
                style={{
                  flex: 1,
                  height: '42px',
                  resize: 'none',
                  padding: '4px 6px',
                  fontFamily: 'Tahoma, sans-serif',
                  fontSize: '11px',
                  border: '1px solid #7f9db9',
                  borderRadius: '2px',
                  outline: 'none',
                }}
              />
              <button
                className="xp-button"
                onClick={handleSendMessage}
                style={{ height: '42px', minWidth: '60px', fontWeight: 'bold' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
