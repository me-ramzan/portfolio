import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import sybrosLogo from '../assets/images/sybros.png';
import bbdoLogo from '../assets/images/bbdo.png';
import duofankaarLogo from '../assets/images/duofankaar.png';
import samsungLogo from '../assets/images/samsung.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile, useIsDark, SectionLabel } from '../lib/ui';

gsap.registerPlugin(ScrollTrigger);

const companies = [
  { name: 'Sybros', logo: sybrosLogo },
  { name: 'BBDO', logo: bbdoLogo },
  { name: 'Duofankaar', logo: duofankaarLogo },
  { name: 'Samsung', logo: samsungLogo },
];

export default function About() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const trackRef = useRef(null);
  const positionRef = useRef(0);
  const speedRef = useRef(0.5);
  const targetSpeedRef = useRef(0.5);
  const isHoveredRef = useRef(false);
  const isMobile = useIsMobile();
  const isDark = useIsDark();
  const t = isDark
    ? { bg: '#121018', border: '#343148', text: '#F4F1EA', accent: '#D7C49E', stroke: '#F4F1EA' }
    : { bg: '#D7C49E', border: '#000000', text: '#000000', accent: '#343148', stroke: '#080808' };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Pin on desktop only — on phones it fights touch scrolling
    if (isMobile) return;
    // If the section is taller than the screen, pin it when its BOTTOM reaches the
    // bottom of the screen (so the logo strip is fully visible before Experience slides over).
    const tall = () => ref.current && ref.current.offsetHeight > window.innerHeight;
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: () => (tall() ? 'bottom bottom' : 'top top'),
      // Hold until the next section has fully covered About, so the release is never visible
      end: () => `+=${tall() ? window.innerHeight : ref.current.offsetHeight}`,
      pin: true,
      pinSpacing: false,
      pinType: 'fixed',
      invalidateOnRefresh: true,
    });
    // Re-measure once images (logos) and fonts have loaded
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const late = setTimeout(refresh, 1200);
    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(late);
      trigger.kill(true);
    };
  }, [isMobile]);
  useEffect(() => {
    let animationFrame;

    const animate = () => {
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.05;
      positionRef.current -= speedRef.current;

      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth / 4;
        if (Math.abs(positionRef.current) >= trackWidth) {
          positionRef.current = 0;
        }
        trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    targetSpeedRef.current = 0;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    targetSpeedRef.current = 0.5;
  };

  return (
    // Stable wrapper: GSAP wraps the pinned <section> in a pin-spacer, so neighbours
    // (like the Hero) must never use the section itself as React's insert reference.
    <div style={{ display: 'contents' }}>
    <section
      id="about"
      ref={ref}
      style={{
        padding: isMobile ? '4rem 5vw 3rem' : 'min(10vw, 16vh) 6vw min(4vw, 6vh)',
        backgroundColor: t.bg,
        borderTop: `1px solid ${t.border}`,
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr',
          gap: isMobile ? '1.5rem' : '4rem',
          alignItems: 'start',
        }}
      >
        {/* Left label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel index="01" title="About" color={t.text} accent={t.accent} style={{ marginBottom: 0 }} />
        </motion.div>

        {/* Right content */}
        <div style={{ minWidth: 0 }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '2rem',
            }}
          >
            <span style={{ color: t.accent }}>Engineering Excellence</span><br />
            <span style={{ WebkitTextStroke: `1.5px ${t.stroke}`, color: 'transparent' }}>at Every Layer</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: '1.1rem',
              color: t.text,
              lineHeight: 1.7,
              maxWidth: '640px',
              marginBottom: isMobile ? '1.5rem' : '3rem',
            }}
          >
            Automation and Software Engineer with <strong>~3 years</strong> of experience building React-based frontends and n8n-driven backends using JavaScript, React.js, Node.js, Python, and PHP/Laravel. Strong RPA background with UiPath and Power Automate, plus deep CRM, Mailchimp, and enterprise integrations. Skilled in AI and ML workflows for automating complex, unstructured processes.
          </motion.p>
        </div>
      </div>

      {/* Companies Marquee */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          borderTop: `1px solid ${t.border}`,
          marginTop: '2.5rem',
          padding: '2.5rem 0 0.5rem',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: t.bg,
          marginLeft: isMobile ? '-5vw' : '-6vw',
          marginRight: isMobile ? '-5vw' : '-6vw',
          width: isMobile ? 'calc(100% + 10vw)' : 'calc(100% + 12vw)',
        }}
      >
          <style>{`
          .company-logo {
            filter: grayscale(100%);
            opacity: 0.6;
            transition: filter 0.3s ease, opacity 0.3s ease;
          }
          .company-logo:hover {
            filter: grayscale(0%);
            opacity: 1;
          }
        `}</style>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {[...companies, ...companies, ...companies, ...companies].map((company, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: isMobile ? '160px' : '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 1rem',
              }}
            >
               <img
                src={company.logo}
                alt={company.name}
                className="company-logo"
                style={{
                  maxHeight: isMobile ? '60px' : '100px',
                  maxWidth: isMobile ? '110px' : '180px',
                  objectFit: 'contain',
                }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
    </div>
  );
}