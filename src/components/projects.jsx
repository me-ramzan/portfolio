import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import aiDocProcessing from '../assets/images/AIDocumentProcessingWorkflow.png';
import invoiceAutomation from '../assets/images/AutomatedInvoiceProcessingWorkflow.png';
import aiCallingAgent from '../assets/images/AIVoiceCallingAgentPipeline.png';
import futureMineralForum from '../assets/images/FutureMineralForum.png';
import sadiaChicken from '../assets/images/SadiaChicken.png';
import cboj from '../assets/images/CBOJ.jpg';

const projects = [
  {
    number: '01',
    title: 'AI-Powered Document Processing System',
    stack: ['n8n', 'OpenAI', 'Pinecone', 'Vector Search'],
    description: 'End-to-end n8n workflow integrated with OpenAI and Pinecone to intelligently process and analyze documents. Implemented vector-based semantic search that reduced manual document review time by 70%.',
    tag: 'AI / AUTOMATION',
    image: aiDocProcessing,
    bgColor: '#ffffff',
  },
  {
    number: '02',
    title: 'Invoice Processing Automation',
    stack: ['UiPath', 'SharePoint', 'Outlook', 'OCR'],
    description: 'RPA solution that automatically retrieves invoice PDFs and client signatures from Outlook, merges documents, embeds digital signatures, and archives to SharePoint. Saved 10+ hours of manual work per week.',
    tag: 'RPA / ENTERPRISE',
    image: invoiceAutomation,
    bgColor: '#FBF4EC',
  },
  {
    number: '03',
    title: 'AI Calling Agent for Customer Support',
    stack: ['n8n', 'Twilio', 'ElevenLabs', 'LLM'],
    description: 'AI-powered voice calling agent integrated with Twilio for call automation and ElevenLabs for natural voice synthesis, enabling autonomous handling and resolution of customer queries.',
    tag: 'AI / VOICE',
    image: aiCallingAgent,
    bgColor: '#ffffff',
  },
  {
    number: '04',
    title: 'Future Mineral Forum — UI',
    stack: ['React.js', 'HTML', 'CSS', 'JavaScript'],
    description: 'Built and maintained a responsive front-end website including reusable UI components. Diagnosed and resolved cross-device UI/UX inconsistencies based on visual QA review and feedback.',
    tag: 'FRONTEND / WEB',
    image: futureMineralForum,
    bgColor: '#000000',
    link: 'https://www.futuremineralsforum.com/',
  },
  {
    number: '05',
    title: 'Sadia Chicken',
    stack: ['React.js', 'HTML', 'CSS', 'JavaScript'],
    description: 'Developed and maintained a responsive front-end, ensuring a consistent user experience across desktop, tablet, and mobile devices.',
    tag: 'FRONTEND / WEB',
    image: sadiaChicken,
    bgColor: '#FFCD00',
    link: 'https://www.sadia-life.com/en/',
  },
  {
    number: '06',
    title: 'CBOJ',
    stack: ['React.js', 'HTML', 'C#', 'JavaScript'],
    description: 'Implemented responsive user interfaces using C#, ensuring consistent functionality and an optimized experience across desktop and mobile devices.',
    tag: 'FRONTEND / WEB',
    image: cboj,
    bgColor: '#ffffff',
  },
];

const titleStyle = {
  fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: '#ffffff',
  lineHeight: 1.2,
  marginBottom: '8px',
  transition: 'color 0.3s',
};

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

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
      id="projects"
      ref={ref}
      style={{
        padding: isMobile ? '4rem 5vw' : '10vw 6vw',
        backgroundColor: '#343148',
        borderTop: '1px solid #1A1A1A',
        overflow: 'visible',
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: isMobile ? '2.5rem' : '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <span className="mono" style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.15em' }}>03 / PROJECTS</span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#ffffff', marginTop: '12px' }} />
        </div>
      </motion.div>

      {/* Project list */}
      <div style={{ position: 'relative' }}>
        {projects.map((project, i) => {
          const isActive = isMobile || hovered === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={() => !isMobile && setHovered(i)}
              onMouseLeave={() => !isMobile && setHovered(null)}
              style={{
                position: 'relative',
                borderTop: '1px solid #2A2A2A',
                padding: isMobile ? '1.5rem 0' : '2rem 0',
                cursor: 'default',
                transition: 'background 0.3s, background-color 0.3s',
                marginLeft: isMobile ? '-5vw' : '-6vw',
                marginRight: isMobile ? '-5vw' : '-6vw',
                paddingLeft: isMobile ? '5vw' : '6vw',
                paddingRight: isMobile ? '5vw' : '6vw',
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
                opacity: isActive ? 1 : 0.6,
                transition: 'opacity 0.3s ease',
              }} />

              {/* Hover Image */}
              {!isMobile && (
                <AnimatePresence>
                  {hovered === i && project.image && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 20 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: 'absolute',
                        left: '48%',
                        top: '-10px',
                        width: '220px',
                        height: '220px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                        zIndex: 20,
                        pointerEvents: 'none',
                        backgroundColor: project.bgColor || '#000000',
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '18px' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: isMobile ? '100%' : '280px' }}>
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

                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title} website`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 30,
                      }}
                    >
                      <h3 style={{
                        ...titleStyle,
                        textDecoration: isActive ? 'underline' : 'none',
                        textUnderlineOffset: '4px',
                        textDecorationThickness: '1px',
                      }}>
                        {project.title}
                      </h3>
                      <ArrowUpRight
                        size={22}
                        color="#ffffff"
                        style={{
                          flexShrink: 0,
                          marginTop: '4px',
                          opacity: isActive ? 1 : 0.5,
                          transform: isActive ? 'translate(3px, -3px)' : 'none',
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                        }}
                      />
                    </a>
                  ) : (
                    <h3 style={titleStyle}>{project.title}</h3>
                  )}

                  <TypewriterTags tags={project.stack} active={isActive} />
                </div>
                <div style={{ maxWidth: isMobile ? '100%' : '380px', minHeight: isMobile ? 'auto' : '5.4rem' }}>
                  {isMobile ? (
                    <p style={{
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      lineHeight: 1.7,
                      margin: 0,
                    }}>
                      {project.description}
                    </p>
                  ) : (
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
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div style={{ borderTop: '1px solid #ffffff' }} />
      </div>
    </section>
  );
}