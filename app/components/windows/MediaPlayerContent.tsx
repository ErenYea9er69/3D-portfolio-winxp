'use client';

import { useState, useEffect, useRef } from 'react';
import XPIcon from '../XPIcon';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  notes: { note: number; dur: number; time: number }[];
}

// Generate classic nostalgic synthesizer tunes for built-in playback
const TRACKS: Track[] = [
  {
    id: 1,
    title: 'Windows XP Welcome Anthem',
    artist: 'Stan LePard (Recreated)',
    album: 'Windows XP Tour',
    duration: 32,
    notes: [
      { note: 261.63, dur: 0.4, time: 0.0 }, // C4
      { note: 329.63, dur: 0.4, time: 0.4 }, // E4
      { note: 392.00, dur: 0.6, time: 0.8 }, // G4
      { note: 523.25, dur: 0.8, time: 1.4 }, // C5
      { note: 440.00, dur: 0.4, time: 2.4 }, // A4
      { note: 392.00, dur: 0.6, time: 2.8 }, // G4
      { note: 349.23, dur: 0.4, time: 3.6 }, // F4
      { note: 329.63, dur: 1.0, time: 4.0 }, // E4
      { note: 293.66, dur: 0.5, time: 5.2 }, // D4
      { note: 392.00, dur: 0.5, time: 5.8 }, // G4
      { note: 523.25, dur: 1.4, time: 6.4 }, // C5
    ],
  },
  {
    id: 2,
    title: 'Bliss Horizon (Lo-Fi Synth)',
    artist: 'Retro Soundscapes',
    album: 'Green Hills & Blue Skies',
    duration: 28,
    notes: [
      { note: 440.00, dur: 0.6, time: 0.0 }, // A4
      { note: 523.25, dur: 0.6, time: 0.7 }, // C5
      { note: 659.25, dur: 0.8, time: 1.4 }, // E5
      { note: 587.33, dur: 0.6, time: 2.4 }, // D5
      { note: 493.88, dur: 0.6, time: 3.2 }, // B4
      { note: 440.00, dur: 1.2, time: 4.0 }, // A4
    ],
  },
  {
    id: 3,
    title: 'Space Cadet Odyssey',
    artist: 'Full Tilt Chiptunes',
    album: 'Arcade Classics',
    duration: 24,
    notes: [
      { note: 329.63, dur: 0.25, time: 0.0 },
      { note: 329.63, dur: 0.25, time: 0.3 },
      { note: 329.63, dur: 0.4, time: 0.6 },
      { note: 261.63, dur: 0.25, time: 1.1 },
      { note: 329.63, dur: 0.4, time: 1.4 },
      { note: 392.00, dur: 0.7, time: 2.0 },
      { note: 196.00, dur: 0.7, time: 3.0 },
    ],
  },
];

