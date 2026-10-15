import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile, useIsDark, EASE } from '../lib/ui';

/* ---- Your links (edit here) ---- */
const NAME = 'Muhammad Ramzan';
const TAGLINE = 'All rights reserved';
const LINKS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/muhammad-ramzan-111576246/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/me-ramzan',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:me.ramzan.zulfiqar@gmail.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

const GOLD = '#D7C49E';

function getTheme(isDark) {
  return isDark
    ? { bg: '#121018', border: '#343148', text: '#F4F1EA', muted: 'rgba(244,241,234,0.55)', ring: 'rgba(244,241,234,0.22)', hover: GOLD, hoverText: '#121018' }
    : { bg: '#D7C49E', border: '#1A1A1A', text: '#121018', muted: 'rgba(18,16,24,0.6)', ring: 'rgba(18,16,24,0.28)', hover: '#343148', hoverText: '#F4F1EA' };
}

/* Scrolls through Lenis when available (no fighting with smooth scroll) */
function scrollToTop(e) {
  e.preventDefault();
  if (window.lenis && typeof window.lenis.scrollTo === 'function') {
    window.lenis.scrollTo(0, { duration: 1.4 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* Circle-outline up arrow (arrow-up-circle) */
function CircleArrowUp({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22" />
      <line x1="24" y1="34" x2="24" y2="14" />
      <polyline points="16,22 24,14 32,22" />
    </svg>
  );
}

function BackToTop({ t, showLabel }) {
  return (
    <motion.a
      href="#top"
      onClick={scrollToTop}
      aria-label="Back to top"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      className="mono"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: t.text, textDecoration: 'none' }}
    >
      <motion.span
        variants={{ rest: { y: 0, color: t.text }, hover: { y: -3, color: t.hover } }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ display: 'inline-flex' }}
      >
        <CircleArrowUp />
      </motion.span>
      {showLabel && (
        <motion.span
          variants={{ rest: { x: 0, color: t.text }, hover: { x: 3, color: t.hover } }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{ fontSize: '0.62rem', letterSpacing: '0.16em', fontWeight: 600 }}
        >
          BACK TO TOP
        </motion.span>
      )}
    </motion.a>
  );
}

function SocialLinks({ t }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {LINKS.map((l) => (
        <motion.a
          key={l.id}
          href={l.href}
          target={l.href.startsWith('http') ? '_blank' : undefined}
          rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={l.label}
          title={l.label}
          initial={false}
          whileHover={{ y: -3, backgroundColor: t.hover, color: t.hoverText, borderColor: t.hover }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${t.ring}`,
            backgroundColor: 'rgba(0,0,0,0)',
            color: t.text,
            textDecoration: 'none',
          }}
        >
          {l.icon}
        </motion.a>
      ))}
    </div>
  );
}

export default function Footer() {
  const isMobile = useIsMobile();
  const t = getTheme(useIsDark());
  const year = new Date().getFullYear();

  const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
  };

  const credit = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: t.text }}>
        {NAME}
      </span>
      <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: t.muted, textTransform: 'uppercase' }}>
        © {year} · {TAGLINE}
      </span>
    </div>
  );

  if (isMobile) {
    return (
      <footer style={{ backgroundColor: t.bg, borderTop: `1px solid ${t.border}`, padding: '2.5rem 6vw 2.25rem' }}>
        <motion.div
          {...reveal}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <SocialLinks t={t} />
          {credit}
          <BackToTop t={t} showLabel />
        </motion.div>
      </footer>
    );
  }

  return (
    <footer style={{ backgroundColor: t.bg, borderTop: `1px solid ${t.border}`, padding: '2.25rem 6vw' }}>
      <motion.div
        {...reveal}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem' }}
      >
        <div style={{ justifySelf: 'start' }}>
          <BackToTop t={t} showLabel />
        </div>
        {credit}
        <div style={{ justifySelf: 'end' }}>
          <SocialLinks t={t} />
        </div>
      </motion.div>
    </footer>
  );
}