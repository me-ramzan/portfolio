import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

export default function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer
      style={{
        backgroundColor: '#D7C49E',
        borderTop: '1px solid #1A1A1A',
        padding: isMobile ? '2.5rem 5vw' : '3rem 6vw',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexWrap: 'wrap',
        gap: isMobile ? '1.5rem' : '1rem',
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
          AI Automation & Software Engineer
        </p>
      </div>

      <div>
        <span className="mono" style={{ color: '#000000', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
          © All rights reserved.
        </span>
      </div>
    </footer>
  );
}