export default function MediaPlayerContent() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [vizMode, setVizMode] = useState<'bars' | 'wave' | 'fire'>('bars');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // Synthesizer note playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
    };
    initAudio();

    playTimerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (next >= currentTrack.duration) {
          // Move to next track
          setCurrentTrackIndex((idx) => (idx + 1) % TRACKS.length);
          return 0;
        }

        // Trigger synth notes mapped to this time mark
        const loopTime = next % 8;
        const matchingNotes = currentTrack.notes.filter((n) => Math.floor(n.time) === Math.floor(loopTime));
        if (matchingNotes.length > 0 && audioCtxRef.current && !isMuted) {
          try {
            const ctx = audioCtxRef.current;
            matchingNotes.forEach(({ note, dur }) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(note, ctx.currentTime);
              const volGain = (volume / 100) * 0.15;
              gain.gain.setValueAtTime(volGain, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + dur + 0.1);
            });
          } catch {
            // Ignore audio context pause state
          }
        }
        return next;
      });
    }, 1000);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, currentTrack, volume, isMuted]);

  // Visualizer animation loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;

    const render = () => {
      step += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      // Dark retro deep-blue WMP background
      ctx.fillStyle = '#061325';
      ctx.fillRect(0, 0, w, h);

      if (!isPlaying) {
        // Standby animated pulse
        ctx.strokeStyle = 'rgba(0, 180, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.05 + step) * 4;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#00d2ff';
        ctx.font = '11px Tahoma';
        ctx.textAlign = 'center';
        ctx.fillText('Windows Media Player • Ready', w / 2, h / 2 - 15);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '10px Tahoma';
        ctx.fillText('Press Play to start playback', w / 2, h / 2 + 25);
      } else {
        if (vizMode === 'bars') {
          // Authentic Spectrum Analyzer Bars
          const numBars = 32;
          const barWidth = (w - numBars * 2) / numBars;
          for (let i = 0; i < numBars; i++) {
            const freq = Math.sin(step * 2 + i * 0.4) * 0.5 + 0.5;
            const barHeight = freq * (h - 20) + Math.random() * 10;
            const x = i * (barWidth + 2);
            const y = h - barHeight;

            // Gradient from Green to Amber to Red
            const grad = ctx.createLinearGradient(0, h, 0, 0);
            grad.addColorStop(0, '#00ff66');
            grad.addColorStop(0.6, '#ffee00');
            grad.addColorStop(1, '#ff3300');

            ctx.fillStyle = grad;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Floating peak cap
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, Math.max(0, y - 3), barWidth, 2);
          }
        } else if (vizMode === 'wave') {
          // Glowing Neon Oscilloscope Wave
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#00ffff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ffff';
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const amp = Math.sin(x * 0.03 + step * 3) * 25 + Math.cos(x * 0.08 + step * 2) * 15;
            const y = h / 2 + amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          // Retro Ambience Sparks
          for (let i = 0; i < 20; i++) {
            const px = (Math.sin(step + i * 1.5) * 0.4 + 0.5) * w;
            const py = (Math.cos(step * 0.8 + i * 2) * 0.4 + 0.5) * h;
            const radius = (Math.sin(step * 2 + i) * 0.5 + 0.5) * 6 + 2;
            ctx.fillStyle = `hsla(${(i * 30 + step * 40) % 360}, 90%, 65%, 0.8)`;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Overlay Current Track Info
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(8, 8, 220, 36);
        ctx.strokeStyle = 'rgba(0, 180, 255, 0.4)';
        ctx.strokeRect(8, 8, 220, 36);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Tahoma';
        ctx.textAlign = 'left';
        ctx.fillText(currentTrack.title, 14, 22);

        ctx.fillStyle = '#8bd9ff';
        ctx.font = '10px Tahoma';
        ctx.fillText(`${currentTrack.artist} • ${currentTrack.album}`, 14, 36);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, vizMode, currentTrack]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const stopPlay = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setCurrentTime(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      margin: '-8px',
      background: 'linear-gradient(180deg, #1b3864 0%, #102444 100%)',
      fontFamily: 'Tahoma, sans-serif',
      color: '#fff',
      fontSize: '11px',
      overflow: 'hidden',
    }}>
      {/* Top Menu Bar (Classic XP WMP) */}
      <div style={{
        background: 'linear-gradient(180deg, #2b5592 0%, #1c3c6e 100%)',
        padding: '4px 10px',
        borderBottom: '1px solid #0f274e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/Windows Media Player 10.png" size={18} alt="WMP" />
          <span style={{ fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
            Windows Media Player
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['bars', 'wave', 'fire'] as const).map((mode) => (
            <button
              key={mode}
              className="xp-button"
              onClick={() => setVizMode(mode)}
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                minWidth: 'auto',
                minHeight: 'auto',
                background: vizMode === mode ? '#316ac5' : undefined,
                color: vizMode === mode ? '#fff' : undefined,
              }}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body (Visualizer Canvas + Playlist) */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Canvas Screen */}
        <div style={{ flex: 1, position: 'relative', background: '#061325' }}>
          <canvas
            ref={canvasRef}
            width={340}
            height={200}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>

        {/* Playlist Sidebar */}
        <div style={{
          width: '160px',
          background: '#15294a',
          borderLeft: '1px solid #0b1a32',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '6px 8px',
            background: '#10223d',
            borderBottom: '1px solid #0b1a32',
            fontWeight: 'bold',
            fontSize: '10px',
            color: '#8bd9ff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <XPIcon src="/icons xp/Windows XP Icons/WMP Playlist.png" size={14} />
            <span>Now Playing List</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
            {TRACKS.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => { setCurrentTrackIndex(idx); setCurrentTime(0); setIsPlaying(true); }}
                style={{
                  padding: '5px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  marginBottom: '2px',
                  background: currentTrackIndex === idx ? '#316ac5' : 'transparent',
                  color: currentTrackIndex === idx ? '#fff' : '#cde4ff',
                  fontSize: '10px',
                }}
                onMouseOver={(e) => {
                  if (currentTrackIndex !== idx) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseOut={(e) => {
                  if (currentTrackIndex !== idx) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrackIndex === idx && isPlaying ? '▶ ' : ''}{t.title}
                </div>
                <div style={{ fontSize: '9px', opacity: 0.8 }}>{t.artist}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Scrubber */}
      <div style={{
        padding: '4px 10px',
        background: '#18345c',
        borderTop: '1px solid #0c203a',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '10px', color: '#8bd9ff', minWidth: '32px' }}>
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={currentTrack.duration}
          value={currentTime}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          style={{
            flex: 1,
            height: '4px',
            accentColor: '#00d2ff',
            cursor: 'pointer',
          }}
        />
        <span style={{ fontSize: '10px', color: '#8bd9ff', minWidth: '32px', textAlign: 'right' }}>
          {formatTime(currentTrack.duration)}
        </span>
      </div>

      {/* Playback Controls (Brushed Steel Transport Deck) */}
      <div style={{
        background: 'linear-gradient(180deg, #2b5592 0%, #15325e 60%, #0c203e 100%)',
        borderTop: '1px solid #3c6eb5',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Playback buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="xp-button"
            onClick={prevTrack}
            title="Previous Track"
            style={{ minWidth: '30px', padding: '2px 6px', fontSize: '12px' }}
          >
            ⏮
          </button>
          <button
            className="xp-button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            style={{
              minWidth: '42px',
              padding: '2px 10px',
              fontSize: '13px',
              fontWeight: 'bold',
              background: isPlaying ? 'linear-gradient(180deg, #ffeedd 0%, #ffcc88 100%)' : undefined,
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            className="xp-button"
            onClick={stopPlay}
            title="Stop"
            style={{ minWidth: '30px', padding: '2px 6px', fontSize: '12px' }}
          >
            ⏹
          </button>
          <button
            className="xp-button"
            onClick={nextTrack}
            title="Next Track"
            style={{ minWidth: '30px', padding: '2px 6px', fontSize: '12px' }}
          >
            ⏭
          </button>
        </div>

        {/* Volume Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            onClick={() => setIsMuted(!isMuted)}
            style={{ cursor: 'pointer', fontSize: '14px' }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(Number(e.target.value)); if (isMuted) setIsMuted(false); }}
            style={{
              width: '70px',
              accentColor: '#3399ff',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: '10px', color: '#8bd9ff', width: '26px' }}>
            {isMuted ? '0%' : `${volume}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
