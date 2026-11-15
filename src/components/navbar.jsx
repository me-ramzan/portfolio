import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useScroll, useSpring } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import profileImg from '../assets/images/ramzan.png';
import { INTRO_DELAY } from './preloader';
import { useIsMobile, useIsTiny, useIsTouch, useIsDark, EASE } from '../lib/ui';

/* ---- Edit here ---- */
const SECTIONS = [
  { id: 'about', label: 'About', note: 'Who I am' },
  { id: 'experience', label: 'Experience', note: '4 roles · ~3 yrs' },
  { id: 'projects', label: 'Projects', note: 'Selected work' },
  { id: 'skills', label: 'Skills', note: '28 tools' },
  { id: 'education', label: 'Education', note: 'BSCS · Honors' },
  { id: 'contact', label: 'Contact', note: "Let's talk" },
];
const EMAIL = 'me.ramzan.zulfiqar@gmail.com';
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-ramzan-111576246/' },
  { label: 'GitHub', href: 'https://github.com/me-ramzan' },
];

/* The island is always dark (like the Experience role bar) — premium in both themes */
const INK = '#121018';
const TEXT = '#F4F1EA';
const MUTED = 'rgba(244,241,234,0.5)';
const LINE = 'rgba(244,241,234,0.1)';
const GOLD = '#D7C49E';
const OFFSET = 84; // space left above a section when jumping to it
const SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 };

function goTo(id) {
  const top = id ? document.getElementById(id)?.getBoundingClientRect().top + window.scrollY - OFFSET : 0;
  if (top == null || Number.isNaN(top)) return;
  if (window.lenis?.scrollTo) window.lenis.scrollTo(Math.max(0, top), { duration: 1.3 });
  else window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function useActiveSection() {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(SECTIONS.findIndex((s) => s.id === e.target.id));
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    els.forEach((el) => el && io.observe(el));
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) setActive(-1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return active;
}

/* Gold ring that fills with page progress */
function ProgressRing({ size = 22 }) {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const r = size / 2 - 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={LINE} strokeWidth="2" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" style={{ pathLength: p }} />
    </svg>
  );
}

/* Text that rolls up when it changes */
function Roll({ children, k, style }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', overflow: 'hidden', ...style }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={k}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function MenuIcon({ open }) {
  return (
    <span style={{ position: 'relative', width: 18, height: 12, display: 'inline-block' }} aria-hidden="true">
      <motion.span
        animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, borderRadius: 2, backgroundColor: TEXT }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -5, width: '100%' } : { rotate: 0, y: 0, width: '60%' }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ position: 'absolute', right: 0, bottom: 0, height: 2, borderRadius: 2, backgroundColor: TEXT }}
      />
    </span>
  );
}

