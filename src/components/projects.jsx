import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import aiDocProcessing from '../assets/images/AIDocumentProcessingWorkflow.png';
import invoiceAutomation from '../assets/images/AutomatedInvoiceProcessingWorkflow.png';
import aiCallingAgent from '../assets/images/AIVoiceCallingAgentPipeline.png';
import futureMineralForum from '../assets/images/FutureMineralForum.png';
import sadiaChicken from '../assets/images/SadiaChicken.png';
import hybrdx from '../assets/images/hybrdx.jpg';
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
    title: 'Future Mineral Forum - UI',
    stack: ['React.js', 'HTML', 'CSS', 'JavaScript'],
    description: 'Built and maintained a responsive front-end website including reusable UI components. Diagnosed and resolved cross-device UI/UX inconsistencies based on visual QA review and feedback.',
    tag: 'FRONTEND / WEB',
    image: futureMineralForum,
    bgColor: '#000000',
    link: 'https://www.futuremineralsforum.com/',
  },
  {
    number: '05',
    title: 'HYBRDX - Shamal Group',
    stack: ['JavaScript', 'HTML', 'CSS', 'Mailchimp'],
    description: "Contributed to the front-end of a public-facing campaign site for Dubai's hybrid fitness competition. Built responsive layouts, animations and a live event countdown, and designed the Mailchimp emailer for participant updates.",
    tag: 'FRONTEND / WEB',
    image: hybrdx,
    bgColor: '#06313e',
    link: 'https://www.hybrdx.ae/',
  },
  {
    number: '06',
    title: 'Sadia Chicken',
    stack: ['React.js', 'HTML', 'CSS', 'JavaScript'],
    description: 'Developed and maintained a responsive front-end, ensuring a consistent user experience across desktop, tablet, and mobile devices.',
    tag: 'FRONTEND / WEB',
    image: sadiaChicken,
    bgColor: '#FFCD00',
    link: 'https://www.sadia-life.com/en/',
  },
  {
    number: '07',
    title: 'CBOJ',
    stack: ['React.js', 'HTML', 'C#', 'JavaScript'],
    description: 'Implemented responsive user interfaces using C#, ensuring consistent functionality and an optimized experience across desktop and mobile devices.',
    tag: 'FRONTEND / WEB',
    image: cboj,
    bgColor: '#ffffff',
  },
];

// Premium easing — soft deceleration, no bounce
const EASE = [0.22, 1, 0.36, 1];
const EASE_SOFT = [0.19, 1, 0.22, 1];

