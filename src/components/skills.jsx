import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const skillGroups = [
  {
    category: 'Programming & Scripting',
    icon: '{ }',
    skills: ['JavaScript', 'TypeScript', 'Python', 'React.js', 'Node.js', 'C/C++', 'VB.NET'],
  },
  {
    category: 'RPA & Automation',
    icon: '⚙',
    skills: ['UiPath', 'Power Automate', 'Automation Anywhere', 'n8n'],
  },
  {
    category: 'AI/ML & Workflow Tools',
    icon: '◈',
    skills: ['OpenAI Whisper', 'Docker', 'ML Model Integration', 'LLM Pipelines'],
  },
  {
    category: 'Web & API Tools',
    icon: '⌁',
    skills: ['REST APIs', 'Postman', 'Selenium', 'npm', 'CPanel'],
  },
  {
    category: 'Databases & Cloud',
    icon: '▣',
    skills: ['MySQL', 'MongoDB', 'Google Cloud'],
  },
  {
    category: 'Systems & Platforms',
    icon: '◻',
    skills: ['HubSpot', 'Zoho CRM', 'SAP Fiori', 'SharePoint', 'Ghost CMS'],
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

export default function Skills() {
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
      id="skills"
      ref={ref}
      style={{
        padding: isMobile ? '4rem 5vw' : '10vw 6vw',
        backgroundColor: '#D7C49E',
        borderTop: '1px solid #000000',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr',
          gap: isMobile ? '2rem' : '4rem',
          alignItems: 'start',
        }}
      >
        {/* Left label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={isMobile ? {} : { position: 'sticky', top: '100px' }}
        >
          <span className="mono" style={{ color: '#000000', fontSize: '0.7rem', letterSpacing: '0.15em' }}>04 / SKILLS</span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#343148', marginTop: '12px' }} />
          <h2 style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginTop: '1.5rem',
            lineHeight: 1.2,
          }}>
          <span style={{ color: '#343148' }}>Technical<br />Arsenal</span>
          </h2>
        </motion.div>

        {/* Skills grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: isMobile ? '1rem' : '1.5rem',
        }}>
          {skillGroups.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                border: '1px solid #000000',
                borderRadius: '6px',
                padding: '1.5rem',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
             whileHover={{
                borderColor: '#343148',
                y: -4,
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.2 },
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '1rem',
                  color: '#343148',
                  fontWeight: 600,
                }}>
                  {group.icon}
                </span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: '#080808',
                }}>
                  {group.category}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {group.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="mono"
                    style={{
                      fontSize: '0.65rem',
                      padding: '4px 10px',
                      backgroundColor: '#343148',
                      border: '1px solid #424040',
                      borderRadius: '3px',
                      color: '#f4f1ea',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Languages strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          marginTop: isMobile ? '2.5rem' : '4rem',
          paddingTop: isMobile ? '1.5rem' : '2.5rem',
          borderTop: '1px solid #000000',
          display: 'flex',
          gap: isMobile ? '1rem 2rem' : '3rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span className="mono" style={{ color: '#343148', fontSize: '0.7rem', letterSpacing: '0.15em' }}>LANGUAGES</span>
        {[
          { lang: 'English', level: 'Fluent' },
          { lang: 'Hindi', level: 'Fluent' },
          { lang: 'Urdu', level: 'Native' },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.lang}</span>
           <span className="mono" style={{ fontSize: '0.65rem', color: '#f4f1ea', backgroundColor: '#343148', border: '1px solid #343148', padding: '3px 8px', borderRadius: '3px' }}>
            {l.level}
          </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}