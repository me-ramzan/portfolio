import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, cubicBezier } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MobileExperience from './MobileExperience';
import { useIsMobile, useIsDark, SectionLabel } from '../lib/ui';

gsap.registerPlugin(ScrollTrigger);

const ease = cubicBezier(0.75, 0, 0.25, 1);
const MAX_MONTHS = 13; // longest tenure, used to scale the tenure bars

const experiences = [
  {
    role: 'Software Developer',
    company: 'IMPACT BBDO',
    navLabel: 'BBDO', // short name shown in the floating company bar
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

function getTheme(isDark) {
  return isDark
    ? {
        bg: '#121018',
        border: '#343148',
        card: '#343148',
        cardText: '#FFFFFF',
        panel: '#121018',
        panelText: '#F4F1EA',
        accent: '#D7C49E',
        number: '#D7C49E',
        heading: '#D7C49E',
        label: '#F4F1EA',
        shadow: '0 -10px 30px rgba(0,0,0,0.4)',
      }
    : {
        bg: '#D7C49E',
        border: '#000000',
        card: '#343148',
        cardText: '#FFFFFF',
        panel: '#D7C49E',
        panelText: '#343148',
        accent: '#343148',
        number: '#343148',
        heading: '#343148',
        label: '#000000',
        shadow: '0 -10px 30px rgba(0,0,0,0.12)',
      };
}

function ExperienceCard({ exp, index, total, isMobile, cardRef, nextRef, innerRef }) {
  const t = getTheme(useIsDark());

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

  const months = parseInt(exp.duration, 10) || 0;
  const GOLD = '#D7C49E';

  return (
    <div
      ref={cardRef}
      style={{
        height: isMobile ? 'auto' : '84vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'flex-end',
        backgroundColor: t.bg,
        zIndex: index + 1,
        marginBottom: isMobile ? '1.25rem' : 0,
        padding: isMobile ? 0 : '0 4vw',
      }}
    >
      <motion.div
        ref={innerRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          minHeight: isMobile ? 'auto' : '72vh',
          maxHeight: isMobile ? 'none' : '80vh',
          scale: isMobile ? 1 : scale,
          opacity: isMobile ? 1 : opacity,
          borderRadius: isMobile ? 24 : 32,
          backgroundColor: t.card,
          boxShadow: t.shadow,
          padding: isMobile ? '2.25rem 1.5rem' : 'clamp(1.75rem, 4vh, 3rem) clamp(2rem, 4vw, 3.75rem)',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          gap: isMobile ? '1.75rem' : '3rem',
          alignItems: 'stretch',
          willChange: isMobile ? 'auto' : 'transform, opacity',
        }}
      >
        {/* Giant outlined index watermark */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-0.04em',
            bottom: '-0.22em',
            fontSize: 'clamp(10rem, 22vw, 22rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.06em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(215,196,158,0.14)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Left: company, role, story, stack, tenure */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
            <span ref={numberRef} className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: GOLD }}>
              {String(index + 1).padStart(2, '0')} / {total.toString().padStart(2, '0')}
            </span>
            <span
              className="mono"
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                padding: '6px 12px',
                borderRadius: 999,
                backgroundColor: index === 0 ? 'rgba(120,220,150,0.14)' : 'rgba(255,255,255,0.08)',
                color: index === 0 ? '#9BE3B0' : 'rgba(255,255,255,0.75)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {index === 0 && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#5FD38A', boxShadow: '0 0 0 3px rgba(95,211,138,0.25)' }} />
              )}
              {index === 0 ? 'CURRENT ROLE' : exp.period.toUpperCase()}
            </span>
          </div>

          <span
            className="mono"
            style={{ marginTop: 'clamp(1rem, 3vh, 1.75rem)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.18em', color: GOLD }}
          >
            {exp.company.toUpperCase()}
          </span>

          <h3
            style={{
              fontSize: 'clamp(2rem, min(4.2vw, 6.5vh), 3.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: t.cardText,
              lineHeight: 1.02,
              margin: '0.5rem 0 0.6rem',
            }}
          >
            {exp.role}
          </h3>

          <span className="mono" style={{ fontSize: '0.72rem', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', marginBottom: 'clamp(0.9rem, 2.4vh, 1.4rem)' }}>
            {exp.location} · {exp.type}
          </span>

          <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.88)', maxWidth: '48ch', marginBottom: 'clamp(1rem, 2.6vh, 1.5rem)' }}>
            {exp.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'clamp(1.25rem, 3vh, 2rem)' }}>
            {exp.tags.map((tag, j) => (
              <span
                key={j}
                ref={(el) => (tagsRef.current[j] = el)}
                className="mono"
                style={{
                  fontSize: '0.68rem',
                  padding: '7px 14px',
                  border: '1px solid rgba(255,255,255,0.22)',
                  borderRadius: '999px',
                  color: t.cardText,
                  letterSpacing: '0.03em',
                  display: 'inline-block',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Tenure bar */}
          <div style={{ marginTop: 'auto', maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)' }}>
                {exp.period.toUpperCase()}
              </span>
              <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: GOLD }}>
                {exp.duration.toUpperCase()}
              </span>
            </div>
            <div style={{ height: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: Math.min(1, months / MAX_MONTHS) }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={{ height: '100%', backgroundColor: GOLD, transformOrigin: 'left center' }}
              />
            </div>
          </div>
        </div>

        {/* Right: numbered contributions */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: t.panel,
            borderRadius: isMobile ? 20 : 24,
            padding: isMobile ? '1.75rem' : 'clamp(1.5rem, 3.5vh, 2.25rem) clamp(1.5rem, 2.5vw, 2.25rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
            <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: t.accent }}>
              KEY CONTRIBUTIONS
            </span>
            <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: `${t.panelText}80` }}>
              {String(exp.highlights.length).padStart(2, '0')}
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {exp.highlights.map((h, j) => (
              <li
                key={j}
                ref={(el) => (highlightsRef.current[j] = el)}
                style={{
                  color: t.panelText,
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  padding: 'clamp(9px, 1.6vh, 14px) 0',
                  borderTop: `1px solid ${t.panelText}26`,
                  display: 'grid',
                  gridTemplateColumns: '2.25rem 1fr',
                  alignItems: 'baseline',
                }}
              >
                <span className="mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: t.accent }}>
                  {String(j + 1).padStart(2, '0')}
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

/* Smooth scroll that cooperates with Lenis when it's exposed as window.lenis */
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function smoothScrollTo(top, duration, done) {
  const lenis = typeof window !== 'undefined' && (window.lenis || window.__lenis);
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(top, { duration: duration / 1000, easing: easeInOutCubic, onComplete: done, force: true });
    return () => {};
  }
  const start = window.scrollY;
  const dist = top - start;
  const t0 = performance.now();
  let raf = 0;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + dist * easeInOutCubic(p));
    if (p < 1) raf = requestAnimationFrame(step);
    else done && done();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/* Floating segmented navigator: shows which role is on screen, click to jump.
   It owns its state, so scrolling never re-renders the cards. */
function RoleNavigator({ experiences, cardRefs, wrapRef, endRef }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const lockRef = useRef(false); // true while a click-jump is animating
  const cancelRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const wrap = wrapRef.current;
      const end = endRef.current;
      if (!wrap || !end) return;
      setVisible(wrap.getBoundingClientRect().top < vh * 0.55 && end.getBoundingClientRect().top > vh * 0.6);
      if (lockRef.current) return; // keep the pill on the clicked role during the jump
      let idx = 0;
      cardRefs.current.forEach((r, i) => {
        const el = r.current;
        if (el && el.getBoundingClientRect().top <= vh * 0.45) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (cancelRef.current) cancelRef.current();
    };
  }, [cardRefs, wrapRef, endRef]);

  const jumpTo = (i) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // natural (un-stuck) position of card i: wrapper top + i * card height
    const top = window.scrollY + wrap.getBoundingClientRect().top + i * window.innerHeight * 0.84 + 2;
    const distance = Math.abs(top - window.scrollY);
    const duration = Math.min(1400, Math.max(600, distance * 0.6));
    if (cancelRef.current) cancelRef.current();
    lockRef.current = true;
    setActive(i);
    cancelRef.current = smoothScrollTo(top, duration, () => {
      lockRef.current = false;
    });
    // safety unlock in case onComplete never fires
    setTimeout(() => {
      lockRef.current = false;
    }, duration + 200);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Jump to role"
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 24, x: '-50%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 28,
            zIndex: 50,
            display: 'flex',
            gap: 4,
            padding: 5,
            borderRadius: 999,
            // solid background (no backdrop blur) keeps scrolling smooth
            backgroundColor: 'rgba(18,16,24,0.94)',
            border: '1px solid rgba(215,196,158,0.22)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            transform: 'translateZ(0)',
          }}
        >
          {experiences.map((exp, i) => {
            const on = i === active;
            return (
              <button
                key={exp.company}
                type="button"
                onClick={() => jumpTo(i)}
                className="mono"
                style={{
                  position: 'relative',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '9px 16px',
                  borderRadius: 999,
                  fontSize: '0.66rem',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  color: on ? '#121018' : 'rgba(244,241,234,0.7)',
                  transition: 'color 0.25s',
                  whiteSpace: 'nowrap',
                }}
              >
                {on && (
                  <motion.span
                    layoutId="role-nav-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 42, mass: 0.8 }}
                    style={{ position: 'absolute', inset: 0, borderRadius: 999, backgroundColor: '#D7C49E', zIndex: 0 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {(exp.navLabel || exp.company.split(' ')[0]).toUpperCase()}
                </span>
              </button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const t = getTheme(useIsDark());
  const cardRefs = useRef([]);
  cardRefs.current = experiences.map((_, i) => cardRefs.current[i] ?? React.createRef());
  const endRef = useRef(null);
  const headingRef = useRef(null);
  const cardsWrapRef = useRef(null);
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
  }, [isMobile]);

  // Mobile: swipeable card deck with highlights bottom sheet
  if (isMobile) {
    return <MobileExperience experiences={experiences} theme={t} sectionRef={sectionRef} />;
  }

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: t.bg,
        borderTop: `1px solid ${t.border}`,
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
        <motion.div style={{ y: labelY }}>
          <SectionLabel index="02" title="Experience" color={t.label} accent={t.accent} style={{ marginBottom: '1.5rem' }} />
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
        <div>
        <h2
          ref={headingRef}
          style={{
            fontSize: isMobile ? 'clamp(2.5rem, 14vw, 4rem)' : 'clamp(4rem, 9vw, 8rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: t.heading,
            margin: 0,
            transformOrigin: 'left center',
          }}
        >
          WORK<br />HISTORY
        </h2>
        </div>
        <div style={{ display: 'flex', gap: '3.5rem', paddingBottom: '0.6rem' }}>
          {[
            { v: '~3', l: 'Years' },
            { v: '04', l: 'Companies' },
            // { v: '02', l: 'Countries' },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', color: t.heading, lineHeight: 1 }}>
                {s.v}
              </div>
              <div className="mono" style={{ marginTop: 8, fontSize: '0.65rem', letterSpacing: '0.15em', color: t.label, textTransform: 'uppercase' }}>
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>

      {/* Stacked rising cards, one per role */}
      <div ref={cardsWrapRef} style={{ position: 'relative', zIndex: 1 }}>
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

      <RoleNavigator experiences={experiences} cardRefs={cardRefs} wrapRef={cardsWrapRef} endRef={endRef} />
    </section>
  );
}