// Singleton Web Audio Sound Engine for Windows XP Portfolio
// Solves AudioContext leak / exhaustion by sharing a single lazy-resumed context.

type XPSoundType =
  | 'startup'
  | 'shutdown'
  | 'ding'
  | 'error'
  | 'exclamation'
  | 'asterisk'
  | 'hardware_insert'
  | 'hardware_remove'
  | 'balloon'
  | 'recycle_empty'
  | 'pinball_bumper'
  | 'pinball_flipper'
  | 'pinball_target'
  | 'pinball_plunger'
  | 'pinball_drain'
  | 'msn_receive'
  | 'msn_send'
  | 'msn_nudge';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5; // 0.0 to 1.0

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('xp_sound_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
      const storedVol = localStorage.getItem('xp_sound_volume');
      if (storedVol !== null) {
        this.volume = Math.max(0, Math.min(1, parseFloat(storedVol) || 0.5));
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('xp_sound_muted', muted ? 'true' : 'false');
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('xp_sound_volume', this.volume.toString());
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public play(type: XPSoundType, customVolMultiplier = 1.0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterVol = this.volume * customVolMultiplier;

      switch (type) {
        case 'startup': {
          // Classic Windows XP Startup Chime (Eb4 -> Bb4 -> G4 -> Bb4 -> C5 -> Eb5)
          const notes = [
            { f: 311.13, t: 0.0, d: 1.2 },
            { f: 466.16, t: 0.15, d: 1.1 },
            { f: 392.00, t: 0.35, d: 1.3 },
            { f: 466.16, t: 0.55, d: 1.2 },
            { f: 523.25, t: 0.8, d: 1.8 },
            { f: 622.25, t: 0.8, d: 2.0 },
          ];
          notes.forEach(({ f, t, d }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + t);
            gain.gain.setValueAtTime(0.0001, now + t);
            gain.gain.exponentialRampToValueAtTime(0.18 * masterVol, now + t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + t);
            osc.stop(now + t + d + 0.1);
          });
          break;
        }

        case 'shutdown': {
          // Classic Windows XP Shutdown Chime (C5 -> Bb4 -> G4 -> Eb4)
          const notes = [
            { f: 523.25, t: 0.0, d: 0.7 },
            { f: 466.16, t: 0.2, d: 0.7 },
            { f: 392.00, t: 0.45, d: 0.8 },
            { f: 311.13, t: 0.7, d: 1.5 },
          ];
          notes.forEach(({ f, t, d }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + t);
            gain.gain.setValueAtTime(0.0001, now + t);
            gain.gain.exponentialRampToValueAtTime(0.15 * masterVol, now + t + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + t);
            osc.stop(now + t + d + 0.1);
          });
          break;
        }

        case 'ding': {
          // Windows XP Ding
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, now); // B5
          gain.gain.setValueAtTime(0.2 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.55);
          break;
        }

        case 'error': {
          // Windows XP Critical Stop (Low 2-tone chord)
          const freqs = [150, 185];
          freqs.forEach(f => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(0.15 * masterVol, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.38);
          });
          break;
        }

        case 'exclamation': {
          // Windows XP Exclamation (Upward bright arpeggio)
          [600, 900].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.08);
            gain.gain.setValueAtTime(0.18 * masterVol, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.28);
          });
          break;
        }

        case 'asterisk': {
          // Windows XP Asterisk
          const notes = [
            { f: 523.25, t: 0.0, d: 0.12 },
            { f: 659.25, t: 0.1, d: 0.25 },
          ];
          notes.forEach(({ f, t, d }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + t);
            gain.gain.setValueAtTime(0.15 * masterVol, now + t);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + t);
            osc.stop(now + t + d + 0.05);
          });
          break;
        }

        case 'hardware_insert': {
          [587, 880].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.12);
            gain.gain.setValueAtTime(0.12 * masterVol, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.2);
          });
          break;
        }

        case 'hardware_remove': {
          [880, 587].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.12);
            gain.gain.setValueAtTime(0.12 * masterVol, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.2);
          });
          break;
        }

        case 'balloon': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1046.5, now);
          gain.gain.setValueAtTime(0.1 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'recycle_empty': {
          // Crinkly paper noise
          const bufferSize = Math.floor(ctx.sampleRate * 0.3);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.12 * masterVol, now);
          noise.connect(gain);
          gain.connect(ctx.destination);
          noise.start(now);
          break;
        }

        case 'pinball_bumper': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
          gain.gain.setValueAtTime(0.14 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case 'pinball_flipper': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now);
          gain.gain.setValueAtTime(0.1 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'pinball_target': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.12 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'pinball_plunger': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100, now);
          osc.frequency.linearRampToValueAtTime(600, now + 0.15);
          gain.gain.setValueAtTime(0.12 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.17);
          break;
        }

        case 'pinball_drain': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(80, now + 0.4);
          gain.gain.setValueAtTime(0.15 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.48);
          break;
        }

        case 'msn_receive': {
          // Classic MSN 2-tone alert chime (F5 -> A5)
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.frequency.setValueAtTime(698.46, now);
          gain1.gain.setValueAtTime(0.14 * masterVol, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.16);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.frequency.setValueAtTime(880.00, now + 0.08);
          gain2.gain.setValueAtTime(0.16 * masterVol, now + 0.08);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now + 0.08);
          osc2.stop(now + 0.32);
          break;
        }

        case 'msn_send': {
          // Gentle outgoing pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);
          gain.gain.setValueAtTime(0.12 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'msn_nudge': {
          // Buzz vibration
          for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(85, now + i * 0.1);
            gain.gain.setValueAtTime(0.2 * masterVol, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.09);
          }
          break;
        }
      }
    } catch {
      // Audio autoplay policy or device failure - gracefully ignore
    }
  }

  public playPinballBeep(freq: number, dur: number, vol = 0.12) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(vol * this.volume, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch {
      // Silent catch
    }
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