export default function Navbar() {
  const isMobile = useIsMobile();
  const isTiny = useIsTiny(); // 320–360px phones: drop the progress ring to save room
  const isTouch = useIsTouch();
  const isDark = useIsDark();
  const avatarBg = isDark ? GOLD : '#343148'; // same as the hero photo background
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  // true for a moment after closing, so the avatar waits for the island to settle
  const [closing, setClosing] = useState(false);
  const closingTimer = useRef(0);
  const closeMenu = () => {
    clearTimeout(closingTimer.current);
    setClosing(true);
    setOpen(false);
    closingTimer.current = setTimeout(() => setClosing(false), 650);
  };
  const openMenu = () => {
    clearTimeout(closingTimer.current);
    setClosing(false);
    setOpen(true);
  };
  useEffect(() => () => clearTimeout(closingTimer.current), []);

  // The hero portrait flies up and lands here as an avatar.
  // Docking is read from <html data-hero-docked> in CSS (set by the Hero in the
  // same frame its flying copy hides), so the swap never skips or doubles a frame.
  // While the menu is busy (open or settling) the flying copy is hidden.
  const busy = open || closing;
  useLayoutEffect(() => {
    document.documentElement.toggleAttribute('data-nav-busy', busy);
    window.dispatchEvent(new CustomEvent('nav-menu', { detail: busy }));
  }, [busy]);
  const [copied, setCopied] = useState(false);

  // Keep the scrollbar's space reserved at all times, so freezing the page
  // never changes its width (a width change re-lays out the whole site and
  // makes GSAP recalculate every locked section mid-animation = jerk)
  useEffect(() => {
    document.documentElement.style.scrollbarGutter = 'stable';
  }, []);

  // Freeze the page + Escape to close while open
  useEffect(() => {
    if (!open) return undefined;
    // With smooth scrolling, pausing Lenis is enough to freeze the page.
    // Without it (touch), block scroll gestures outside the menu instead of
    // setting overflow:hidden — that resizes the mobile viewport / URL bar and
    // makes every ScrollTrigger re-measure = the jerk on open/close.
    const hasLenis = !!window.lenis?.stop;
    if (hasLenis) window.lenis.stop();
    const block = (e) => {
      if (e.target.closest && e.target.closest('[data-lenis-prevent]')) return;
      e.preventDefault();
    };
    if (!hasLenis) {
      document.addEventListener('touchmove', block, { passive: false });
      document.addEventListener('wheel', block, { passive: false });
    }
    const onKey = (e) => e.key === 'Escape' && closeMenu();
    window.addEventListener('keydown', onKey);
    return () => {
      if (hasLenis) window.lenis.start?.();
      document.removeEventListener('touchmove', block);
      document.removeEventListener('wheel', block);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const jump = (id) => {
    if (open) {
      closeMenu();
      setTimeout(() => goTo(id), 420);
    } else goTo(id);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const current = active >= 0 ? SECTIONS[active] : null;
  const panelWidth = isMobile ? 'calc(100vw - 32px)' : 'min(520px, calc(100vw - 32px))';

  return (
    <>
      {/* Dim the page behind the open island */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ position: 'fixed', inset: 0, zIndex: 998, backgroundColor: 'rgba(10,9,14,0.55)' }}
          />
        )}
      </AnimatePresence>

      {/* Top layer: the island, centred */}
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: INTRO_DELAY + 0.25 }}
        style={{
          position: 'fixed',
          // stay clear of the notch / status bar on phones
          top: isMobile ? 'max(12px, env(safe-area-inset-top))' : 18,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isMobile ? '0 16px' : '0 var(--gutter, 6vw)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          pointerEvents: 'none',
        }}
      >
        <LayoutGroup>
          <motion.nav
            layout
            className="nav-island"
            data-open={open ? '' : undefined}
            data-closing={closing && !open ? '' : undefined}
            aria-label="Site"
            transition={SPRING}
            style={{
              position: 'relative',
              pointerEvents: 'auto',
              backgroundColor: INK,
              color: TEXT,
              borderRadius: open ? 28 : 999,
              border: '1px solid rgba(215,196,158,0.18)',
              boxShadow: open ? '0 30px 80px rgba(0,0,0,0.45)' : '0 10px 30px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              width: open ? panelWidth : 'auto',
              transform: 'translateZ(0)',
            }}
          >
            {/* Landing spot for the hero portrait (desktop + mobile).
                Always mounted (never re-created), so opening/closing the menu
                doesn't re-decode the image mid-animation. Sits over "Mr.".
                It's a layout-aware motion element, so it isn't stretched while
                the island resizes. Visibility is handled by CSS below. */}
            <motion.span
              layout
              transition={SPRING}
              data-nav-avatar
              className="nav-avatar"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: isTiny ? 12 : 16,
                top: 10,
                width: 30,
                height: 30,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: avatarBg,
                boxShadow: '0 0 0 1px rgba(215,196,158,0.5)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              <img
                src={profileImg}
                alt=""
                decoding="async"
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
            </motion.span>
            <AnimatePresence mode="popLayout" initial={false}>
              {!open ? (
                /* ---------- Collapsed pill ---------- */
                <motion.div
                  key="pill"
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.25 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  style={{ display: 'flex', alignItems: 'center', height: 50, padding: isTiny ? '0 6px 0 14px' : '0 6px 0 18px', gap: isTiny ? 10 : 14 }}
                >
                  <button
                    type="button"
                    onClick={() => jump(null)}
                    className="mono"
                    aria-label="Back to top"
                    style={{ position: 'relative', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: GOLD, fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.06em' }}
                  >
                    <span className="nav-mr">Mr.</span>
                  </button>

                  {!isTiny && <span style={{ width: 1, height: 18, backgroundColor: LINE }} />}

                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: isMobile ? 0 : 150 }}>
                    {!isTiny && <ProgressRing />}
                    <Roll k={current ? current.id : 'top'} style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '-0.005em' }}>
                      {current ? (
                        <>
                          <span className="mono" style={{ color: GOLD, fontSize: '0.66rem', marginRight: 8, letterSpacing: '0.1em' }}>
                            {String(active + 1).padStart(2, '0')}
                          </span>
                          {current.label}
                        </>
                      ) : (
                        <>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#02b84b', display: 'inline-block', marginRight: 8, alignSelf: 'center' }} />
                          {isMobile ? 'Available' : 'Available for work'}
                        </>
                      )}
                    </Roll>
                  </span>

                  {/* Theme toggle inside the island (desktop + mobile) */}
                  {(
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        backgroundColor: TEXT,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                        marginRight: -6,
                      }}
                    >
                      <span style={{ display: 'inline-flex', transform: 'scale(0.82)' }}>
                        <ThemeToggle />
                      </span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={openMenu}
                    aria-label="Open menu"
                    aria-expanded={false}
                    style={{
                      height: 38,
                      padding: '0 14px',
                      borderRadius: 999,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(244,241,234,0.08)',
                      color: TEXT,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    {!isMobile && <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.16em' }}>MENU</span>}
                    <MenuIcon open={false} />
                  </button>
                </motion.div>
              ) : (
                /* ---------- Expanded island ---------- */
                <motion.div
                  key="panel"
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.14, duration: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  role="dialog"
                  aria-label="Site menu"
                  data-lenis-prevent
                  style={{ padding: isMobile ? '14px 14px 16px' : '16px 18px 18px', maxHeight: 'calc(100svh - 40px)', overflowY: 'auto', overscrollBehavior: 'contain' }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="mono" style={{ color: GOLD, fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.06em' }}>Mr.</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Muhammad Ramzan</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Theme toggle beside the close button */}
                    {(
                      <span
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          backgroundColor: TEXT,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <span style={{ display: 'inline-flex', transform: 'scale(0.82)' }}>
                          <ThemeToggle />
                        </span>
                      </span>
                    )}
                    <motion.button
                      type="button"
                      onClick={closeMenu}
                      aria-label="Close menu"
                      autoFocus
                      whileHover={!isTouch ? { rotate: 90 } : undefined}
                      transition={{ duration: 0.45, ease: EASE }}
                      style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: 'rgba(244,241,234,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <MenuIcon open />
                    </motion.button>
                    </div>
                  </div>

                  {/* Sections */}
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${LINE}` }}>
                    {SECTIONS.map((s, i) => {
                      const on = i === active;
                      return (
                        <motion.li
                          key={s.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: 0.18 + i * 0.04, duration: 0.4, ease: EASE } }}
                          style={{ borderBottom: `1px solid ${LINE}` }}
                        >
                          <motion.button
                            type="button"
                            onClick={() => jump(s.id)}
                            aria-current={on ? 'location' : undefined}
                            whileHover="hover"
                            initial="rest"
                            animate="rest"
                            style={{
                              width: '100%',
                              display: 'grid',
                              gridTemplateColumns: '2.4rem 1fr auto',
                              alignItems: 'center',
                              padding: isMobile ? '12px 6px' : '13px 8px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              color: TEXT,
                              font: 'inherit',
                              position: 'relative',
                            }}
                          >
                            <motion.span
                              aria-hidden="true"
                              variants={{ rest: { opacity: on ? 1 : 0 }, hover: { opacity: 1 } }}
                              transition={{ duration: 0.25 }}
                              style={{ position: 'absolute', inset: '4px 0', borderRadius: 14, backgroundColor: 'rgba(215,196,158,0.08)' }}
                            />
                            <span className="mono" style={{ position: 'relative', fontSize: '0.66rem', letterSpacing: '0.12em', color: on ? GOLD : MUTED }}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <motion.span
                              variants={{ rest: { x: 0 }, hover: { x: 6 } }}
                              transition={{ duration: 0.3, ease: EASE }}
                              style={{ position: 'relative', fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? '1.25rem' : '1.4rem', fontWeight: 700, letterSpacing: '-0.03em' }}
                            >
                              {s.label}
                            </motion.span>
                            <span className="mono" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.6rem', letterSpacing: '0.12em', color: on ? GOLD : MUTED, textTransform: 'uppercase' }}>
                              {on && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: GOLD }} />}
                              {on ? 'You are here' : s.note}
                            </span>
                          </motion.button>
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* Footer: copy email + links */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.45, duration: 0.4 } }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', paddingTop: 14 }}
                  >
                    <motion.button
                      type="button"
                      onClick={copyEmail}
                      whileTap={{ scale: 0.96 }}
                      className="mono"
                      style={{
                        height: 40,
                        padding: '0 16px',
                        borderRadius: 999,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: GOLD,
                        color: INK,
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Roll k={copied ? 'yes' : 'no'}>{copied ? '✓ EMAIL COPIED' : 'COPY EMAIL'}</Roll>
                    </motion.button>
                    <span style={{ display: 'inline-flex', gap: 6 }}>
                      {SOCIALS.map((s) => (
                        <motion.a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ backgroundColor: 'rgba(244,241,234,0.14)' }}
                          className="mono"
                          style={{ height: 40, padding: '0 14px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', fontSize: '0.62rem', letterSpacing: '0.12em', color: TEXT, textDecoration: 'none', backgroundColor: 'rgba(244,241,234,0.06)' }}
                        >
                          {s.label.toUpperCase()}
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 8 }}>
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="8,7 17,7 17,16" />
                          </svg>
                        </motion.a>
                      ))}
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </LayoutGroup>

      </motion.header>

      <style>{`
        /* Avatar ⇄ "Mr." hand-off, driven by <html data-hero-docked> */
        .nav-avatar { opacity: 0; transition: opacity 0.12s ease; }
        .nav-mr { transition: opacity 0.25s ease; }
        /* landing: appear in the same frame the flying copy disappears */
        html[data-hero-docked] .nav-island:not([data-open]) .nav-avatar { opacity: 1; transition: none; }
        /* after closing the menu: wait for the island to shrink back first */
        html[data-hero-docked] .nav-island[data-closing]:not([data-open]) .nav-avatar { transition: opacity 0.25s ease 0.22s; }
        html[data-hero-docked] .nav-mr { opacity: 0; }
        /* never let the flying copy hover over the menu while it opens/closes */
        html[data-nav-busy] .hero-fly-clone { opacity: 0 !important; }
      `}</style>
    </>
  );
}