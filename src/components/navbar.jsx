import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        backgroundColor: scrolled ? 'rgba(244, 241, 234, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #D1D1C7' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <a
        href="#top"
        className="mono"
        style={{ color: '#000000', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textDecoration: 'none' }}
      >
        
      </a>

      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
{navLinks.map((link) => (
  <a
  
    key={link.label}
    href={link.href}
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
    </motion.nav>
  );
}