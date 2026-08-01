import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#D7C49E',
        borderTop: '1px solid #1A1A1A',
        padding: '3rem 6vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div>
        <a href="#top" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#343148',
            letterSpacing: '-0.02em',
          }}>
            MUHAMMAD RAMZAN
          </span>
        </a>
        <p className="mono" style={{ color: '#000000', fontSize: '0.65rem', marginTop: '6px', letterSpacing: '0.05em' }}>
          Automation & Software Engineer · Dubai, UAE
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {['About', 'Experience', 'Projects', 'Skills', 'Contact'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              color: '#000000',
              textDecoration: 'none',
              fontSize: '0.8rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#343148'}
            onMouseLeave={e => e.target.style.color = '#000000'}
          >
            {link}
          </a>
        ))}
      </div>

      <div>
        <span className="mono" style={{ color: '#000000', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
          © All rights reserved.
        </span>
      </div>
    </footer>
  );
}