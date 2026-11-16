import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, cubicBezier } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MobileExperience from './MobileExperience';
import { useIsMobile, useIsDark, useIsTablet, useIsShort, SectionLabel } from '../lib/ui';
import bbdoBg from '../assets/images/bbdo-bg.jpeg';
import bbdoLogo from '../assets/images/bbdo.png';
import duofankaarBg from '../assets/images/df-bg.jpg';
import duofankaarLogo from '../assets/images/duofankaar.png';
import sybrosBg from '../assets/images/sb-bg.jpg';
import sybrosLogo from '../assets/images/sybros.png';
import samsungBg from '../assets/images/ss-bg.jpg';
import samsungLogo from '../assets/images/samsung.png';

gsap.registerPlugin(ScrollTrigger);

const ease = cubicBezier(0.75, 0, 0.25, 1);
const MAX_MONTHS = 13; // longest tenure, used to scale the tenure bars
const GOLD_HEX = '#D7C49E';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

/* Decode effect: scrambles a text node and resolves it left to right.
   Writes to the existing text node (nodeValue) so React keeps ownership of it. */
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
function scrambleText(el, finalText, duration = 800, delay = 0) {
  const node = el && el.firstChild;
  if (!node || node.nodeType !== 3) return () => {};
  let raf = 0;
  let t0 = 0;
  const tick = (now) => {
    if (!t0) t0 = now + delay;
    const p = Math.max(0, Math.min(1, (now - t0) / duration));
    const revealed = Math.floor(finalText.length * p);
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      const c = finalText[i];
      if (i < revealed || c === ' ' || /[^A-Za-z0-9]/.test(c)) out += c;
      else {
        const set = c === c.toLowerCase() && /[a-z]/.test(c) ? LOWER : UPPER;
        out += set[(Math.random() * set.length) | 0];
      }
    }
    node.nodeValue = out;
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    node.nodeValue = finalText;
  };
}

