'use client';

import { useEffect, useRef, useState } from 'react';

const CAPTIONS = [
  'bro really said "skibidi" at the family reunion 💀',
  'no cap this fixed my rizz fr fr',
  'the ohio-ness of this is unreal',
  'sigma grindset: activated 🗿',
  'fanum tax has been collected',
  'let him cook 🍳',
  'gyatt this is crazy',
  'not the mitochondria reference again',
  'brain rot level: certified',
  'it\'s giving main character energy',
];

const COMMENTS = [
  'first 🔥🔥🔥',
  'why is this so real',
  'not me watching at 3am again',
  'the algorithm knew what it was doing',
  'bro cooked with this one 🍳',
  'somebody call the ohio police',
  'ratio + you fell off + skibidi',
];

function formatCount(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

// Original, non-branded pixel "parkour" scene: a blocky runner hopping
// across scrolling platforms. No copyrighted textures or sprites.
function PixelParkour() {
  return (
    <div className="brainrot-parkour">
      <div className="brainrot-parkour-sky" />
      <div className="brainrot-parkour-track">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="brainrot-block" style={{ animationDelay: `${i * -0.4}s` }}>
            <div className="brainrot-block-top" />
            <div className="brainrot-block-side" />
          </div>
        ))}
      </div>
      <div className="brainrot-runner">
        <div className="brainrot-runner-head" />
        <div className="brainrot-runner-body" />
      </div>
    </div>
  );
}

// Original three-lane "endless dash" scene, inspired by the genre but
// built entirely from plain shapes, not a reproduction of any game.
function LaneDash() {
  return (
    <div className="brainrot-lanes">
      <div className="brainrot-lane-lines" />
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={`brainrot-obstacle lane-${i % 3}`}
          style={{ animationDelay: `${i * -0.6}s` }}
        />
      ))}
      <div className="brainrot-dasher">
        <div className="brainrot-dasher-body" />
      </div>
    </div>
  );
}

