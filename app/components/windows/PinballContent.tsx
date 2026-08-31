'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Constants ──────────────────────────────────────────────────────────
const TABLE_W = 280;
const TABLE_H = 520;
const BALL_R = 6;
const GRAVITY = 0.16;
const FRICTION = 0.996;
const FLIPPER_LEN = 46;
const FLIPPER_W = 8;
const PLUNGER_MAX = 80;

interface Bumper { x: number; y: number; r: number; score: number; flash: number }
interface Target { x: number; y: number; w: number; h: number; score: number; hit: boolean; label: string }

function playBeep(freq: number, dur: number, vol = 0.12) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch { /* silent */ }
}

export default function PinballContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(3);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'launching' | 'gameover'>('ready');
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('xp_pinball_hi') || '0');
    }
    return 0;
  });

  const state = useRef({
    ball: { x: TABLE_W - 18, y: TABLE_H - 90, vx: 0, vy: 0 },
    plungerPower: 0,
    plungerHeld: false,
    leftFlipperUp: false,
    rightFlipperUp: false,
    leftFlipperAngle: 0.35,
    rightFlipperAngle: Math.PI - 0.35,
    bumpers: [
      { x: 100, y: 140, r: 18, score: 100, flash: 0 },
      { x: 165, y: 110, r: 16, score: 150, flash: 0 },
      { x: 135, y: 190, r: 20, score: 100, flash: 0 },
      { x: 65, y: 240, r: 14, score: 200, flash: 0 },
      { x: 185, y: 210, r: 15, score: 150, flash: 0 },
    ] as Bumper[],
    targets: [
      { x: 40, y: 80, w: 8, h: 28, score: 500, hit: false, label: 'S' },
      { x: 60, y: 70, w: 8, h: 28, score: 500, hit: false, label: 'P' },
      { x: 80, y: 65, w: 8, h: 28, score: 500, hit: false, label: 'A' },
      { x: 100, y: 65, w: 8, h: 28, score: 500, hit: false, label: 'C' },
      { x: 120, y: 70, w: 8, h: 28, score: 500, hit: false, label: 'E' },
    ] as Target[],
    score: 0,
    balls: 3,
    gameState: 'ready' as 'ready' | 'playing' | 'launching' | 'gameover',
    animFrame: 0,
    stars: Array.from({ length: 30 }, () => ({
      x: Math.random() * (TABLE_W - 30),
      y: Math.random() * TABLE_H * 0.6 + 20,
      s: Math.random() * 2 + 0.5,
      b: Math.random(),
    })),
  });

  const resetBall = useCallback(() => {
    const s = state.current;
    s.ball = { x: TABLE_W - 18, y: TABLE_H - 90, vx: 0, vy: 0 };
    s.plungerPower = 0;
    s.plungerHeld = false;
    s.gameState = 'ready';
    s.targets.forEach(t => { t.hit = false; });
    setGameState('ready');
  }, []);

  const loseBall = useCallback(() => {
    const s = state.current;
    s.balls--;
    setBalls(s.balls);
    if (s.balls <= 0) {
      s.gameState = 'gameover';
      setGameState('gameover');
      setHighScore(prev => {
        const next = Math.max(prev, s.score);
        try { localStorage.setItem('xp_pinball_hi', String(next)); } catch { /* ignore */ }
        return next;
      });
    } else {
      resetBall();
    }
  }, [resetBall]);

  const newGame = useCallback(() => {
    const s = state.current;
    s.score = 0;
    s.balls = 3;
    setScore(0);
    setBalls(3);
    resetBall();
  }, [resetBall]);

  const launchBall = useCallback((powerMultiplier = 1) => {
    const s = state.current;
    if (s.gameState === 'ready' || s.gameState === 'launching') {
      const p = Math.max(30, s.plungerPower > 0 ? s.plungerPower : 70 * powerMultiplier);
      s.ball.vy = -(p / PLUNGER_MAX) * 14 - 3;
      s.ball.vx = 0;
      s.plungerPower = 0;
      s.plungerHeld = false;
      s.gameState = 'playing';
      setGameState('playing');
      playBeep(880, 0.15, 0.08);
    }
  }, []);

  // ─── Input ──────────────────────────────────────────────────────────
  useEffect(() => {
    const s = state.current;

    const down = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        s.leftFlipperUp = true;
      }
      if (e.key === 'm' || e.key === 'M' || e.key === '/' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        s.rightFlipperUp = true;
      }
      if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        if (s.gameState === 'ready') {
          s.plungerHeld = true;
          s.gameState = 'launching';
          setGameState('launching');
        } else if (s.gameState === 'gameover') {
          newGame();
        }
      }
    };

    const up = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        s.leftFlipperUp = false;
      }
      if (e.key === 'm' || e.key === 'M' || e.key === '/' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        s.rightFlipperUp = false;
      }
      if ((e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter') && s.plungerHeld) {
        launchBall();
      }
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [newGame, launchBall]);

  // ─── Game Loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;

    const loop = () => {
      if (!running) return;
      const s = state.current;

      // — Plunger charge —
      if (s.plungerHeld && s.plungerPower < PLUNGER_MAX) {
        s.plungerPower = Math.min(PLUNGER_MAX, s.plungerPower + 2.5);
      }

      // — Flipper animation —
      const flipSpeed = 0.35;
      const lTarget = s.leftFlipperUp ? -0.55 : 0.35;
      const rTarget = s.rightFlipperUp ? Math.PI + 0.55 : Math.PI - 0.35;
      s.leftFlipperAngle += (lTarget - s.leftFlipperAngle) * flipSpeed;
      s.rightFlipperAngle += (rTarget - s.rightFlipperAngle) * flipSpeed;

      // — Ball physics —
      if (s.gameState === 'playing') {
        s.ball.vy += GRAVITY;
        s.ball.vx *= FRICTION;
        s.ball.vy *= FRICTION;
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;

        const launchChuteX = TABLE_W - 28;

        // In Launch Chute Check (x > launchChuteX)
        if (s.ball.x >= launchChuteX - 2) {
          // Ball is in or near chute
          // Right wall of chute
          if (s.ball.x + BALL_R > TABLE_W - 8) {
            s.ball.x = TABLE_W - 8 - BALL_R;
            s.ball.vx = -Math.abs(s.ball.vx) * 0.5;
          }
          // Left wall of chute (only below the arch opening y > 60)
          if (s.ball.y > 60 && s.ball.x - BALL_R < launchChuteX) {
            s.ball.x = launchChuteX + BALL_R;
            s.ball.vx = Math.abs(s.ball.vx) * 0.5;
          }
          // Top arch exit (y <= 60) -> curve out into main table!
          if (s.ball.y <= 55) {
            s.ball.vx = -3.8;
            s.ball.vy = Math.min(s.ball.vy, -1.0);
            s.ball.x = launchChuteX - 6;
            playBeep(750, 0.08, 0.08);
          }
        } else {
          // Ball is in MAIN playfield (x < launchChuteX)

          // Top wall
          if (s.ball.y - BALL_R < 8) {
            s.ball.y = 8 + BALL_R;
            s.ball.vy = Math.abs(s.ball.vy) * 0.7;
            playBeep(600, 0.05, 0.05);
          }

          // Left wall
          if (s.ball.x - BALL_R < 8) {
            s.ball.x = 8 + BALL_R;
            s.ball.vx = Math.abs(s.ball.vx) * 0.7;
            playBeep(500, 0.05, 0.05);
          }

          // Right divider (prevent going back into launch lane when y > 60)
          if (s.ball.y > 60 && s.ball.x + BALL_R > launchChuteX) {
            s.ball.x = launchChuteX - BALL_R;
            s.ball.vx = -Math.abs(s.ball.vx) * 0.7;
            playBeep(450, 0.04, 0.04);
          }

          // Guide rail (slanted wall near top left)
          if (s.ball.y < 160 && s.ball.x < 45) {
            const guideX = 16 + (160 - s.ball.y) * 0.15;
            if (s.ball.x - BALL_R < guideX) {
              s.ball.x = guideX + BALL_R;
              s.ball.vx = Math.abs(s.ball.vx) * 0.6 + 0.8;
              playBeep(400, 0.04, 0.04);
            }
          }

          // Bumpers collisions
          for (const b of s.bumpers) {
            const dx = s.ball.x - b.x;
            const dy = s.ball.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < BALL_R + b.r) {
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);
              s.ball.x = b.x + nx * (BALL_R + b.r + 1);
              s.ball.y = b.y + ny * (BALL_R + b.r + 1);
              const speed = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2);
              const bounce = Math.max(speed, 5) * 1.15;
              s.ball.vx = nx * bounce;
              s.ball.vy = ny * bounce;
              b.flash = 8;
              s.score += b.score;
              setScore(s.score);
              playBeep(1200 + Math.random() * 400, 0.1, 0.1);
            }
            if (b.flash > 0) b.flash--;
          }

          // Target collisions
          for (const t of s.targets) {
            if (t.hit) continue;
            if (
              s.ball.x + BALL_R > t.x &&
              s.ball.x - BALL_R < t.x + t.w &&
              s.ball.y + BALL_R > t.y &&
              s.ball.y - BALL_R < t.y + t.h
            ) {
              t.hit = true;
              s.score += t.score;
              setScore(s.score);
              s.ball.vy = -s.ball.vy * 0.5;
              s.ball.vx += (Math.random() - 0.5) * 2;
              playBeep(2000, 0.08, 0.08);
              // Bonus for all SPACE targets
              if (s.targets.every(tt => tt.hit)) {
                s.score += 5000;
                setScore(s.score);
                playBeep(1500, 0.3, 0.15);
                setTimeout(() => s.targets.forEach(tt => { tt.hit = false; }), 1500);
              }
            }
          }

          // Flipper collision detection
          const flipperCheck = (fx: number, fy: number, angle: number, isLeft: boolean) => {
            const ex = fx + Math.cos(angle) * FLIPPER_LEN;
            const ey = fy + Math.sin(angle) * FLIPPER_LEN;
            const lx = ex - fx, ly = ey - fy;
            const len2 = lx * lx + ly * ly;
            let t = ((s.ball.x - fx) * lx + (s.ball.y - fy) * ly) / len2;
            t = Math.max(0, Math.min(1, t));
            const cx = fx + t * lx, cy = fy + t * ly;
            const dx = s.ball.x - cx, dy = s.ball.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < BALL_R + FLIPPER_W / 2) {
              const nx = dx / (dist || 1), ny = dy / (dist || 1);
              s.ball.x = cx + nx * (BALL_R + FLIPPER_W / 2 + 1);
              s.ball.y = cy + ny * (BALL_R + FLIPPER_W / 2 + 1);
              const isUp = isLeft ? s.leftFlipperUp : s.rightFlipperUp;
              if (isUp) {
                s.ball.vy = -Math.abs(s.ball.vy) * 1.4 - 5.5;
                s.ball.vx += isLeft ? 3.0 : -3.0;
                playBeep(750, 0.08, 0.1);
              } else {
                s.ball.vy = -Math.abs(s.ball.vy) * 0.4 - 1.0;
                playBeep(320, 0.05, 0.06);
              }
            }
          };

          const lfx = 55, lfy = TABLE_H - 60;
          const rfx = TABLE_W - 85, rfy = TABLE_H - 60;
          flipperCheck(lfx, lfy, s.leftFlipperAngle, true);
          flipperCheck(rfx, rfy, s.rightFlipperAngle, false);

          // Slingshots (triangular side bumpers)
          if (s.ball.y > TABLE_H - 120 && s.ball.y < TABLE_H - 60) {
            // Left slingshot
            if (s.ball.x > 25 && s.ball.x < 55 && s.ball.x - 25 > (TABLE_H - 60 - s.ball.y) * 0.4) {
              s.ball.vx = Math.abs(s.ball.vx) * 1.2 + 2;
              s.ball.vy = -Math.abs(s.ball.vy) * 0.8 - 2;
              playBeep(900, 0.06, 0.08);
            }
            // Right slingshot
            if (s.ball.x > TABLE_W - 85 && s.ball.x < TABLE_W - 55) {
              s.ball.vx = -Math.abs(s.ball.vx) * 1.2 - 2;
              s.ball.vy = -Math.abs(s.ball.vy) * 0.8 - 2;
              playBeep(900, 0.06, 0.08);
            }
          }

          // Drain check
          if (s.ball.y > TABLE_H + 20) {
            playBeep(200, 0.3, 0.1);
            loseBall();
          }

          // Speed cap
          const spd = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2);
          if (spd > 18) {
            s.ball.vx *= 18 / spd;
            s.ball.vy *= 18 / spd;
          }
        }
      }

      // ── DRAW ──────────────────────────────────────────────────────
      ctx.clearRect(0, 0, TABLE_W, TABLE_H);

      // Table background — deep space gradient
      const bg = ctx.createLinearGradient(0, 0, 0, TABLE_H);
      bg.addColorStop(0, '#05061a');
      bg.addColorStop(0.5, '#0c1030');
      bg.addColorStop(1, '#1a0a30');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, TABLE_W, TABLE_H);

      // Stars
      s.stars.forEach(st => {
        st.b += 0.02;
        const alpha = 0.3 + Math.sin(st.b) * 0.4;
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
        ctx.fill();
      });

      // Grid lines for depth
      ctx.strokeStyle = 'rgba(40, 60, 120, 0.15)';
      ctx.lineWidth = 0.5;
      for (let y = 0; y < TABLE_H; y += 30) {
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(TABLE_W - 8, y);
        ctx.stroke();
      }

      // Table border
      const borderGrad = ctx.createLinearGradient(0, 0, TABLE_W, 0);
      borderGrad.addColorStop(0, '#1a3a6a');
      borderGrad.addColorStop(0.5, '#2a5a9a');
      borderGrad.addColorStop(1, '#1a3a6a');
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, TABLE_W - 6, TABLE_H - 6);

      // Inner glow border
      ctx.strokeStyle = 'rgba(80, 140, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, TABLE_W - 16, TABLE_H - 16);

      // Launch lane
      ctx.fillStyle = 'rgba(30, 20, 60, 0.6)';
      ctx.fillRect(TABLE_W - 28, 60, 20, TABLE_H - 60);
      ctx.strokeStyle = 'rgba(80, 100, 180, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(TABLE_W - 28, 60);
      ctx.lineTo(TABLE_W - 28, TABLE_H);
      ctx.stroke();

      // Arch at top of launch lane
      ctx.strokeStyle = 'rgba(80, 140, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(TABLE_W - 18, 60, 10, Math.PI, 0);
      ctx.stroke();

      // Bumpers
      for (const b of s.bumpers) {
        if (b.flash > 0) {
          const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2);
          glow.addColorStop(0, 'rgba(255, 100, 50, 0.6)');
          glow.addColorStop(1, 'rgba(255, 100, 50, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        const grad = ctx.createRadialGradient(b.x - 3, b.y - 3, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.flash > 0 ? '#ff6644' : '#4488ff');
        grad.addColorStop(0.7, b.flash > 0 ? '#cc3311' : '#2244aa');
        grad.addColorStop(1, b.flash > 0 ? '#881100' : '#112266');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = b.flash > 0 ? '#ffaa66' : '#6699ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r + 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(b.score), b.x, b.y);
      }

      // Drop targets
      for (const t of s.targets) {
        if (t.hit) {
          ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
        } else {
          const tg = ctx.createLinearGradient(t.x, t.y, t.x + t.w, t.y + t.h);
          tg.addColorStop(0, '#ff4466');
          tg.addColorStop(1, '#cc2244');
          ctx.fillStyle = tg;
        }
        ctx.fillRect(t.x, t.y, t.w, t.h);
        ctx.fillStyle = t.hit ? 'rgba(255,255,255,0.3)' : '#fff';
        ctx.font = 'bold 9px Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t.label, t.x + t.w / 2, t.y + t.h / 2);
      }

      // Slingshots (triangular side bumpers)
      ctx.strokeStyle = '#4488cc';
      ctx.lineWidth = 3;
      // Left sling
      ctx.beginPath();
      ctx.moveTo(25, TABLE_H - 120);
      ctx.lineTo(25, TABLE_H - 50);
      ctx.lineTo(55, TABLE_H - 60);
      ctx.closePath();
      ctx.stroke();
      // Right sling
      ctx.beginPath();
      ctx.moveTo(TABLE_W - 53, TABLE_H - 120);
      ctx.lineTo(TABLE_W - 53, TABLE_H - 50);
      ctx.lineTo(TABLE_W - 85, TABLE_H - 60);
      ctx.closePath();
      ctx.stroke();

      // Flippers
      const drawFlipper = (fx: number, fy: number, angle: number, color: string) => {
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(angle);
        const fg = ctx.createLinearGradient(0, -FLIPPER_W / 2, FLIPPER_LEN, FLIPPER_W / 2);
        fg.addColorStop(0, color);
        fg.addColorStop(1, '#999');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.ellipse(0, 0, FLIPPER_W / 2 + 1, FLIPPER_W / 2 + 1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -FLIPPER_W / 2);
        ctx.lineTo(FLIPPER_LEN, -3);
        ctx.lineTo(FLIPPER_LEN, 3);
        ctx.lineTo(0, FLIPPER_W / 2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(FLIPPER_LEN, 0, 3, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawFlipper(55, TABLE_H - 60, s.leftFlipperAngle, '#eee');
      drawFlipper(TABLE_W - 85, TABLE_H - 60, s.rightFlipperAngle, '#eee');

      // Drain opening
      ctx.fillStyle = '#000';
      ctx.fillRect(55, TABLE_H - 12, TABLE_W - 140, 12);

      // Plunger
      const plungerX = TABLE_W - 18;
      const plungerY = TABLE_H - 30;
      ctx.fillStyle = '#666';
      ctx.fillRect(plungerX - 8, plungerY - 50 + s.plungerPower * 0.5, 16, 50);
      // Plunger knob
      const knobGrad = ctx.createRadialGradient(plungerX, plungerY + s.plungerPower * 0.5, 0, plungerX, plungerY + s.plungerPower * 0.5, 10);
      knobGrad.addColorStop(0, '#fff');
      knobGrad.addColorStop(1, '#666');
      ctx.fillStyle = knobGrad;
      ctx.beginPath();
      ctx.arc(plungerX, plungerY + s.plungerPower * 0.5, 10, 0, Math.PI * 2);
      ctx.fill();
      // Power indicator
      if (s.plungerPower > 0) {
        ctx.fillStyle = `hsl(${120 - s.plungerPower * 1.5}, 100%, 50%)`;
        ctx.fillRect(TABLE_W - 6, plungerY - 40, 3, (s.plungerPower / PLUNGER_MAX) * 40);
      }

      // Ball
      if (s.gameState === 'playing' || s.gameState === 'ready' || s.gameState === 'launching') {
        const ballGlow = ctx.createRadialGradient(s.ball.x, s.ball.y, 0, s.ball.x, s.ball.y, BALL_R * 3);
        ballGlow.addColorStop(0, 'rgba(200, 200, 255, 0.4)');
        ballGlow.addColorStop(1, 'rgba(200, 200, 255, 0)');
        ctx.fillStyle = ballGlow;
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, BALL_R * 3, 0, Math.PI * 2);
        ctx.fill();

        const ballGrad = ctx.createRadialGradient(s.ball.x - 2, s.ball.y - 2, 0, s.ball.x, s.ball.y, BALL_R);
        ballGrad.addColorStop(0, '#fff');
        ballGrad.addColorStop(0.6, '#c0c0d0');
        ballGrad.addColorStop(1, '#808090');
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
        ctx.fill();
      }

      // Game over overlay
      if (s.gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, TABLE_W, TABLE_H);
        ctx.fillStyle = '#ff4466';
        ctx.font = 'bold 22px Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', TABLE_W / 2, TABLE_H / 2 - 25);
        ctx.fillStyle = '#fff';
        ctx.font = '12px Tahoma, sans-serif';
        ctx.fillText(`Score: ${s.score}`, TABLE_W / 2, TABLE_H / 2 + 5);
        ctx.fillStyle = '#6699ff';
        ctx.font = '11px Tahoma, sans-serif';
        ctx.fillText('Click New Game or Space to Play', TABLE_W / 2, TABLE_H / 2 + 30);
      }

      s.animFrame = requestAnimationFrame(loop);
    };

    state.current.animFrame = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(state.current.animFrame);
    };
  }, [loseBall, newGame]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (state.current.gameState === 'gameover') {
      newGame();
      return;
    }

    if (x > TABLE_W - 35) {
      // Clicked plunger chute -> launch!
      launchBall(1);
    } else if (x < TABLE_W / 2) {
      // Clicked left side -> pulse left flipper
      state.current.leftFlipperUp = true;
      setTimeout(() => { state.current.leftFlipperUp = false; }, 200);
    } else {
      // Clicked right side -> pulse right flipper
      state.current.rightFlipperUp = true;
      setTimeout(() => { state.current.rightFlipperUp = false; }, 200);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1a1a2e', fontFamily: 'Tahoma, sans-serif', userSelect: 'none' }}>
      {/* Top score bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 10px',
        background: 'linear-gradient(180deg, #2a2a4e 0%, #1a1a30 100%)',
        borderBottom: '1px solid #333',
        fontSize: '11px',
      }}>
        <div style={{ color: '#6699ff' }}>
          Score: <span style={{ color: '#fff', fontWeight: 'bold' }}>{score.toLocaleString()}</span>
        </div>
        <div style={{ color: '#aaa' }}>
          Hi: <span style={{ color: '#ffaa44' }}>{highScore.toLocaleString()}</span>
        </div>
        <div style={{ color: '#aaa' }}>
          Balls: {Array.from({ length: balls }, (_, i) => (
            <span key={i} style={{ color: '#ff4466', marginLeft: '2px' }}>●</span>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: '4px' }}>
        <canvas
          ref={canvasRef}
          width={TABLE_W}
          height={TABLE_H}
          onClick={handleCanvasClick}
          style={{
            border: '1px solid #333',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(60, 80, 200, 0.3)',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Interactive Controls bar with clickable buttons */}
      <div style={{
        padding: '6px 10px',
        background: 'linear-gradient(180deg, #2a2a4e 0%, #1a1a30 100%)',
        borderTop: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '6px',
      }}>
        <button
          className="xp-button"
          onMouseDown={() => { state.current.leftFlipperUp = true; }}
          onMouseUp={() => { state.current.leftFlipperUp = false; }}
          onTouchStart={() => { state.current.leftFlipperUp = true; }}
          onTouchEnd={() => { state.current.leftFlipperUp = false; }}
          style={{ fontSize: '10px', padding: '3px 8px', fontWeight: 'bold' }}
        >
          ◀ Left (Z)
        </button>

        <button
          className="xp-button"
          onClick={() => launchBall(1)}
          onMouseDown={() => {
            if (state.current.gameState === 'ready') {
              state.current.plungerHeld = true;
              state.current.gameState = 'launching';
              setGameState('launching');
            }
          }}
          onMouseUp={() => launchBall()}
          style={{
            fontSize: '10px',
            padding: '3px 12px',
            fontWeight: 'bold',
            background: gameState === 'ready' ? 'linear-gradient(180deg, #5cb85c 0%, #449d44 100%)' : undefined,
            color: gameState === 'ready' ? '#fff' : undefined,
          }}
        >
          🚀 Launch (Space)
        </button>

        <button
          className="xp-button"
          onMouseDown={() => { state.current.rightFlipperUp = true; }}
          onMouseUp={() => { state.current.rightFlipperUp = false; }}
          onTouchStart={() => { state.current.rightFlipperUp = true; }}
          onTouchEnd={() => { state.current.rightFlipperUp = false; }}
          style={{ fontSize: '10px', padding: '3px 8px', fontWeight: 'bold' }}
        >
          Right (M) ▶
        </button>

        <button
          className="xp-button"
          onClick={newGame}
          style={{ fontSize: '9px', padding: '3px 6px' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
