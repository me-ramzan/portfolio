import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const experiences = [
  {
    role: 'Software Developer',
    company: 'IMPACT BBDO',
    location: 'Dubai, UAE',
    type: 'On-Site · Full Time',
    period: 'Apr 2026 – Present',
    duration: '4 months',
    color: '#343148',
    highlights: [
      'Built UI components using React.js, HTML, SCSS, and JavaScript',
      'Debugged and resolved UI/UX issues based on visual QA feedback',
      'Managed builds, deployments, and CRM integrations',
      'Maintained responsive websites within a Ghost/Handlebars CMS environment',
    ],
    tags: ['React.js', 'SCSS', 'JavaScript', 'Ghost CMS', 'QA'],
  },
  {
    role: 'Software Engineer',
    company: 'DUOFANKAAR',
    location: 'Dubai, UAE',
    type: 'Hybrid · Full Time',
    period: 'Apr 2025 – Mar 2026',
    duration: '12 months',
    color: '#343148',
    highlights: [
      'Built React front ends with reusable components and API integrations using JavaScript and npm',
      'Developed n8n and Node.js back ends with ML-powered workflows and automation pipelines',
      'Managed builds, deployments, and CRM integrations through CPanel and REST APIs',
      'Delivered AI-driven automation features and managed production releases',
    ],
    tags: ['React.js', 'Node.js', 'n8n', 'ML Pipelines', 'REST APIs', 'CPanel'],
  },
  {
    role: 'RPA Developer (Team Lead)',
    company: 'SYBROS TECH',
    location: 'Lahore, Pakistan',
    type: 'On-Site · Full Time',
    period: 'Mar 2024 – Apr 2025',
    duration: '13 months',
    color: '#343148',
    highlights: [
      'Led RPA team delivering end-to-end automations for SAP Fiori/HANA and CRMs using UiPath, Python, and APIs',
      'Built workflows eliminating manual bottlenecks in finance, procurement, and sales',
      'Managed full project lifecycle, mentoring developers and providing client and university trainings',
      'Earned LinkedIn recommendation from CEO for leadership and technical excellence',
    ],
    tags: ['UiPath', 'Power Automate', 'SAP Fiori', 'Python', 'APIs', 'Team Lead'],
  },
  {
    role: 'Artificial Intelligence Trainee',
    company: 'SAMSUNG INNOVATION',
    location: 'Lahore, Pakistan',
    type: 'On-Site · Part Time',
    period: 'Dec 2023 – Mar 2024',
    duration: '4 months',
    color: '#343148',
    highlights: [
      'Solid ML fundamentals in linear algebra, probability, and statistics',
      'Hands-on Python experience (NumPy, Pandas) for data preprocessing and analysis',
      'Applied supervised, unsupervised, and NLP techniques to extract actionable insights',
      'Developed predictive model for Cytokine protein levels supporting early inflammation detection',
    ],
    tags: ['Python', 'NumPy', 'Pandas', 'ML', 'NLP', 'Deep Learning'],
  },
];

export default function Experience() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

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
      id="experience"
      ref={ref}
      style={{
        padding: '10vw 6vw',
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
          style={{ position: 'sticky', top: '100px' }}
        >
          <span className="mono" style={{ color: '#000000', fontSize: '0.7rem', letterSpacing: '0.15em' }}>02 / EXPERIENCE</span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#343148', marginTop: '12px' }} />
          <h2 style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginTop: '1.5rem',
            lineHeight: 1.2,
          }}>
          <span style={{ color: '#343148' }}>Work<br />History</span>

          </h2>
        </motion.div>

        {/* Right timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical timeline line */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: '#000000',
          }} />

          <div style={{ paddingLeft: '2.5rem' }}>
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                style={{
                  marginBottom: i < experiences.length - 1 ? '3.5rem' : 0,
                  position: 'relative',
                }}
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: '-2.75rem',
                  top: '6px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: exp.color,
                  border: '2px solid #F4F1EA',
                  boxShadow: `0 0 0 1px ${exp.color}`,
                }} />

                {/* Header row */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '6px' }}>
                    <h3 style={{
                      fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      color: '#343148',
                    }}>
                      {exp.role}
                    </h3>
                    <span className="mono" style={{ fontSize: '0.7rem', color: '#343148' }}>
                      {exp.period} · {exp.duration}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#000000' }}>{exp.company}</span>
                    <span className="mono" style={{ fontSize: '0.65rem', color: '#343148' }}>{exp.location} · {exp.type}</span>
                  </div>
                </div>

                {/* Highlights */}
                <ul style={{ paddingLeft: '1rem', marginBottom: '1rem', listStyle: 'none' }}>
                  {exp.highlights.map((h, j) => (
                    <li key={j} style={{
                      color: '#000000',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      marginBottom: '6px',
                      paddingLeft: '0',
                      display: 'flex',
                      gap: '8px',
                    }}>
                      <span style={{ color: '#343148', marginTop: '2px', flexShrink: 0 }}>›</span>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {exp.tags.map((tag, j) => (
                    <span key={j} className="mono" style={{
                      fontSize: '0.65rem',
                      padding: '4px 10px',
                      border: '1px solid #000000',
                      borderRadius: '3px',
                      color: '#343148',
                      backgroundColor: 'transparent',
                      letterSpacing: '0.05em',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}