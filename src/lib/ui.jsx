/**
 * Shared UI foundation for the portfolio.
 * Put this file at: src/lib/ui.jsx
 *
 * - useIsDark / useIsMobile: ONE shared listener for the whole site
 *   (before, every section and every card created its own observers).
 * - usePrefersReducedMotion + <SiteMotion>: respects the OS "reduce motion" setting
 *   for Framer Motion, GSAP and CSS animations.
 * - BRAND: the official colour palette, so no off-brand colours creep in.
 * - <SectionLabel>: one consistent "01 / ABOUT" header style for every section.
 */
import React, { useEffect, useSyncExternalStore } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import gsap from 'gsap';

/* ------------------------------------------------------------------ */
/* Brand tokens                                                        */
/* ------------------------------------------------------------------ */
export const BRAND = {
  gold: '#D7C49E',
  plum: '#343148',
  plumLight: '#4a4566',
  ink: '#121018',
  inkSoft: '#1d1a28',
  paper: '#F4F1EA',
  black: '#080808',
  green: '#02b84b',
};

export const EASE = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/* Dark mode — single shared observer                                  */
/* ------------------------------------------------------------------ */
const readDark = () => {
  if (typeof document === 'undefined') return false;
  const root = document.documentElement;
  const attr = root.getAttribute('data-theme');
  if (attr) return attr === 'dark';
  if (root.classList.contains('dark')) return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

let darkValue;
const darkListeners = new Set();
let stopDarkWatch = null;

function subscribeDark(callback) {
  darkListeners.add(callback);
  if (darkListeners.size === 1) {
    darkValue = readDark();
    const update = () => {
      const next = readDark();
      if (next !== darkValue) {
        darkValue = next;
        darkListeners.forEach((l) => l());
      }
    };
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', update);
    stopDarkWatch = () => {
      mo.disconnect();
      mq.removeEventListener('change', update);
    };
  }
  return () => {
    darkListeners.delete(callback);
    if (darkListeners.size === 0 && stopDarkWatch) {
      stopDarkWatch();
      stopDarkWatch = null;
    }
  };
}

const getDark = () => {
  if (darkValue === undefined) darkValue = readDark();
  return darkValue;
};

export function useIsDark() {
  return useSyncExternalStore(subscribeDark, getDark, () => false);
}

/* ------------------------------------------------------------------ */
/* Media queries — shared MediaQueryList per query                     */
/* ------------------------------------------------------------------ */
const mqlCache = new Map();
const getMql = (query) => {
  if (!mqlCache.has(query)) mqlCache.set(query, window.matchMedia(query));
  return mqlCache.get(query);
};

export function useMediaQuery(query, serverFallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = getMql(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => getMql(query).matches,
    () => serverFallback
  );
}

/** Same behaviour as before (width <= breakpoint), without a resize listener per component. */
export const useIsMobile = (breakpoint = 768) => useMediaQuery(`(max-width: ${breakpoint}px)`);

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/* ------------------------------------------------------------------ */
/* Site-wide motion settings                                           */
/* ------------------------------------------------------------------ */
/**
 * Wrap <App /> with this once (in main.jsx).
 * When the visitor has "reduce motion" turned on:
 *  - Framer Motion skips movement (keeps gentle fades)
 *  - GSAP animations finish almost instantly
 *  - CSS animations (marquees, pulses) stop looping
 */
export function SiteMotion({ children }) {
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    gsap.globalTimeline.timeScale(reduce ? 40 : 1);
  }, [reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        :focus-visible { outline: 2px solid ${BRAND.gold}; outline-offset: 3px; }
      `}</style>
      {children}
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/* Consistent section label                                            */
/* ------------------------------------------------------------------ */
/**
 * <SectionLabel index="02" title="Experience" color={t.text} accent={t.accent} />
 * One size, one spacing, one underline style across every section.
 */
export function SectionLabel({ index, title, color, accent, aside, style }) {
  return (
    <div style={{ marginBottom: '2.5rem', ...style }}>
      <div
        className="mono"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.75rem', letterSpacing: '0.15em', color }}
      >
        <span>
          {index} / {String(title).toUpperCase()}
        </span>
        {aside && <span style={{ opacity: 0.6 }}>{aside}</span>}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ width: 32, height: 2, backgroundColor: accent, marginTop: 12, transformOrigin: 'left' }}
      />
    </div>
  );
}