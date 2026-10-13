import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

function useIsDark() {
  const read = () => {
    const root = document.documentElement;
    const attr = root.getAttribute('data-theme');
    if (attr) return attr === 'dark';
    if (root.classList.contains('dark')) return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const [isDark, setIsDark] = useState(read);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDark(read());
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    mq.addEventListener('change', update);
    return () => { mo.disconnect(); mq.removeEventListener('change', update); };
  }, []);
  return isDark;
}

const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

// Shared size for the hamburger button
const CONTROL_H = 44;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = useIsDark();
  const t = isDark
    ? { navBg: 'rgba(18, 16, 24, 0.92)', border: '#343148', text: '#F4F1EA', logo: '#D7C49E', btnBg: '#D7C49E', btnText: '#121018', btnHover: '#F4F1EA', overlay: '#121018' }
    : { navBg: 'rgba(244, 241, 234, 0.92)', border: '#D1D1C7', text: '#080808', logo: '#343148', btnBg: '#343148', btnText: '#F4F1EA', btnHover: '#000000', overlay: '#F4F1EA' };

  // Check if the screen is mobile, so Hire Me shows inside the menu on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const wasOpen = menuOpen;
    closeMenu();

    const scrollToTarget = () => {
      const targetId = href.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navbarHeight = 64;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    };

    if (wasOpen) {
      setTimeout(scrollToTarget, 50);
    } else {
      scrollToTarget();
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 6vw',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: scrolled || menuOpen ? t.navBg : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? `1px solid ${t.border}` : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <a
        href="#top"
        onClick={(e) => handleNavClick(e, '#top')}
        className="mono"
        style={{ color: t.logo, fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textDecoration: 'none', zIndex: 1001, position: 'relative' }}
      >
        Mr.
      </a>

      {/* Right side: hamburger, then theme toggle on the far right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1001 }}>
        {/* Hamburger: plain lines, no circle */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          style={{
            width: CONTROL_H,
            height: CONTROL_H,
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            color: t.text,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: 0,
            zIndex: 1001,
            position: 'relative',
          }}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            style={{ width: '24px', height: '2px', backgroundColor: t.text, display: 'block' }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            style={{ width: '24px', height: '2px', backgroundColor: t.text, display: 'block' }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            style={{ width: '24px', height: '2px', backgroundColor: t.text, display: 'block' }}
          />
        </button>

        {/* Theme toggle: right of the menu; fades out and can't be clicked while the menu is open */}
        <motion.span
          animate={{ opacity: menuOpen ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-flex', pointerEvents: menuOpen ? 'none' : 'auto' }}
          aria-hidden={menuOpen}
        >
          <ThemeToggle />
        </motion.span>
      </div>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.3 } }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: '100vh',
              backgroundColor: t.overlay,
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0rem',
              padding: '0 6vw',
              overflow: 'hidden',
            }}
          >
            {navLinks.map((link, i) => (
              <div key={link.label} style={{ overflow: 'hidden', padding: '0px 0' }}>
                <motion.a
                  initial={{ y: '110%' }}
                  animate={{ y: 0, transition: { delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ y: '-110%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    display: 'inline-block',
                    color: t.text,
                    textDecoration: 'none',
                    fontSize: 'clamp(2rem, 8vw, 2.8rem)',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.29,
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.6'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {link.label}
                </motion.a>
              </div>
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}