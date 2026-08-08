import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

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
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="education"
      ref={ref}
      style={{
        padding: isMobile ? '4rem 5vw' : '10vw 6vw',
        backgroundColor: '#343148',
        borderTop: '1px solid #1A1A1A',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '3rem' : '6rem', alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="mono" style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.15em' }}>05 / EDUCATION</span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#ffffff', marginTop: '12px', marginBottom: '2.5rem' }} />

          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              style={{
                marginBottom: i < education.length - 1 ? '2.5rem' : 0,
                paddingBottom: i < education.length - 1 ? '2.5rem' : 0,
                borderBottom: i < education.length - 1 ? '1px solid #2A2A2A' : 'none',
              }}
            >
              <span className="mono" style={{ color: '#f3f7ff', fontSize: '0.7rem' }}>{edu.period}</span>
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
                <span key={j} className="mono" style={{
                fontSize: '0.62rem',
                padding: '3px 8px',
                border: '1px solid #2A2A2A',
                borderRadius: '3px',
                backgroundColor: '#1e1d1b',
                color: '#f7eeee',
                }}>
                {s}
                </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="mono" style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.15em' }}>ACHIEVEMENTS</span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#ffffff', marginTop: '12px', marginBottom: '2.5rem' }} />

          {achievements.map((ach, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              style={{
                marginBottom: i < achievements.length - 1 ? '2rem' : 0,
                paddingBottom: i < achievements.length - 1 ? '2rem' : 0,
                borderBottom: i < achievements.length - 1 ? '1px solid #2A2A2A' : 'none',
                display: 'flex',
                gap: '1rem',
              }}
            >
              <div style={{
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
              }}>
                <Award size={14} color="#f0f4ff" />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  {ach.title}
                </h4>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#eff3ff', marginBottom: '8px', display: 'block' }}>
                  {ach.org}
                </span>
                <p style={{ color: '#ffffff', fontSize: '0.85rem', lineHeight: 1.6 }}>{ach.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}