export default function BrainrotContent() {
  const [captionIndex, setCaptionIndex] = useState(0);
  const [likes, setLikes] = useState(482300);
  const [liked, setLiked] = useState(false);
  const [comments] = useState(9214);
  const [muted, setMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [stillWatching, setStillWatching] = useState(false);
  const watchTime = useRef(0);

  useEffect(() => {
    const capTimer = setInterval(() => {
      setCaptionIndex((i) => (i + 1) % CAPTIONS.length);
    }, 2600);
    const likeTimer = setInterval(() => {
      setLikes((n) => n + Math.floor(Math.random() * 12) + 1);
    }, 1400);
    const watchTimer = setInterval(() => {
      watchTime.current += 1;
      if (watchTime.current === 45) setStillWatching(true);
    }, 1000);
    return () => {
      clearInterval(capTimer);
      clearInterval(likeTimer);
      clearInterval(watchTimer);
    };
  }, []);

  return (
    <div className="brainrot-app">
      <div className="brainrot-topbar">
        <span className={muted ? '' : 'active'} onClick={() => setMuted((m) => !m)} style={{ cursor: 'pointer' }}>
          {muted ? '🔇 Muted' : '🔊 Sound on'}
        </span>
        <span className="brainrot-live-dot" /> For You
      </div>

      <div className="brainrot-stage">
        <div className="brainrot-half">
          <LaneDash />
        </div>
        <div className="brainrot-divider" />
        <div className="brainrot-half">
          <PixelParkour />
        </div>

        {/* Caption overlay */}
        <div className="brainrot-overlay-bottom">
          <div className="brainrot-username">@rizzler_xp · Windows XP Portfolio Ed.</div>
          <div className="brainrot-caption">{CAPTIONS[captionIndex]}</div>
          <div className="brainrot-hashtags">#brainrot #xpcore #nostalgia #fyp</div>
        </div>

        {/* Right action rail, TikTok-style but generic */}
        <div className="brainrot-rail">
          <button
            className={`brainrot-rail-btn ${liked ? 'liked' : ''}`}
            onClick={() => { setLiked((v) => !v); setLikes((n) => n + (liked ? -1 : 1)); }}
          >
            <span>{liked ? '❤️' : '🤍'}</span>
            <small>{formatCount(likes)}</small>
          </button>
          <button className="brainrot-rail-btn" onClick={() => setShowComments((v) => !v)}>
            <span>💬</span>
            <small>{formatCount(comments)}</small>
          </button>
          <button className="brainrot-rail-btn">
            <span>↗️</span>
            <small>Share</small>
          </button>
          <div className="brainrot-rail-disc">💿</div>
        </div>

        {/* Fake progress bar, always looping */}
        <div className="brainrot-progress"><div className="brainrot-progress-fill" /></div>

        {showComments && (
          <div className="brainrot-comments">
            <div className="brainrot-comments-header">
              {formatCount(comments)} comments
              <span onClick={() => setShowComments(false)} style={{ cursor: 'pointer' }}> ✕</span>
            </div>
            {COMMENTS.map((c, i) => (
              <div key={i} className="brainrot-comment">
                <b>user{(i * 37 + 12) % 900}</b> {c}
              </div>
            ))}
          </div>
        )}

        {stillWatching && (
          <div className="brainrot-stillwatching">
            <div className="brainrot-stillwatching-box">
              <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Windows</div>
              <div style={{ marginBottom: 10 }}>Still watching? Your GPA has entered a critical state.</div>
              <button className="xp-button" onClick={() => { setStillWatching(false); watchTime.current = 0; }}>
                Keep scrolling
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .brainrot-app {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #000;
          margin: -8px;
          font-family: Tahoma, sans-serif;
          color: #fff;
        }
        .brainrot-topbar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 4px 8px;
          font-size: 11px;
          background: #111;
          border-bottom: 1px solid #222;
        }
        .brainrot-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ff2d55;
          box-shadow: 0 0 6px #ff2d55;
        }
        .brainrot-stage {
          position: relative;
          flex: 1;
          overflow: hidden;
          background: linear-gradient(180deg, #0b0b12 0%, #000 100%);
        }
        .brainrot-half {
          position: absolute;
          left: 0; right: 0;
          height: 50%;
          overflow: hidden;
        }
        .brainrot-half:first-child { top: 0; }
        .brainrot-half:last-child { bottom: 0; }
        .brainrot-divider {
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 2px;
          background: #ff2d55;
          z-index: 3;
        }

        /* Lane dash scene */
        .brainrot-lanes {
          position: relative;
          width: 100%; height: 100%;
          background: linear-gradient(180deg, #1a2a52 0%, #0e1730 100%);
          overflow: hidden;
        }
        .brainrot-lane-lines {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            90deg, transparent 0 32%, rgba(255,255,255,0.15) 32% 33.5%, transparent 33.5% 66%,
            rgba(255,255,255,0.15) 66% 67.5%, transparent 67.5% 100%
          );
        }
        .brainrot-obstacle {
          position: absolute;
          top: -40px;
          width: 34px; height: 34px;
          border-radius: 6px;
          animation: brainrotFall 3s linear infinite;
        }
        .brainrot-obstacle.lane-0 { left: 12%; background: #ffb020; }
        .brainrot-obstacle.lane-1 { left: 46%; background: #ff5252; }
        .brainrot-obstacle.lane-2 { left: 78%; background: #5ad1ff; }
        @keyframes brainrotFall {
          from { top: -40px; }
          to { top: 110%; }
        }
        .brainrot-dasher {
          position: absolute;
          bottom: 14%;
          left: 46%;
          width: 30px; height: 34px;
          animation: brainrotWeave 1.8s ease-in-out infinite;
        }
        .brainrot-dasher-body {
          width: 100%; height: 100%;
          background: linear-gradient(180deg, #ffe08a, #ff8a3d);
          border-radius: 8px 8px 4px 4px;
          box-shadow: 0 0 10px rgba(255,180,80,0.7);
        }
        @keyframes brainrotWeave {
          0%, 100% { left: 46%; transform: translateY(0); }
          25% { left: 12%; transform: translateY(-4px); }
          50% { left: 46%; transform: translateY(0); }
          75% { left: 78%; transform: translateY(-4px); }
        }

        /* Pixel parkour scene */
        .brainrot-parkour {
          position: relative;
          width: 100%; height: 100%;
          overflow: hidden;
        }
        .brainrot-parkour-sky {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, #7fc8f8 0%, #bfe8ff 60%, #d9f4c8 100%);
        }
        .brainrot-parkour-track {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 46%;
          display: flex;
        }
        .brainrot-block {
          position: relative;
          width: 60px; height: 100%;
          margin-right: 10px;
          flex-shrink: 0;
          animation: brainrotScroll 5.6s linear infinite;
        }
        .brainrot-block-top {
          height: 14px;
          background: #6bbf4a;
          border-bottom: 3px solid #4f9636;
        }
        .brainrot-block-side {
          height: calc(100% - 14px);
          background: repeating-linear-gradient(0deg, #a3703f 0 8px, #8f5f34 8px 16px);
        }
        @keyframes brainrotScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-700px); }
        }
        .brainrot-runner {
          position: absolute;
          left: 28%;
          bottom: 46%;
          width: 22px;
          animation: brainrotHop 0.55s ease-in-out infinite;
        }
        .brainrot-runner-head {
          width: 16px; height: 16px;
          background: #e0a679;
          margin: 0 auto;
          border-radius: 2px;
        }
        .brainrot-runner-body {
          width: 22px; height: 22px;
          background: #3f6fd1;
          border-radius: 2px;
          margin-top: 2px;
        }
        @keyframes brainrotHop {
          0%, 100% { bottom: 46%; }
          50% { bottom: 58%; }
        }

        .brainrot-overlay-bottom {
          position: absolute;
          left: 10px; right: 70px; bottom: 14px;
          z-index: 4;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }
        .brainrot-username { font-weight: bold; font-size: 12px; margin-bottom: 4px; }
        .brainrot-caption { font-size: 12px; margin-bottom: 4px; min-height: 32px; }
        .brainrot-hashtags { font-size: 11px; color: #cfe8ff; }

        .brainrot-rail {
          position: absolute;
          right: 10px; bottom: 14px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .brainrot-rail-btn {
          background: none; border: none; color: #fff;
          display: flex; flex-direction: column; align-items: center;
          font-size: 20px; cursor: pointer;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.7));
        }
        .brainrot-rail-btn small { font-size: 10px; margin-top: 2px; }
        .brainrot-rail-btn.liked span { animation: brainrotPop 0.3s ease; }
        @keyframes brainrotPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .brainrot-rail-disc {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #222;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          animation: brainrotSpin 3s linear infinite;
          border: 2px solid #fff;
        }
        @keyframes brainrotSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .brainrot-progress {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 3px;
          background: rgba(255,255,255,0.2);
          z-index: 5;
        }
        .brainrot-progress-fill {
          height: 100%;
          background: #fff;
          animation: brainrotProgress 9s linear infinite;
        }
        @keyframes brainrotProgress {
          from { width: 0%; }
          to { width: 100%; }
        }

        .brainrot-comments {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 44%;
          background: rgba(20,20,20,0.94);
          padding: 8px;
          overflow-y: auto;
          font-size: 11px;
          z-index: 6;
        }
        .brainrot-comments-header {
          display: flex; justify-content: space-between;
          font-weight: bold; margin-bottom: 8px;
          border-bottom: 1px solid #333; padding-bottom: 6px;
        }
        .brainrot-comment { margin-bottom: 8px; line-height: 1.4; }

        .brainrot-stillwatching {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 7;
        }
        .brainrot-stillwatching-box {
          background: #ece9d8;
          color: #000;
          border: 2px solid #0a246a;
          border-radius: 4px;
          padding: 16px;
          width: 240px;
          font-size: 11px;
          box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
