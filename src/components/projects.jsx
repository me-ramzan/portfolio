import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    number: '01',
    title: 'AI-Powered Document Processing System',
    stack: ['n8n', 'OpenAI', 'Pinecone', 'Vector Search'],
    description: 'End-to-end n8n workflow integrated with OpenAI and Pinecone to intelligently process and analyze documents. Implemented vector-based semantic search that reduced manual document review time by 70%.',
    tag: 'AI / AUTOMATION',
  },
  {
    number: '02',
    title: 'Invoice Processing Automation',
    stack: ['UiPath', 'SharePoint', 'Outlook', 'OCR'],
    description: 'RPA solution that automatically retrieves invoice PDFs and client signatures from Outlook, merges documents, embeds digital signatures, and archives to SharePoint. Saved 10+ hours of manual work per week.',
    tag: 'RPA / ENTERPRISE',
  },
  {
    number: '03',
    title: 'AI Calling Agent for Customer Support',
    stack: ['n8n', 'Twilio', 'ElevenLabs', 'LLM'],
    description: 'AI-powered voice calling agent integrated with Twilio for call automation and ElevenLabs for natural voice synthesis, enabling autonomous handling and resolution of customer queries.',
    tag: 'AI / VOICE',
  },
  {
    number: '04',
    title: 'Future Mineral Forum — UI',
    stack: ['React.js', 'HTML', 'CSS', 'JavaScript'],
    description: 'Built and maintained a responsive front-end website including reusable UI components. Diagnosed and resolved cross-device UI/UX inconsistencies based on visual QA review and feedback.',
    tag: 'FRONTEND / WEB',
  },
];

function TypewriterTags({ tags, active }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', minHeight: '28px' }}>
      {active && tags.map((tag, i) => (
        <span key={i} className="mono" style={{
          fontSize: '0.65rem',
          padding: '4px 10px',
          backgroundColor: '#0000005d',
          color: '#F4F1EA',
          borderRadius: '3px',
          letterSpacing: '0.05em',
          animation: 'tagPop 0.2s ease-out both',
          animationDelay: `${i * 0.08}s`,
        }}>
          {tag}
        </span>
      ))}
      <style>{`
        @keyframes tagPop {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function Projects() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);
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
      id="projects"
      ref={ref}
      style={{
        padding: '10vw 6vw',
        backgroundColor: '#343148',
        borderTop: '1px solid #1A1A1A',
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <span className="mono" style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.15em' }}>03 / PROJECTS</span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#ffffff', marginTop: '12px' }} />
          {/* <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginTop: '1rem',
            lineHeight: 1.1,
          }}>
            Projects:
          </h2> */}
        </div>
        {/* <p style={{ color: '#ffffff', fontSize: '0.9rem', maxWidth: '280px', lineHeight: 1.6 }}>
          Hover each project to reveal the tech stack in real time.
        </p> */}
      </motion.div>

      {/* Project list */}
      <div>
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative',
              borderTop: '1px solid #2A2A2A',
              padding: '2rem 0',
              cursor: 'default',
              transition: 'background 0.3s, background-color 0.3s',
              marginLeft: '-6vw',
              marginRight: '-6vw',
              paddingLeft: '6vw',
              paddingRight: '6vw',
              backgroundColor: hovered === i ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
            }}
          >
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '3px',
              height: '100%',
              backgroundColor: '#ffffff',
              opacity: hovered === i ? 1 : 0.6,
              transition: 'opacity 0.3s ease',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '10px' }}>
                  <span className="mono" style={{ color: '#f6f8ff', fontSize: '0.7rem' }}>{project.number}</span>
                  <span className="mono" style={{
                    fontSize: '0.65rem',
                    color: '#ffffff',
                    border: '1px solid #2A2A2A',
                    padding: '3px 8px',
                    borderRadius: '3px',
                    letterSpacing: '0.08em',
                  }}>{project.tag}</span>
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: hovered === i ? '#FFFF' : '#ffffff',
                  transition: 'color 0.3s',
                  lineHeight: 1.2,
                  marginBottom: '8px',
                }}>
                  {project.title}
                </h3>
                <TypewriterTags tags={project.stack} active={hovered === i} />
              </div>
<div style={{ maxWidth: '380px', minHeight: '5.4rem' }}>
  <AnimatePresence mode="wait">
    {hovered === i && (
      <motion.p
        key={i}
        variants={{
          animate: { transition: { staggerChildren: 0.02 } },
          exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          color: '#ffffff',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.3em',
        }}
      >
        {project.description.split(' ').map((word, wi) => (
          <motion.span
            key={wi}
            variants={{
              initial: { opacity: 0, y: -12 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
              exit: { opacity: 0, y: 12, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    )}
  </AnimatePresence>
</div>
            </div>
          </motion.div>
        ))}
        <div style={{ borderTop: '1px solid #ffffff' }} />
      </div>
    </section>
  );
}