const titleStyle = {
  fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: '#ffffff',
  lineHeight: 1.2,
  marginBottom: '8px',
  transition: 'color 0.4s ease',
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
      <AnimatePresence>
        {active && tags.map((tag, i) => (
          <motion.span
            key={tag}
            className="mono"
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
            style={{
              fontSize: '0.65rem',
              padding: '4px 10px',
              backgroundColor: '#0000005d',
              color: '#F4F1EA',
              borderRadius: '3px',
              letterSpacing: '0.05em',
            }}
          >
            {tag}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Each project row observes its own scroll progress for a premium reveal
function ProjectRow({ project, i, isMobile, hovered, setHovered }) {
  const rowRef = useRef(null);
  const isActive = isMobile || hovered === i;

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start 95%', 'start 55%'],
  });

  // Smooth the raw scroll progress so it feels like it's riding Lenis's momentum
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.6,
  });

  const y = useTransform(smoothProgress, [0, 1], [40, 0]);
  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);
  const blur = useTransform(smoothProgress, [0, 1], [6, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  // Mouse-follow "magnetic" offset for the hover image
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = rowRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.04,
      y: (e.clientY - rect.top - rect.height / 2) * 0.04,
    });
  };

  return (
    <motion.div
      ref={rowRef}
      style={{ y, opacity, filter }}
      onMouseEnter={() => !isMobile && setHovered(i)}
      onMouseLeave={() => !isMobile && setHovered(null)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        animate={{
          backgroundColor: hovered === i ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ duration: 0.5, ease: EASE_SOFT }}
        style={{
          position: 'relative',
          borderTop: '1px solid #2A2A2A',
          padding: isMobile ? '1.5rem 0' : '2.2rem 0',
          cursor: 'default',
          marginLeft: isMobile ? '-5vw' : '-6vw',
          marginRight: isMobile ? '-5vw' : '-6vw',
          paddingLeft: isMobile ? '5vw' : '6vw',
          paddingRight: isMobile ? '5vw' : '6vw',
        }}
      >
        <motion.div
          animate={{ opacity: isActive ? 1 : 0.5, scaleY: isActive ? 1 : 0.85 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '3px',
            height: '100%',
            backgroundColor: '#ffffff',
            transformOrigin: 'center',
          }}
        />

        {/* Hover Image with magnetic parallax */}
        {!isMobile && (
          <AnimatePresence>
            {hovered === i && project.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30, rotate: -2 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotate: 0,
                  x: mousePos.x,
                  transition: { duration: 0.5, ease: EASE },
                }}
                exit={{ opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.3, ease: EASE } }}
                style={{
                  position: 'absolute',
                  left: '48%',
                  top: '-10px',
                  width: '220px',
                  height: '220px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                  zIndex: 20,
                  pointerEvents: 'none',
                  backgroundColor: project.bgColor || '#000000',
                }}
              >
                <motion.img
                  src={project.image}
                  alt={project.title}
                  animate={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '18px' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '10px' }}>
              <motion.span
                className="mono"
                animate={{ opacity: isActive ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
                style={{ color: '#f6f8ff', fontSize: '0.7rem' }}
              >
                {project.number}
              </motion.span>
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
                <motion.div
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    x: isActive ? 3 : 0,
                    y: isActive ? -3 : 0,
                    rotate: isActive ? 45 : 0,
                  }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ flexShrink: 0, marginTop: '4px' }}
                >
                  <ArrowUpRight size={22} color="#ffffff" />
                </motion.div>
              </a>
            ) : (
              <h3 style={titleStyle}>{project.title}</h3>
            )}

            <TypewriterTags tags={project.stack} active={isActive} />
          </div>
          <div style={{ maxWidth: isMobile ? '100%' : '380px', minHeight: isMobile ? 'auto' : '5.4rem' }}>
            {isMobile ? (
              <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                {project.description}
              </p>
            ) : (
              <AnimatePresence mode="wait">
                {hovered === i && (
                  <motion.p
                    key={i}
                    variants={{
                      animate: { transition: { staggerChildren: 0.015 } },
                      exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
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
                          initial: { opacity: 0, y: -10, filter: 'blur(3px)' },
                          animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: EASE } },
                          exit: { opacity: 0, y: 8, filter: 'blur(2px)', transition: { duration: 0.25, ease: EASE } },
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
    </motion.div>
  );
}

export default function Projects() {
  const [headerInView, setHeaderInView] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    projects.forEach((project) => {
      if (project.image) {
        const img = new Image();
        img.src = project.image;
      }
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#343148' }}>
      <section
        id="projects"
        ref={ref}
        style={{
          padding: isMobile ? '4rem 5vw' : '10vw 6vw',
          backgroundColor: '#343148',
          borderTop: '1px solid #1A1A1A',
          overflow: 'visible',
          position: 'relative',
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: isMobile ? '2.5rem' : '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              className="mono"
              initial={{ y: '110%', opacity: 0 }}
              animate={headerInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
              transition={{ duration: 1, ease: EASE }}
              style={{ color: '#ffffff', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, margin: 0 }}
            >
              PROJECTS
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={headerInView ? { width: '48px' } : { width: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              style={{ height: '2px', backgroundColor: '#ffffff', marginTop: '16px' }}
            />
          </div>
        </div>

        {/* Project list */}
        <div style={{ position: 'relative' }}>
          {projects.map((project, i) => (
            <ProjectRow
              key={i}
              project={project}
              i={i}
              isMobile={isMobile}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
          <div style={{ borderTop: '1px solid #ffffff' }} />
        </div>
      </section>
    </div>
  );
}