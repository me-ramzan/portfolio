import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import sybrosLogo from '../assets/images/sybros.png';
import bbdoLogo from '../assets/images/bbdo.png';
import duofankaarLogo from '../assets/images/duofankaar.png';
import samsungLogo from '../assets/images/samsung.png';


const companies = [
  { name: 'Sybros', logo: sybrosLogo },
  { name: 'BBDO', logo: bbdoLogo },
  { name: 'Duofankaar', logo: duofankaarLogo },
  { name: 'Samsung', logo: samsungLogo },
];

export default function About() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: '10vw 6vw 4vw',
        backgroundColor: '#D7C49E',
        borderTop: '1px solid #000000',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '4rem', alignItems: 'start' }}>
        {/* Left label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="mono" style={{ color: '#000000', fontSize: '0.7rem', letterSpacing: '0.15em' }}>01 / ABOUT</span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#343148', marginTop: '12px' }} />
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
            <span style={{ color: '#343148' }}>Engineering Excellence</span><br />
            <span style={{ WebkitTextStroke: '1.5px #080808', color: 'transparent' }}>at Every Layer</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: '1.1rem',
              color: '#000000',
              lineHeight: 1.7,
              maxWidth: '640px',
              marginBottom: '3rem',
            }}
          >
            Automation and Software Engineer with <strong>~3 years</strong> of experience building React-based frontends and n8n-driven backends using JavaScript, React.js, Node.js, and Python. Strong RPA background with UiPath and Power Automate, plus deep CRM and enterprise integrations. Skilled in AI and ML workflows for automating complex, unstructured processes. <strong>Based in the UAE with relocation flexibility.</strong>
          </motion.p>
        </div>
      </div>

      {/* Companies Marquee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{
          borderTop: '1px solid #000000',
          marginTop: '2.5rem',
          padding: '2.5rem 0 0.5rem',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#D7C49E',
          marginLeft: '-6vw',
          marginRight: '-6vw',
          width: 'calc(100% + 12vw)',
        }}
      >
        <style>{`
          @keyframes companyMarquee {
            0% { transform: translateX(-25%); }
            100% { transform: translateX(0); }
          }
              .marquee-track {
                display: flex;
                width: max-content;
                animation: companyMarquee 20s linear infinite;
              }
              .marquee-track:hover {
                animation-play-state: paused;
              }
        `}</style>
        <div className="marquee-track">
          {[...companies, ...companies, ...companies, ...companies].map((company, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 1rem',
              }}
            >
              <img
                src={company.logo}
                alt={company.name}
                style={{
                  maxHeight: '100px',
                  maxWidth: '180px',
                  objectFit: 'contain',
                }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}