const experiences = [
  {
    role: 'Software Developer',
    company: 'IMPACT BBDO',
    image: bbdoBg,
    image2: bbdoLogo,
    logoDarkBg: true,
    logoClip: '3% 3% 8% 3%',
    pos: 'center 40%',
    pos2: 'center',
    navLabel: 'BBDO', // short name shown in the floating company bar
    location: 'Dubai, UAE',
    type: 'On-Site · Full Time',
    period: 'Apr 2026 – Present',
    duration: '8 months',
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
    image: duofankaarBg,
    image2: duofankaarLogo,
    pos: 'center 40%',
    pos2: 'center',
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
    image: sybrosBg,
    image2: sybrosLogo,
    pos: 'center 40%',
    pos2: 'center',
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
    image: samsungBg,
    image2: samsungLogo,
    logoDarkBg: true,
    logoSize: 'clamp(130px, 13vw, 190px)',
    pos: 'center 40%',
    pos2: 'center',
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
  const isDark = useIsDark();
  const isTablet = useIsTablet();
  const isShort = useIsShort();
  // On short screens trim long text so the card always fits inside its frame
  const clamp = (lines) => (isShort && !isMobile ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {});
  const t = getTheme(isDark);

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
  const surfaceRef = useRef(null); // the visible card (motion.div)
  const companyRef = useRef(null);
  const roleRef = useRef(null);
  const listRef = useRef(null);
  const barRef = useRef(null);
  const counterRef = useRef(null);
  const magRefs = useRef([]); // wrappers around each tag that drift toward the cursor
  const logoRef = useRef(null);

  /* ---- Decode: company + role scramble into place when the card arrives ---- */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let stops = [];
    const run = () => {
      stops.forEach((s) => s());
      stops = [
        scrambleText(companyRef.current, exp.company.toUpperCase(), 700),
        scrambleText(roleRef.current, exp.role, 900, 150),
      ];
    };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: cardRef.current, start: 'top 70%', onEnter: run });
    }, cardRef);
    return () => {
      stops.forEach((s) => s());
      ctx.revert();
    };
  }, [cardRef, exp.company, exp.role]);

  /* ---- Contribution spotlight: points light up one at a time while this card is on top ---- */
  useEffect(() => {
    const list = listRef.current;
    const items = highlightsRef.current.filter(Boolean);
    if (!list || !items.length || prefersReducedMotion()) return;
    const n = items.length;
    const pad = (x) => String(x).padStart(2, '0');
    let k = 0;
    let timer = 0;
    let startDelay = 0;
    let hovering = false;

    const show = (i) => {
      items.forEach((li, j) => {
        const on = i < 0 || j === i;
        li.querySelectorAll('[data-dim]').forEach((el) => (el.style.opacity = on ? 1 : 0.35));
        const txt = li.querySelector('[data-text]');
        if (txt) txt.style.transform = i >= 0 && j === i ? 'translateX(6px)' : 'none';
      });
      const bar = barRef.current;
      if (bar) {
        if (i < 0) bar.style.opacity = 0;
        else {
          bar.style.opacity = 1;
          bar.style.transform = `translateY(${items[i].offsetTop}px)`;
          bar.style.height = `${items[i].offsetHeight}px`;
        }
      }
      const c = counterRef.current?.firstChild;
      if (c) c.nodeValue = i < 0 ? pad(n) : `${pad(i + 1)} / ${pad(n)}`;
    };

    const start = () => {
      clearTimeout(startDelay);
      clearInterval(timer);
      // wait for the slide-in of the list to finish first
      startDelay = setTimeout(() => {
        k = 0;
        show(k);
        timer = setInterval(() => {
          if (hovering) return;
          k = (k + 1) % n;
          show(k);
        }, 1400); // time each contribution stays lit
      }, 500); // short wait for the list to slide in first
    };
    const stop = () => {
      clearTimeout(startDelay);
      clearInterval(timer);
      show(-1);
    };

    // hovering a point spotlights it and pauses the cycle
    const enters = items.map((li, j) => {
      const fn = () => {
        hovering = true;
        k = j;
        show(j);
      };
      li.addEventListener('mouseenter', fn);
      return fn;
    });
    const onLeave = () => (hovering = false);
    list.addEventListener('mouseleave', onLeave);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 40%',
        endTrigger: nextRef?.current || cardRef.current,
        end: nextRef?.current ? 'top 40%' : 'bottom top',
        onToggle: (self) => (self.isActive ? start() : stop()),
      });
    }, cardRef);

    return () => {
      stop();
      items.forEach((li, j) => li.removeEventListener('mouseenter', enters[j]));
      list.removeEventListener('mouseleave', onLeave);
      ctx.revert();
    };
  }, [cardRef, nextRef, exp.highlights.length]);

  /* ---- Magnetic details: tags and logo drift toward the cursor ---- */
  useEffect(() => {
    const card = surfaceRef.current;
    if (!card || isMobile || !hasFinePointer() || prefersReducedMotion()) return;
    let raf = 0;
    let mx = 0;
    let my = 0;

    const targets = () => [
      ...magRefs.current.filter(Boolean).map((el) => ({ el, radius: 150, strength: 0.35, max: 12, tag: true })),
      ...(logoRef.current ? [{ el: logoRef.current, radius: 280, strength: 0.18, max: 22 }] : []),
    ];

    const apply = () => {
      raf = 0;
      targets().forEach(({ el, radius, strength, max, tag }) => {
        const [cx, cy] = el._mag || [0, 0]; // remove our own offset so it doesn't feed back
        const r = el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2 - cx);
        const dy = my - (r.top + r.height / 2 - cy);
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / radius) * strength;
        const tx = Math.max(-max, Math.min(max, dx * f));
        const ty = Math.max(-max, Math.min(max, dy * f));
        el._mag = [tx, ty];
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        if (tag && el.firstElementChild) el.firstElementChild.style.borderColor = f > 0.08 ? GOLD_HEX : '';
      });
    };
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      targets().forEach(({ el, tag }) => {
        el._mag = [0, 0];
        el.style.transform = 'translate3d(0,0,0)';
        if (tag && el.firstElementChild) el.firstElementChild.style.borderColor = '';
      });
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

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
        // Only the first card's wrapper is filled: it stays stuck behind the whole
        // stack and hides the WORK HISTORY heading. The others are transparent, so
        // the empty strip above each rising card no longer shows as a dark box
        // over the card underneath.
        backgroundColor: index === 0 ? t.bg : 'transparent',
        zIndex: index + 1,
        marginBottom: isMobile ? '1.25rem' : 0,
        // caps the card width on ultra-wide screens
        padding: isMobile ? 0 : '0 max(4vw, calc((100vw - 1760px) / 2))',
      }}
    >
      <motion.div
        ref={(el) => {
          surfaceRef.current = el;
          if (innerRef && typeof innerRef === 'object') innerRef.current = el;
        }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          minHeight: isMobile ? 'auto' : isShort ? '76vh' : '72vh',
          maxHeight: isMobile ? 'none' : isShort ? '82vh' : '80vh',
          scale: isMobile ? 1 : scale,
          opacity: isMobile ? 1 : opacity,
          borderRadius: isMobile ? 24 : 32,
          background: exp.image
            ? `linear-gradient(90deg, rgba(38,35,58,0.97) 0%, rgba(38,35,58,0.9) 50%, rgba(38,35,58,0.85) 100%), url(${exp.image}) ${exp.pos || 'center'} / ${exp.size || '75%'} no-repeat ${t.card}`
            : t.card,
          boxShadow: t.shadow,
          padding: isMobile ? '2.25rem 1.5rem' : isTablet ? 'clamp(1.25rem, 3vh, 2rem) clamp(1.25rem, 3vw, 2rem)' : 'clamp(1.75rem, 4vh, 3rem) clamp(2rem, 4vw, 3.75rem)',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.1fr 0.9fr',
          gap: isMobile ? '1.75rem' : isTablet ? '1.5rem' : '3rem',
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
            ref={companyRef}
            className="mono"
            style={{ marginTop: 'clamp(1rem, 3vh, 1.75rem)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.18em', color: GOLD }}
          >
            {exp.company.toUpperCase()}
          </span>

          <h3
            ref={roleRef}
            style={{
              fontSize: isTablet ? 'clamp(1.6rem, min(4vw, 6vh), 2.4rem)' : 'clamp(2rem, min(4.2vw, 6.5vh), 3.6rem)',
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

          <p style={{ fontSize: isTablet ? '0.9rem' : '1rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.88)', maxWidth: '48ch', marginBottom: 'clamp(1rem, 2.6vh, 1.5rem)', ...clamp(3) }}>
            {exp.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'clamp(1.25rem, 3vh, 2rem)' }}>
            {exp.tags.map((tag, j) => (
              // outer span = magnetic drift, inner span = GSAP pop-in (kept separate so they don't fight)
              <span
                key={j}
                ref={(el) => (magRefs.current[j] = el)}
                style={{ display: 'inline-block', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', willChange: 'transform' }}
              >
                <span
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
                    transition: 'border-color 0.25s',
                  }}
                >
                  {tag}
                </span>
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
            padding: isMobile ? '1.75rem' : isTablet ? 'clamp(1rem, 2.5vh, 1.5rem) clamp(1rem, 2vw, 1.5rem)' : 'clamp(1.5rem, 3.5vh, 2.25rem) clamp(1.5rem, 2.5vw, 2.25rem)',
            minWidth: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {exp.image2 && (
            <img
              ref={logoRef}
              src={exp.image2}
              alt=""
              aria-hidden="true"
              style={{
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'absolute',
                right: 'clamp(1rem, 2vw, 1.75rem)',
                bottom: 'clamp(1rem, 2vw, 1.75rem)',
                width: exp.logoSize || 'clamp(90px, 9vw, 130px)',
                height: 'auto',
                objectFit: 'contain',
                filter: (exp.logoDarkBg ? 'grayscale(1) contrast(2.5)' : 'grayscale(1) invert(1) contrast(1.2)') + (isDark ? '' : ' invert(1)'),
                clipPath: exp.logoClip ? `inset(${exp.logoClip})` : 'none',
                mixBlendMode: isDark ? 'screen' : 'multiply',
                opacity: 0.35,
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: -1,
              }}
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
            <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: t.accent }}>
              KEY CONTRIBUTIONS
            </span>
            <span ref={counterRef} className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: `${t.panelText}80` }}>
              {String(exp.highlights.length).padStart(2, '0')}
            </span>
          </div>
          <ul ref={listRef} style={{ listStyle: 'none', padding: 0, margin: 0, position: 'relative' }}>
            {/* spotlight bar that slides to the active point */}
            <li
              ref={barRef}
              aria-hidden="true"
              role="presentation"
              style={{
                position: 'absolute',
                left: -10,
                top: 0,
                width: 2,
                height: 0,
                borderRadius: 2,
                backgroundColor: t.accent,
                opacity: 0,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s',
                pointerEvents: 'none',
              }}
            />
            {exp.highlights.map((h, j) => (
              <li
                key={j}
                ref={(el) => (highlightsRef.current[j] = el)}
                style={{
                  color: t.panelText,
                  fontSize: isTablet || isShort ? '0.84rem' : '0.92rem',
                  lineHeight: 1.55,
                  padding: 'clamp(9px, 1.6vh, 14px) 0',
                  borderTop: `1px solid ${t.panelText}26`,
                  display: 'grid',
                  gridTemplateColumns: '2.25rem 1fr',
                  alignItems: 'baseline',
                }}
              >
                <span data-dim className="mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: t.accent, transition: 'opacity 0.3s ease' }}>
                  {String(j + 1).padStart(2, '0')}
                </span>
                <span
                  data-dim
                  data-text
                  style={{ ...clamp(2), transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  {h}
                </span>
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
  const [segs, setSegs] = useState([]); // { left, width } of each button inside the bar
  const [drag, setDrag] = useState(null); // { left, width, idx } while dragging
  const lockRef = useRef(false); // true while a click-jump is animating
  const cancelRef = useRef(null);
  const navRef = useRef(null);
  const btnRefs = useRef([]);
  const dragRef = useRef(null);
  const suppressClickUntil = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const wrap = wrapRef.current;
      const end = endRef.current;
      if (!wrap || !end) return;
      setVisible(wrap.getBoundingClientRect().top < vh * 0.55 && end.getBoundingClientRect().top > vh * 0.6);
      if (lockRef.current || dragRef.current?.moved) return; // keep the pill where the user put it
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

  // Measure each segment so the pill knows where to sit
  useLayoutEffect(() => {
    if (!visible) return;
    const measure = () =>
      setSegs(btnRefs.current.map((b) => (b ? { left: b.offsetLeft, width: b.offsetWidth } : { left: 0, width: 0 })));
    measure();
    document.fonts?.ready?.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [visible, experiences.length]);

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

  /* ---- Drag the gold pill (iPhone segmented-control style) ---- */
  const localX = (e) => {
    const n = navRef.current;
    return e.clientX - n.getBoundingClientRect().left - n.clientLeft;
  };
  const indexAt = (x) => {
    let best = 0;
    let bestD = Infinity;
    segs.forEach((s, i) => {
      const d = Math.abs(s.left + s.width / 2 - x);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  };

  const onPointerDown = (e) => {
    if (e.button !== 0 || !segs.length) return;
    const x = localX(e);
    const s = segs[active];
    if (!s || x < s.left || x > s.left + s.width) return; // only the gold pill is draggable
    dragRef.current = { id: e.pointerId, startX: x, offset: x - s.left, w0: s.width, moved: false, idx: active };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const x = localX(e);
    if (!d.moved) {
      if (Math.abs(x - d.startX) < 4) return; // small movement = tap, not drag
      d.moved = true;
      navRef.current.setPointerCapture(e.pointerId);
    }
    const center = x - d.offset + d.w0 / 2;
    const idx = indexAt(center);
    const w = segs[idx].width;
    const first = segs[0];
    const last = segs[segs.length - 1];
    const left = Math.max(first.left, Math.min(last.left + last.width - w, center - w / 2));
    d.idx = idx;
    setDrag({ left, width: w, idx });
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (!d.moved) return; // plain tap: the button's onClick handles it
    suppressClickUntil.current = performance.now() + 300;
    setDrag(null);
    if (d.idx !== active) jumpTo(d.idx);
  };

  const pill = drag || segs[active];
  const shown = drag ? drag.idx : active;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          ref={navRef}
          aria-label="Jump to role"
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 24, x: '-50%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 'max(24px, env(safe-area-inset-bottom))',
            maxWidth: 'calc(100vw - 32px)',
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
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* Gold pill: follows the pointer while dragging, springs into place otherwise */}
          {pill && (
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ x: pill.left, width: pill.width, scale: drag ? 1.06 : 1 }}
              transition={
                drag
                  ? {
                      x: { type: 'spring', stiffness: 1400, damping: 70 },
                      width: { type: 'spring', stiffness: 700, damping: 45 },
                      scale: { duration: 0.2 },
                    }
                  : { type: 'spring', stiffness: 500, damping: 42, mass: 0.8 }
              }
              style={{
                position: 'absolute',
                top: 5,
                bottom: 5,
                left: 0,
                borderRadius: 999,
                backgroundColor: '#D7C49E',
                boxShadow: 'none',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          {experiences.map((exp, i) => {
            const on = i === shown;
            return (
              <button
                key={exp.company}
                ref={(el) => (btnRefs.current[i] = el)}
                type="button"
                onClick={() => {
                  if (performance.now() < suppressClickUntil.current) return;
                  jumpTo(i);
                }}
                className="mono"
                style={{
                  position: 'relative',
                  border: 'none',
                  background: 'transparent',
                  cursor: i === active ? (drag ? 'grabbing' : 'grab') : 'pointer',
                  padding: '9px 16px',
                  borderRadius: 999,
                  fontSize: '0.66rem',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  color: on ? '#121018' : 'rgba(244,241,234,0.7)',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
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
          padding: isMobile ? '4rem 5vw 2rem' : '0 var(--gutter, 6vw) clamp(2.5rem, 8vh, 5rem)',
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