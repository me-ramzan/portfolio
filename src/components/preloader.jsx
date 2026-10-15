import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/* Timing — decided once when the app loads, shared with the Hero      */
/* ------------------------------------------------------------------ */
const SEEN_KEY = 'mr-intro-seen-v2';

// While developing (npm run dev) the full intro ALWAYS plays.
// On the live site it plays once per tab; add ?intro to the URL to force it.
const IS_DEV = (() => {
  try {
    return Boolean(import.meta.env && import.meta.env.DEV);
  } catch {
    return false;
  }
})();

const readFirstVisit = () => {
  try {
    if (IS_DEV || new URLSearchParams(window.location.search).has('intro')) return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !window.sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
};

const FIRST_VISIT = typeof window !== 'undefined' ? readFirstVisit() : true;
const NARROW = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

const FILL_MS = 1650; // counter 0 → 100 while the name decodes
const HOLD_MS = 220; // beat at 100
const COLS = NARROW ? 4 : 6; // curtain panels
const COL_STAGGER = 0.06;
const NAVY_DELAY = 0.28; // navy panels start lifting after the name leaves
const GOLD_DELAY = 0.44; // gold panels follow
const PANEL_DUR = 0.8;
const QUICK_FADE = 0.45; // repeat visits / reduced motion

/** Seconds until the Hero should start animating in (Hero imports this). */
export const INTRO_DELAY = FIRST_VISIT ? (FILL_MS + HOLD_MS) / 1000 + GOLD_DELAY + 0.15 : 0.25;

const TOTAL_LEAVE_MS = (GOLD_DELAY + (COLS - 1) * COL_STAGGER + PANEL_DUR) * 1000 + 60;

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */
const NAME = ['MUHAMMAD', 'RAMZAN'];
const WORDS = ['AI AUTOMATION', 'ENTERPRISE RPA', 'FULL-STACK WEB', 'AI AUTOMATION & SOFTWARE ENGINEER'];
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/#*+%&';
const BG = '#121018';
const GOLD = '#D7C49E';
const TEXT = '#F4F1EA';
const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_INOUT = [0.76, 0, 0.24, 1];

/* Each letter's decode moment (ms from start) */
const LETTERS = NAME.join(' ').split('');
const revealAt = (i) => 260 + i * 62;

/* Pause smooth scrolling while the loader is up */
function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    try {
      window.history.scrollRestoration = 'manual';
    } catch {}
    window.scrollTo(0, 0);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    // Lenis is created in App's effect (after ours) — catch it when it appears
    let raf = 0;
    let stopped = null;
    const grab = () => {
      if (window.lenis && !stopped) {
        stopped = window.lenis;
        stopped.stop();
        return;
      }
      raf = requestAnimationFrame(grab);
    };
    raf = requestAnimationFrame(grab);

    return () => {
      cancelAnimationFrame(raf);
      html.style.overflow = prevOverflow;
      if (stopped) stopped.start();
      else if (window.lenis) window.lenis.start();
    };
  }, [active]);
}

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('play'); // play → leave → gone
  const [elapsed, setElapsed] = useState(0);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useScrollLock(phase !== 'gone');

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {}

    const timers = [];
    const finish = (ms) =>
      timers.push(
        setTimeout(() => {
          setPhase('gone');
          doneRef.current?.();
        }, ms)
      );

    if (!FIRST_VISIT) {
      setPhase('leave');
      finish(QUICK_FADE * 1000 + 50);
      return () => timers.forEach(clearTimeout);
    }

    let raf = 0;
    let last = 0;
    const start = performance.now();
    const tick = (now) => {
      const e = now - start;
      // ~30fps is plenty for the scramble and keeps React work light
      if (now - last > 32 || e >= FILL_MS) {
        last = now;
        setElapsed(Math.min(e, FILL_MS));
      }
      if (e < FILL_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        timers.push(setTimeout(() => setPhase('leave'), HOLD_MS));
        finish(HOLD_MS + TOTAL_LEAVE_MS);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (phase === 'gone') return null;
  const leaving = phase === 'leave';

  /* Repeat visit: quick fade */
  if (!FIRST_VISIT) {
    return (
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: QUICK_FADE, ease: 'easeOut' }}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: BG, pointerEvents: 'none' }}
      />
    );
  }

  const t = elapsed / FILL_MS;
  const progress = Math.round((1 - Math.pow(1 - t, 3)) * 100);
  const word = WORDS[Math.min(WORDS.length - 1, Math.floor(t * WORDS.length))];

  // Build the scrambled name for this frame
  const shown = LETTERS.map((ch, i) => {
    if (ch === ' ') return ' ';
    if (elapsed >= revealAt(i)) return ch;
    if (elapsed < revealAt(i) - 520) return '';
    return GLYPHS[(Math.floor(elapsed / 45) + i * 7) % GLYPHS.length];
  });

  const nameStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: NARROW ? 'clamp(2.6rem, 13.5vw, 4.5rem)' : 'clamp(3.2rem, 8.4vw, 8.5rem)',
    letterSpacing: '-0.045em',
    lineHeight: 0.92,
  };

  let idx = 0;
  const lines = NAME.map((line, li) => {
    const chars = line.split('').map(() => {
      const i = idx++;
      return { i, c: shown[i], done: elapsed >= revealAt(i) };
    });
    if (li === 0) idx++; // skip the space
    return chars;
  });

  return (
    <div
      role="status"
      aria-label={`Loading, ${progress}%`}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: leaving ? 'none' : 'auto' }}
    >
      {/* Curtain: gold panels behind navy panels; both lift in a stagger */}
      {['gold', 'navy'].map((layer) => (
        <div key={layer} aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {Array.from({ length: COLS }).map((_, c) => (
            <motion.div
              key={c}
              initial={false}
              animate={{ y: leaving ? '-101%' : '0%' }}
              transition={{
                duration: PANEL_DUR,
                ease: EASE_INOUT,
                delay: leaving ? (layer === 'navy' ? NAVY_DELAY : GOLD_DELAY) + c * COL_STAGGER : 0,
              }}
              style={{
                flex: 1,
                height: '100%',
                marginRight: -1, // no hairline gaps between panels
                backgroundColor: layer === 'navy' ? BG : GOLD,
                willChange: 'transform',
              }}
            />
          ))}
        </div>
      ))}

      {/* Content */}
      <motion.div
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.35, delay: leaving ? 0.15 : 0 }}
        style={{ position: 'absolute', inset: 0, color: TEXT, padding: NARROW ? '22px 6vw' : '34px 6vw', boxSizing: 'border-box' }}
      >
        {/* Corners */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
          className="mono"
          style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', letterSpacing: '0.18em', color: 'rgba(244,241,234,0.55)' }}
        >
          <span style={{ color: TEXT, fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.85rem' }}>Mr.</span>
          <span>PORTFOLIO · ©{new Date().getFullYear()}</span>
          {!NARROW && <span>DUBAI · UAE</span>}
        </motion.div>

        {/* Name (decodes letter by letter) */}
        <div
          style={{
            position: 'absolute',
            left: '6vw',
            right: '6vw',
            top: '50%',
            transform: 'translateY(-58%)',
          }}
        >
          {lines.map((chars, li) => (
            <div key={li} style={{ overflow: 'hidden', paddingBottom: '0.06em', whiteSpace: 'nowrap' }}>
              {chars.map(({ i, c, done }) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%' }}
                  animate={{ y: leaving ? '-115%' : '0%' }}
                  transition={
                    leaving
                      ? { duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: i * 0.018 }
                      : { duration: 0.6, ease: EASE_OUT, delay: Math.max(0, revealAt(i) - 520) / 1000 }
                  }
                  style={{
                    ...nameStyle,
                    display: 'inline-block',
                    minWidth: '0.3em',
                    color: done ? TEXT : GOLD,
                    opacity: c ? 1 : 0,
                    transition: 'color 0.25s',
                  }}
                >
                  {c || ' '}
                </motion.span>
              ))}
            </div>
          ))}

          {/* Cycling role line */}
          <div className="mono" style={{ marginTop: '1.4rem', height: '1.2em', overflow: 'hidden', fontSize: 'clamp(0.62rem, 1.4vw, 0.78rem)', letterSpacing: '0.2em', color: 'rgba(244,241,234,0.62)' }}>
            <motion.div key={word} initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 0.35, ease: EASE_OUT }}>
              <span style={{ color: GOLD }}>— </span>
              {word}
            </motion.div>
          </div>
        </div>

        {/* Big outlined counter + progress line */}
        <div style={{ position: 'absolute', left: '6vw', right: '6vw', bottom: NARROW ? 22 : 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: NARROW ? '4.5rem' : 'clamp(5rem, 12vw, 11rem)',
                lineHeight: 0.8,
                letterSpacing: '-0.06em',
                color: 'transparent',
                WebkitTextStroke: `1.2px ${GOLD}`,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(progress).padStart(2, '0')}
            </span>
            <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(244,241,234,0.5)', paddingBottom: 6 }}>
              {progress < 100 ? 'INITIALISING' : 'READY'}
            </span>
          </div>
          <div style={{ marginTop: 14, height: 1, backgroundColor: 'rgba(244,241,234,0.12)' }}>
            <div style={{ height: '100%', backgroundColor: GOLD, transform: `scaleX(${progress / 100})`, transformOrigin: 'left center' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}