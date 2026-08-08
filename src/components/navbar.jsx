import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
        backgroundColor: scrolled || menuOpen ? 'rgba(244, 241, 234, 0.92)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid #D1D1C7' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <a
        href="#top"
        onClick={(e) => handleNavClick(e, '#top')}
        className="mono"
        style={{ color: '#343148', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textDecoration: 'none', zIndex: 1001, position: 'relative' }}
      >
        Mr.
      </a>

      {isMobile ? (
        <>
          {/* Hamburger icon */}
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              padding: '8px',
              zIndex: 1001,
              position: 'relative',
            }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              style={{ width: '24px', height: '2px', backgroundColor: '#080808', display: 'block' }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              style={{ width: '24px', height: '2px', backgroundColor: '#080808', display: 'block' }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              style={{ width: '24px', height: '2px', backgroundColor: '#080808', display: 'block' }}
            />
          </button>

          {/* Full-screen mobile menu overlay */}
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
                  backgroundColor: '#F4F1EA',
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
                      color: '#080808',
                      textDecoration: 'none',
                      fontSize: 'clamp(2rem, 8vw, 2.8rem)',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.29,
                      textAlign: 'center',
                    }}
                    >
                      {link.label}
                    </motion.a>
                  </div>
                ))}
                <div style={{ overflow: 'hidden', marginTop: '1.5rem' }}>
                  <motion.a
                    initial={{ y: '110%' }}
                    animate={{ y: 0, transition: { delay: 0.15 + navLinks.length * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                    exit={{ y: '-110%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                    href="mailto:me.ramzan.zulfiqar@gmail.com"
                    onClick={closeMenu}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#343148',
                      color: '#F4F1EA',
                      padding: '12px 45px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 800,
                      textDecoration: 'none',
                      letterSpacing: '0.06em',
                      textAlign: 'center',
                    }}
                  >
                    Hire Me
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                color: '#080808',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                padding: '8px 14px',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#343148';
                e.currentTarget.style.color = '#F4F1EA';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#080808';
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:me.ramzan.zulfiqar@gmail.com"
            style={{
              backgroundColor: '#343148',
              color: '#F4F1EA',
              padding: '8px 20px',
              borderRadius: '4px',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#000000'}
            onMouseLeave={e => e.target.style.backgroundColor = '#343148'}
          >
            Hire Me
          </a>
        </div>
      )}
    </motion.nav>
  );
}