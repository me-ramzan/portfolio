import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
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

  // Mobile pe route change ya link click hote hi menu band ho jaye
  const closeMenu = () => setMenuOpen(false);

  // Smooth scroll with navbar offset — menu close hone ke baad settle hoke scroll karta hai
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
        style={{ color: '#343148', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textDecoration: 'none' }}
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

          {/* Mobile dropdown menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'fixed',
                  top: '64px',
                  left: 0,
                  right: 0,
                  backgroundColor: '#F4F1EA',
                  borderBottom: '1px solid #D1D1C7',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1rem 6vw 1.5rem',
                  gap: '0.5rem',
                }}
              >
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      color: '#080808',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      padding: '10px 4px',
                      borderBottom: '1px solid #E4E1D6',
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="mailto:me.ramzan.zulfiqar@gmail.com"
                  onClick={closeMenu}
                  style={{
                    backgroundColor: '#343148',
                    color: '#F4F1EA',
                    padding: '12px 20px',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '0.03em',
                    textAlign: 'center',
                    marginTop: '0.5rem',
                  }}
                >
                  Hire Me
                </a>
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