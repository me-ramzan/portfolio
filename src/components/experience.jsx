import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, cubicBezier } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ease = cubicBezier(0.75, 0, 0.25, 1);

const experiences = [
  {
    role: 'Software Developer',
    company: 'IMPACT BBDO',
    location: 'Dubai, UAE',
    type: 'On-Site · Full Time',
    period: 'Apr 2026 – Present',
    duration: '6 months',
    description:
      'Building UI components and resolving UI/UX issues for a global creative agency, while keeping CRM integrations and CMS-driven sites running smoothly in production.',
    highlights: [
      'Built UI components using React.js, HTML, SCSS, and JavaScript',
      'Debugged and resolved UI/UX issues based on visual QA feedback',
      'Managed builds, deployments, and CRM integrations',
      'Maintained responsive websites within a Ghost/Handlebars CMS environment',
    ],
    tags: ['React.js', 'SCSS', 'JavaScript', 'Ghost CMS', 'QA'],
    accent: '#343148',
  },
  {
    role: 'Software Engineer',
    company: 'DUOFANKAAR',
    location: 'Dubai, UAE',
    type: 'Hybrid · Full Time',
    period: 'Apr 2025 – Mar 2026',
    duration: '12 months',
    description:
      'Owned both ends of the stack — reusable React front ends on one side, n8n and Node.js automation pipelines on the other — shipping AI-driven features into production.',
    highlights: [
      'Built React front ends with reusable components and API integrations using JavaScript and npm',
      'Developed n8n and Node.js back ends with ML-powered workflows and automation pipelines',
      'Managed builds, deployments, and CRM integrations through CPanel and REST APIs',
      'Delivered AI-driven automation features and managed production releases',
    ],
    tags: ['React.js', 'Node.js', 'n8n', 'ML Pipelines', 'REST APIs', 'CPanel'],
    accent: '#343148',
  },
  {
    role: 'RPA Developer',
    company: 'Sybros Tech',
    location: 'Lahore, Pakistan',
    type: 'On-Site · Full Time',
    period: 'Mar 2024 – Apr 2025',
    duration: '13 months',
    description:
      'Led an RPA team building end-to-end automations across SAP Fiori/HANA and CRM systems, taking projects from scoping through delivery, mentoring, and client training.',
    highlights: [
      'Led RPA team delivering end-to-end automations for SAP Fiori/HANA and CRMs using UiPath, Python, and APIs',
      'Built workflows eliminating manual bottlenecks in finance, procurement, and sales',
      'Managed full project lifecycle, mentoring developers and providing client and university trainings',
      'Earned LinkedIn recommendation from CEO for leadership and technical excellence',
    ],
    tags: ['UiPath', 'Power Automate', 'SAP Fiori', 'Python', 'APIs', 'Team Lead'],
    accent: '#343148',
  },
  {
    role: 'Artificial Intelligence Trainee',
    company: 'SAMSUNG INNOVATION',
    location: 'Lahore, Pakistan',
    type: 'On-Site · Part Time',
    period: 'Dec 2023 – Mar 2024',
    duration: '4 months',
    description:
      'Built ML fundamentals from the ground up — linear algebra through applied NLP — and used them to develop a predictive model for early inflammation detection.',
    highlights: [
      'Solid ML fundamentals in linear algebra, probability, and statistics',
      'Hands-on Python experience (NumPy, Pandas) for data preprocessing and analysis',
      'Applied supervised, unsupervised, and NLP techniques to extract actionable insights',
      'Developed predictive model for Cytokine protein levels supporting early inflammation detection',
    ],
    tags: ['Python', 'NumPy', 'Pandas', 'ML', 'NLP', 'Deep Learning'],
    accent: '#343148',
  },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

function ExperienceCard({ exp, index, total, isMobile, cardRef, nextRef, innerRef }) {
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
    layoutEffect: false,
  });

  const isLast = index === total - 1;

  const { scrollYProgress: exitProgress } = useScroll({
    target: nextRef,
    offset: ['start end', 'start start'],
    layoutEffect: false,
  });

  const enterScale = 1;
  const exitScale = useTransform(exitProgress, [0, 1], [1, isLast ? 1 : 0.7], { ease });
  const scale = useTransform(exitScale, (x) => enterScale * x);
  const opacity = useTransform(exitProgress, [0, 1], [1, isLast ? 1 : 0], { ease });

  const numberRef = useRef(null);
  const tagsRef = useRef([]);
  const highlightsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Number counter reveal (00/04 style) using GSAP scramble-in
      if (numberRef.current) {
        const full = `${String(index + 1).padStart(2, '0')} / ${total.toString().padStart(2, '0')}`;
        gsap.fromTo(
          numberRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.2,
            scrollTrigger: { trigger: cardRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
          }
        );
      }

      // Tags pop in with stagger + slight overshoot
      gsap.fromTo(
        tagsRef.current,
        { opacity: 0, y: 14, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: cardRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
        }
      );

      // Highlight list items slide in from the right, staggered
      gsap.fromTo(
        highlightsRef.current,
        { opacity: 0, x: 28 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index, total, cardRef]);

  return (
    <div
      ref={cardRef}
      style={{
        height: isMobile ? 'auto' : '78vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'flex-end',
        backgroundColor: '#D7C49E',
        zIndex: index + 1,
        marginBottom: isMobile ? '1.25rem' : 0,
        padding: isMobile ? 0 : '0 4vw',
      }}
    >
      <motion.div
        ref={innerRef}
        style={{
          width: '100%',
          minHeight: isMobile ? 'auto' : '70vh',
          scale: isMobile ? 1 : scale,
          opacity: isMobile ? 1 : opacity,
          borderTopLeftRadius: isMobile ? 24 : 32,
          borderTopRightRadius: isMobile ? 24 : 32,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: isLast ? 24 : 0,
          backgroundColor: '#343148',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
          padding: isMobile ? '2.25rem 1.5rem' : '4rem 4.5rem',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          gap: isMobile ? '1.75rem' : '3rem',
          alignItems: 'start',
          willChange: isMobile ? 'auto' : 'transform, opacity',
        }}
      >
        {/* Left: role, meta, description, CTA-style tags */}
        <div>
          <span ref={numberRef} className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#343148' }}>
            {String(index + 1).padStart(2, '0')} / {total.toString().padStart(2, '0')}
          </span>

          <h3
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              lineHeight: 1.05,
              margin: '1rem 0 0.5rem',
            }}
          >
            {exp.role}
          </h3>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>{exp.company}</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: '#FFFFFF' }}>
              {exp.location} · {exp.type}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.75rem' }}>
            {exp.tags.map((tag, j) => (
              <span
                key={j}
                ref={(el) => (tagsRef.current[j] = el)}
                className="mono"
                style={{
                  fontSize: '0.7rem',
                  padding: '8px 16px',
                  border: '1px solid #FFFFFF',
                  borderRadius: '999px',
                  color: '#FFFFFF',
                  letterSpacing: '0.03em',
                  display: 'inline-block',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: '#FFFFFF',
              maxWidth: '46ch',
              marginBottom: '1.5rem',
            }}
          >
            {exp.description}
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 22px',
              borderRadius: '999px',
              border: '1px solid #FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            {exp.period} · {exp.duration}
          </div>
        </div>

        {/* Right: highlights, styled like a dark preview panel */}
        <div
          style={{
            backgroundColor: '#D7C49E',
            borderRadius: isMobile ? 20 : 28,
            padding: isMobile ? '1.75rem' : '2.5rem',
            minHeight: isMobile ? 'auto' : '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <span
            className="mono"
            style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#343148', marginBottom: '1.25rem', display: 'block' }}
          >
            KEY CONTRIBUTIONS
          </span>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {exp.highlights.map((h, j) => (
              <li
                key={j}
                ref={(el) => (highlightsRef.current[j] = el)}
                style={{
                  color: '#343148',
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  marginBottom: j < exp.highlights.length - 1 ? '14px' : 0,
                  paddingBottom: j < exp.highlights.length - 1 ? '14px' : 0,
                  borderBottom: j < exp.highlights.length - 1 ? '1px solid rgba(244,241,234,0.15)' : 'none',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <span style={{ color: '#343148', flexShrink: 0 }}>›</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const cardRefs = useRef([]);
  cardRefs.current = experiences.map((_, i) => cardRefs.current[i] ?? React.createRef());
  const endRef = useRef(null);
  const headingRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const labelY = useSpring(useTransform(scrollYProgress, [0, 1], [60, -60]), { stiffness: 100, damping: 24, mass: 0.6 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big WORK / HISTORY heading: subtle scale + letter-spacing pulse pinned to scroll
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { scale: 0.92, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=60%',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: '#D7C49E',
        borderTop: '1px solid #000000',
        zIndex: 3,
      }}
    >
      {/* Pinned background heading */}
      <div
        style={{
          height: isMobile ? 'auto' : '65vh',
          position: isMobile ? 'relative' : 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: isMobile ? '4rem 5vw 2rem' : '0 6vw 5rem',
          zIndex: 0,
        }}
      >
        <motion.span
          className="mono"
          style={{ color: '#000000', fontSize: '0.75rem', letterSpacing: '0.15em', display: 'inline-block', y: isMobile ? 0 : labelY }}
        >
          02 / EXPERIENCE
        </motion.span>
        <div style={{ width: '32px', height: '2px', backgroundColor: '#343148', margin: '14px 0 1.5rem' }} />
        <h2
          ref={headingRef}
          style={{
            fontSize: isMobile ? 'clamp(2.5rem, 14vw, 4rem)' : 'clamp(4rem, 9vw, 8rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: '#343148',
            margin: 0,
            transformOrigin: 'left center',
          }}
        >
          WORK<br />HISTORY
        </h2>
      </div>

      {/* Stacked rising cards, one per role */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {experiences.map((exp, i) => (
          <ExperienceCard
            key={i}
            exp={exp}
            index={i}
            total={experiences.length}
            isMobile={isMobile}
            cardRef={cardRefs.current[i]}
            nextRef={i < experiences.length - 1 ? cardRefs.current[i + 1] : endRef}
          />
        ))}
        <div ref={endRef} style={{ height: isMobile ? '10vh' : '20vh' }} />
      </div>
    </section>
  );
}