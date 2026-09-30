import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Award } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1];

const education = [
  {
    degree: 'Bachelors in Computer Science — BSCS (Honors)',
    institution: 'University of Central Punjab',
    location: 'Lahore, Pakistan',
    period: 'June 2021 – July 2025',
    details: 'Major: Data Science, Artificial Intelligence, Data Structures, LLMs',
    subjects: ['DSA', 'DAA', 'Artificial Intelligence', 'LLMs', 'Data Science'],
  },
  {
    degree: 'Intermediate of Computer Science — ICS',
    institution: 'Punjab Group of Colleges',
    location: 'Lahore, Pakistan',
    period: 'May 2019 – March 2021',
    details: 'Subjects: Computer Science, Maths, Physics',
    subjects: ['Computer Science', 'Mathematics', 'Physics'],
  },
];

const achievements = [
  {
    title: 'Team Leadership Award',
    org: 'Sybros Tech',
    desc: 'Led the RPA team to deliver enterprise automations. Earned a LinkedIn recommendation from the CEO for leadership and technical excellence.',
  },
  {
    title: 'RPA Workshop Speaker',
    org: 'UMT × Sybros Tech',
    desc: 'Conducted RPA workshop hosted by UMT\'s Department of AI. Contributed to signing of MoU offering internship opportunities for students.',
  },
  {
    title: 'UAE Enterprise Projects',
    org: 'Impact BBDO',
    desc: 'Led AI-driven automation and software projects across the UAE using RPA, n8n, Python, React.js, Node.js, and Docker in multiple sectors.',
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

export default function Education() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const eduColRef = useRef(null);
  const achColRef = useRef(null);
  const numberRefs = useRef([]);
  const cardRefs = useRef([]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const labelY = useSpring(useTransform(scrollYProgress, [0, 1], [50, -50]), { stiffness: 100, damping: 24, mass: 0.6 });
  const achLabelY = useSpring(useTransform(scrollYProgress, [0, 1], [30, -70]), { stiffness: 100, damping: 24, mass: 0.6 });
  const eduUnderline = useTransform(scrollYProgress, [0, 0.35], ['0%', '100%']);
  const achUnderline = useTransform(scrollYProgress, [0, 0.35], ['0%', '100%']);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated period-year counters (GSAP text scramble/count-up feel)
      numberRefs.current.forEach((el) => {
        if (!el) return;
        const fullText = el.dataset.text || '';
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
            onStart: () => {
              let progress = { v: 0 };
              gsap.to(progress, {
                v: 1,
                duration: 1.1,
                ease: 'power2.out',
                onUpdate: () => {
                  const reveal = Math.floor(progress.v * fullText.length);
                  el.textContent = fullText
                    .split('')
                    .map((c, i) => (i < reveal || c === ' ' || c === '–' || c === '·' ? c : '•'))
                    .join('');
                },
              });
            },
          }
        );
      });

      // Card entrance: skew + slide, GSAP-driven for a snappier premium feel than CSS transitions
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 60, skewY: 3 },
          {
            autoAlpha: 1,
            y: 0,
            skewY: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
          }
        );
      });

      // Subtle continuous drift on the two column headers, independent of Framer's spring
      [eduColRef.current, achColRef.current].forEach((col, i) => {
        if (!col) return;
        gsap.to(col, {
          y: i === 0 ? -14 : 14,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      style={{
        padding: isMobile ? '4rem 5vw' : '10vw 6vw',
        backgroundColor: '#343148',
        borderTop: '1px solid #1A1A1A',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '3rem' : '6rem', alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Education */}
        <div ref={eduColRef}>
          <motion.span
            className="mono"
            style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.15em', display: 'inline-block', y: isMobile ? 0 : labelY }}
          >
            05 / EDUCATION
          </motion.span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#4a4566', marginTop: '12px', marginBottom: '2.5rem', overflow: 'hidden' }}>
            <motion.div style={{ width: eduUnderline, height: '100%', backgroundColor: '#ffffff' }} />
          </div>

          {education.map((edu, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                marginBottom: i < education.length - 1 ? '2.5rem' : 0,
                paddingBottom: i < education.length - 1 ? '2.5rem' : 0,
                borderBottom: i < education.length - 1 ? '1px solid #2A2A2A' : 'none',
                transformOrigin: 'left top',
              }}
            >
              <span
                className="mono"
                ref={(el) => (numberRefs.current[i] = el)}
                data-text={edu.period}
                style={{ color: '#f3f7ff', fontSize: '0.7rem' }}
              >
                {edu.period}
              </span>
              <h3 style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                fontWeight: 700,
                color: '#ffffff',
                marginTop: '8px',
                marginBottom: '4px',
                lineHeight: 1.3,
              }}>
                {edu.degree}
              </h3>
              <p style={{ color: '#ffffff', fontSize: '0.875rem', marginBottom: '12px' }}>
                {edu.institution} · {edu.location}
              </p>
              <p style={{ color: '#ffffff', fontSize: '0.8rem', marginBottom: '12px' }}>{edu.details}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {edu.subjects.map((s, j) => (
                  <motion.span
                    key={j}
                    className="mono"
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + j * 0.05 + 0.2, ease: EASE }}
                    whileHover={isMobile ? {} : { y: -2, backgroundColor: '#4a4566' }}
                    style={{
                      fontSize: '0.62rem',
                      padding: '3px 8px',
                      border: '1px solid #2A2A2A',
                      borderRadius: '3px',
                      backgroundColor: '#1e1d1b',
                      color: '#f7eeee',
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div ref={achColRef}>
          <motion.span
            className="mono"
            style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.15em', display: 'inline-block', y: isMobile ? 0 : achLabelY }}
          >
            ACHIEVEMENTS
          </motion.span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#4a4566', marginTop: '12px', marginBottom: '2.5rem', overflow: 'hidden' }}>
            <motion.div style={{ width: achUnderline, height: '100%', backgroundColor: '#ffffff' }} />
          </div>

          {achievements.map((ach, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[education.length + i] = el)}
              style={{
                marginBottom: i < achievements.length - 1 ? '2rem' : 0,
                paddingBottom: i < achievements.length - 1 ? '2rem' : 0,
                borderBottom: i < achievements.length - 1 ? '1px solid #2A2A2A' : 'none',
                display: 'flex',
                gap: '1rem',
                transformOrigin: 'right top',
              }}
            >
              <motion.div
                whileHover={isMobile ? {} : { scale: 1.15, rotate: 8 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{
                  width: '36px',
                  height: '36px',
                  flexShrink: 0,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 71, 255, 0.1)',
                  border: '1px solid rgba(0, 71, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                }}
              >
                <Award size={14} color="#f0f4ff" />
              </motion.div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  {ach.title}
                </h4>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#eff3ff', marginBottom: '8px', display: 'block' }}>
                  {ach.org}
                </span>
                <p style={{ color: '#ffffff', fontSize: '0.85rem', lineHeight: 1.6 }}>{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}