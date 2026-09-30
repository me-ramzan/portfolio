import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillGroups = [
  { category: 'Programming & Scripting', icon: '{ }', skills: ['JavaScript', 'TypeScript', 'Python', 'React.js', 'Node.js', 'C/C++', 'VB.NET'] },
  { category: 'RPA & Automation', icon: '⚙', skills: ['UiPath', 'Power Automate', 'Automation Anywhere', 'n8n'] },
  { category: 'AI/ML & Workflow Tools', icon: '◈', skills: ['OpenAI Whisper', 'Docker', 'ML Model Integration', 'LLM Pipelines'] },
  { category: 'Web & API Tools', icon: '⌁', skills: ['REST APIs', 'Postman', 'Selenium', 'npm', 'CPanel'] },
  { category: 'Databases & Cloud', icon: '▣', skills: ['MySQL', 'MongoDB', 'Google Cloud'] },
  { category: 'Systems & Platforms', icon: '◻', skills: ['HubSpot', 'Zoho CRM', 'SAP Fiori', 'SharePoint', 'Ghost CMS'] },
];

const EASE = [0.16, 1, 0.3, 1];

function useIsMobile(bp = 768) {
  const [m, setM] = useState(window.innerWidth <= bp);
  useEffect(() => {
    const h = () => setM(window.innerWidth <= bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return m;
}

function MagneticCard({ group, index, isMobile, cardRef }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        border: '1px solid #000',
        borderRadius: '10px',
        padding: '1.6rem',
        overflow: 'hidden',
        backgroundColor: '#D7C49E',
        cursor: 'default',
        willChange: 'transform',
        opacity: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        aria-hidden
        initial={{ x: '-130%' }}
        animate={hovered ? { x: '130%' } : { x: '-130%' }}
        transition={{ duration: 1, ease: EASE }}
        style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(115deg, transparent, rgba(255,255,255,0.25), transparent)', pointerEvents: 'none' }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <motion.span
          animate={hovered ? { rotate: 12, scale: 1.2, color: '#8a2be2' } : { rotate: 0, scale: 1, color: '#343148' }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.05rem', fontWeight: 700 }}
        >
          {group.icon}
        </motion.span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.02em', color: '#080808' }}>{group.category}</span>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {group.skills.map((skill, j) => (
          <motion.span
            key={j}
            className="mono"
            whileHover={isMobile ? {} : { y: -3, scale: 1.08, backgroundColor: '#8a2be2', transition: { duration: 0.2 } }}
            style={{ fontSize: '0.65rem', padding: '4px 10px', backgroundColor: '#343148', border: '1px solid #424040', borderRadius: '3px', color: '#f4f1ea', letterSpacing: '0.04em' }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const cardRefs = useRef([]);
  const titleRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const labelY = useSpring(useTransform(scrollYProgress, [0, 1], [60, -60]), { stiffness: 100, damping: 24, mass: 0.6 });
  const underlineWidth = useTransform(scrollYProgress, [0, 0.4], ['0%', '100%']);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.95]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered 3D card entrance with skew, driven by GSAP for a snappier feel
      gsap.fromTo(
        cardRefs.current,
        { autoAlpha: 0, y: 90, rotateX: -25, skewY: 4, scale: 0.92 },
        {
          autoAlpha: 1, y: 0, rotateX: 0, skewY: 0, scale: 1,
          duration: 1.1, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );

      // Magnetic tilt via GSAP quickTo — smoother, GPU-friendlier than per-frame React state
      cardRefs.current.forEach((el) => {
        if (!el || isMobile) return;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        const rxTo = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power3.out' });
        const ryTo = gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power3.out' });

        el.style.transformPerspective = '800px';
        el.style.transformStyle = 'preserve-3d';

        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          xTo(px * 24);
          yTo(py * 24);
          rxTo(py * -10);
          ryTo(px * 10);
          gsap.to(el, { boxShadow: '0 30px 60px rgba(0,0,0,0.25)', borderColor: '#343148', duration: 0.3 });
        };
        const onLeave = () => {
          xTo(0); yTo(0); rxTo(0); ryTo(0);
          gsap.to(el, { boxShadow: '0 0px 0px rgba(0,0,0,0)', borderColor: '#000000', duration: 0.4 });
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        el._cleanup = () => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        };
      });

      // Skill pills stagger-pop within each card as it enters
      cardRefs.current.forEach((el) => {
        if (!el) return;
        const pills = el.querySelectorAll('.mono');
        gsap.fromTo(
          pills,
          { opacity: 0, y: 10, scale: 0.85 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.04, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      });

      // GSAP text scramble/decrypt on the heading, ScrollTrigger driven
      if (titleRef.current) {
        const original = 'Technical\nArsenal';
        const chars = '!<>-_\\/[]{}—=+*^?#';
        const el = titleRef.current;
        const state = { progress: 0 };
        gsap.to(state, {
          progress: 1,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          onUpdate: () => {
            const reveal = state.progress;
            const out = original.split('').map((c, i) => {
              if (c === ' ' || c === '\n') return c;
              const charPoint = i / original.length;
              if (reveal > charPoint + 0.15) return c;
              return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            el.innerHTML = out.split('\n').join('<br/>');
          },
          onComplete: () => {
            el.innerHTML = original.split('\n').join('<br/>');
          },
        });
      }
    }, sectionRef);

    return () => {
      cardRefs.current.forEach((el) => el && el._cleanup && el._cleanup());
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ position: 'relative', padding: isMobile ? '4rem 5vw' : '10vw 6vw', backgroundColor: '#D7C49E', borderTop: '1px solid #000', overflow: 'hidden' }}
    >
      <motion.div
        aria-hidden
        style={{
          position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px',
          rotate: bgRotate, scale: bgScale, pointerEvents: 'none', zIndex: 0,
          border: '1px dashed rgba(52,49,72,0.15)', borderRadius: '50%',
        }}
      />
      <motion.div
        aria-hidden
        style={{
          position: 'absolute', top: '-10%', right: '0%', width: '420px', height: '420px',
          rotate: useTransform(bgRotate, (r) => -r * 1.4), pointerEvents: 'none', zIndex: 0,
          border: '1px solid rgba(52,49,72,0.1)', borderRadius: '50%',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr', gap: isMobile ? '2rem' : '4rem', alignItems: 'start' }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          style={isMobile ? {} : { position: 'sticky', top: '100px', y: labelY }}
        >
          <motion.span
            className="mono"
            animate={{ letterSpacing: ['0.15em', '0.25em', '0.15em'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: '#000', fontSize: '0.7rem', display: 'inline-block' }}
          >
            04 / SKILLS
          </motion.span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#343148', marginTop: '12px', overflow: 'hidden' }}>
            <motion.div style={{ width: underlineWidth, height: '100%', backgroundColor: '#343148' }} />
          </div>
          <h2
            ref={titleRef}
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 700,
              letterSpacing: '-0.02em', marginTop: '1.5rem', lineHeight: 1.2, color: '#343148',
            }}
          >
            Technical<br />Arsenal
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: isMobile ? '1rem' : '1.5rem' }}>
          {skillGroups.map((group, i) => (
            <MagneticCard key={i} group={group} index={i} isMobile={isMobile} cardRef={(el) => (cardRefs.current[i] = el)} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ position: 'relative', zIndex: 1, marginTop: isMobile ? '2.5rem' : '4rem', paddingTop: isMobile ? '1.5rem' : '2.5rem', borderTop: '1px solid #000', display: 'flex', gap: isMobile ? '1rem 2rem' : '3rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <span className="mono" style={{ color: '#343148', fontSize: '0.7rem', letterSpacing: '0.15em' }}>LANGUAGES</span>
        {[{ lang: 'English', level: 'Fluent' }, { lang: 'Hindi', level: 'Fluent' }, { lang: 'Urdu', level: 'Native' }].map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
            whileHover={isMobile ? {} : { y: -3, scale: 1.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.lang}</span>
            <span className="mono" style={{ fontSize: '0.65rem', color: '#f4f1ea', backgroundColor: '#343148', border: '1px solid #343148', padding: '3px 8px', borderRadius: '3px' }}>{l.level}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}