import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import arrowUp from '../assets/images/arroww.png';

gsap.registerPlugin(ScrollTrigger);

const DARK = '#343148';

// Swap these hrefs for your real profile links
const SOCIAL_ICONS = [
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/muhammad-ramzan-111576246/?isSelfProfile=true',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    id: 'github',
    href: 'https://github.com/me-ramzan',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
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

function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function FollowMeSocial({ isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(null);

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setActive(null);
      }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        height: 90,
        minWidth: 240,
        color: DARK,
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 2.5,
          whiteSpace: 'nowrap',
        }}
      >
        FOLLOW ME
      </div>

      <motion.div
  animate={{ y: expanded ? 34 : 0 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  style={{
          position: expanded ? 'absolute' : 'relative',
          right: 0,
          top: expanded ? 28 : 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 32,
        }}
      >
        <AnimatePresence>
          {!expanded && (
            <motion.div
              key="share"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                border: `1.3px solid ${DARK}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8">
                <circle cx="18" cy="5" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <path d="M8.2 10.7 15.8 6.6M8.2 13.3l7.6 4.1" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {expanded &&
          SOCIAL_ICONS.map((icon, i) => {
            const isActive = active === icon.id;
            return (
              <motion.a
  key={icon.id}
  href={icon.href}
  target="_blank"
  rel="noreferrer"
  onMouseEnter={() => setActive(icon.id)}
  onMouseLeave={() => setActive(null)}
  initial={{ opacity: 0, y: 8 }}
  animate={{
    opacity: active && !isActive ? 0.35 : 1,
    y: 0,
    scale: isActive ? 1.3 : 1,
  }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
  style={{
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: DARK,
    textDecoration: 'none',
  }}
>
                <div style={{ width: 14, height: 14 }}>{icon.svg}</div>
              </motion.a>
            );
          })}
      </motion.div>
    </div>
  );
}

export default function Footer() {
  const isMobile = useIsMobile();
  const footerRef = useRef(null);
  const arrowRef = useRef(null);
  const nameRef = useRef(null);
  const rightsRef = useRef(null);
  const socialColRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] });
  const nameY = useSpring(useTransform(scrollYProgress, [0, 1], [30, -10]), { stiffness: 100, damping: 24, mass: 0.5 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [arrowRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo(
        [nameRef.current, rightsRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo(
        socialColRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.to(arrowRef.current, {
        y: -6,
        duration: 1.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  if (isMobile) {
    return (
      <footer
        ref={footerRef}
        style={{
          backgroundColor: '#D7C49E',
          borderTop: '1px solid #1A1A1A',
          padding: '2.5rem 6vw 2rem',
          position: 'relative',
        }}
      >
        <a
          href="#top"
          onClick={scrollToTop}
          style={{
            position: 'absolute',
            left: '6vw',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
        >
          <img ref={arrowRef} src={arrowUp} alt="Back to top" width={34} height={34} style={{ willChange: 'transform' }} />
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>
          <span
            ref={nameRef}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#343148',
              letterSpacing: '-0.02em',
            }}
          >
            MUHAMMAD RAMZAN
          </span>
          <span
            ref={rightsRef}
            className="mono"
            style={{ color: '#000000', fontSize: '0.65rem', letterSpacing: '0.05em' }}
          >
            2026 ©. ALL RIGHTS RESERVED.
          </span>
        </div>

        <div
          ref={socialColRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            color: DARK,
            marginTop: '1.5rem',
          }}
        >
          {SOCIAL_ICONS.map((icon) => (
            <a
              key={icon.id}
              href={icon.href}
              target="_blank"
              rel="noreferrer"
              style={{ width: 18, height: 18, color: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {icon.svg}
            </a>
          ))}
        </div>
      </footer>
    );
  }

  return (
    <footer
      ref={footerRef}
      style={{
        backgroundColor: '#D7C49E',
        borderTop: '1px solid #1A1A1A',
        padding: '3rem 6vw',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <a
        
  href="#top"
  onClick={scrollToTop}
  className="mono"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#1A1A1A',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    fontWeight: 600,
    transition: 'color 0.3s ease, gap 0.3s ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = DARK;
    e.currentTarget.style.gap = '14px';
    gsap.to(e.currentTarget.querySelector('img'), { scale: 1.2, rotate: 8, duration: 0.3, ease: 'back.out(2)' });
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = '#1A1A1A';
    e.currentTarget.style.gap = '10px';
    gsap.to(e.currentTarget.querySelector('img'), { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' });
  }}
>
  <img
    ref={arrowRef}
    src={arrowUp}
    alt=""
    width={38}
    height={38}
    style={{ willChange: 'transform' }}
  />
  BACK TOP
</a>

      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          gridColumn: '2',
          justifySelf: 'center',
          y: nameY,
        }}
      >
        <span
          ref={nameRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#343148',
            letterSpacing: '-0.02em',
          }}
        >
          MUHAMMAD RAMZAN
        </span>
        <span
          ref={rightsRef}
          className="mono"
          style={{ color: '#000000', fontSize: '0.65rem', letterSpacing: '0.05em' }}
        >
          2026 ©. ALL RIGHTS RESERVED.
        </span>
      </motion.div>

      <div
        ref={socialColRef}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gridColumn: '3',
          width: '100%',
        }}
      >
        <FollowMeSocial isMobile={isMobile} />
      </div>
    </footer>
  );
}