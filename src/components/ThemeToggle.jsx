import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Your theme palette
const INK = '#343148';  // dark
const SAND = '#D7C49E'; // light

const ICON_SIZE = 'clamp(24px, 1.2vw + 16px, 32px)';

// One smooth curve shared by both icons so they move in sync
const EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // soft overshoot
const DURATION = '0.5s';

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <line x1="12" y1="1.5" x2="12" y2="3.5" />
      <line x1="12" y1="20.5" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="3.5" y2="12" />
      <line x1="20.5" y1="12" x2="22.5" y2="12" />
      <line x1="4.6" y1="4.6" x2="6" y2="6" />
      <line x1="18" y1="18" x2="19.4" y2="19.4" />
      <line x1="4.6" y1="19.4" x2="6" y2="18" />
      <line x1="18" y1="6" x2="19.4" y2="4.6" />
    </svg>
  );
}

// Both icons sit on top of each other; the visible one is upright and full size,
// the hidden one is turned, shrunk and faded. Switching theme just swaps which
// is which, and CSS cross-fades them in one smooth motion (no sudden swap).
function iconStyle(visible, hiddenRotate) {
  return {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: visible ? 1 : 0,
    transform: visible ? 'rotate(0deg) scale(1)' : `rotate(${hiddenRotate}deg) scale(0.5)`,
    transition: `opacity ${DURATION} ease, transform ${DURATION} ${EASE}`,
  };
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const busyRef = useRef(false);
  const tiltRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Switch the theme with the page-wide colour fade from index.css
  const switchSmoothly = (next) => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    setTheme(next);
    setTimeout(() => root.classList.remove('theme-transition'), 600);
  };

  const handleClick = () => {
    if (busyRef.current) return;
    const next = theme === 'dark' ? 'light' : 'dark';

    // Reduced motion: no tilt, just switch
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      switchSmoothly(next);
      return;
    }

    busyRef.current = true;

    // The tilt: the whole icon turns a little and dips in size,
    // then settles back upright with a soft bounce. The icons
    // cross-fade inside it at the same time, so there's no jump.
    gsap
      .timeline({ onComplete: () => (busyRef.current = false) })
      .to(tiltRef.current, { rotate: 40, scale: 0.85, duration: 0.15, ease: 'power2.out' })
      .add(() => switchSmoothly(next))
      .to(tiltRef.current, { rotate: 0, scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleClick}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle light/dark mode"
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        lineHeight: 0,
      }}
    >
      <span
        ref={tiltRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          width: ICON_SIZE,
          height: ICON_SIZE,
        }}
      >
        {/* Moon (shown in light mode): spins out one way */}
        <MoonIcon style={{ ...iconStyle(!isDark, -90), color: INK }} />
        {/* Sun (shown in dark mode): spins in from the other way */}
        <SunIcon style={{ ...iconStyle(isDark, 90), color: SAND }} />
      </span>
    </button>
  );
}