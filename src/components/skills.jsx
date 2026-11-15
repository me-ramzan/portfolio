import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import MobileSkills from './MobileSkillsPhysics';
import { useIsMobile, useIsDark, useIsTablet, useIsShort, SectionLabel, EASE } from '../lib/ui';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Used by the mobile physics version — keep this shape
const skillGroups = [
  { category: 'Programming & Scripting', icon: '{ }', skills: ['JavaScript', 'TypeScript', 'Python', 'React.js', 'Node.js', 'C/C++', 'VB.NET'] },
  { category: 'RPA & Automation', icon: '⚙', skills: ['UiPath', 'Power Automate', 'Automation Anywhere', 'n8n'] },
  { category: 'AI/ML & Workflow Tools', icon: '◈', skills: ['OpenAI Whisper', 'Docker', 'ML Model Integration', 'LLM Pipelines'] },
  { category: 'Web & API Tools', icon: '⌁', skills: ['REST APIs', 'Postman', 'Selenium', 'npm', 'CPanel'] },
  { category: 'Databases & Cloud', icon: '▣', skills: ['MySQL', 'MongoDB', 'Google Cloud'] },
  { category: 'Systems & Platforms', icon: '◻', skills: ['HubSpot', 'Zoho CRM', 'SAP Fiori', 'SharePoint', 'Ghost CMS'] },
];

// Desktop: the toolkit as a workflow, idea → production. Edit freely.
const STAGES = [
  {
    step: 'Think',
    glyph: '◈',
    title: 'AI Automation',
    outcome: 'Workflows that think and run themselves.',
    tools: ['n8n', 'LLM Pipelines', 'Python', 'OpenAI Whisper', 'ML Model Integration'],
  },
  {
    step: 'Automate',
    glyph: '⚙',
    title: 'Enterprise RPA',
    outcome: 'Manual, repetitive work taken off your team.',
    tools: ['UiPath', 'Power Automate', 'Automation Anywhere', 'SAP Fiori', 'VB.NET', 'Selenium'],
  },
  {
    step: 'Build',
    glyph: '{ }',
    title: 'Full-Stack Web',
    outcome: 'Fast, polished products people enjoy using.',
    tools: ['React.js', 'JavaScript', 'TypeScript', 'Node.js', 'REST APIs', 'MySQL', 'MongoDB', 'npm', 'C/C++'],
  },
  {
    step: 'Ship',
    glyph: '↗',
    title: 'Integrations & Delivery',
    outcome: 'Connected, deployed and kept running.',
    tools: ['HubSpot', 'Zoho CRM', 'SharePoint', 'Ghost CMS', 'Docker', 'Google Cloud', 'CPanel', 'Postman'],
  },
];

const LANGUAGES = [
  { lang: 'English', level: 'Fluent' },
  { lang: 'Hindi', level: 'Fluent' },
  { lang: 'Urdu', level: 'Native' },
];

const GOLD = '#D7C49E';
const NAVY = '#343148';
const GREEN = '#5FD38A';

// How long the section stays locked (in screen heights) while the workflow runs
const LOCK_SCREENS = 2.4;

/* ---- Workflow canvas geometry (percent of the canvas) ---- */
const NODE_W = 20; // % of canvas width
const NODE_H = 18; // % of canvas height
const NODE_X = [2, 26, 50, 74]; // left edge of each node
const NODE_Y = [8, 30, 52, 74]; // top edge of each node
const VB_W = 1000;
const VB_H = 562.5; // 16:9

// Bezier wire from node i's output (right side) to node i+1's input (left side)
const wirePath = (i) => {
  const x1 = (NODE_X[i] + NODE_W) * (VB_W / 100);
  const y1 = (NODE_Y[i] + NODE_H / 2) * (VB_H / 100);
  const x2 = NODE_X[i + 1] * (VB_W / 100);
  const y2 = (NODE_Y[i + 1] + NODE_H / 2) * (VB_H / 100);
  const dx = 70;
  return { d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, x1, y1, x2, y2 };
};

function getTheme(isDark) {
  return isDark
    ? {
        bg: '#121018',
        border: '#343148',
        text: '#F4F1EA',
        muted: 'rgba(244,241,234,0.5)',
        accent: GOLD,
        line: '#2a2739',
        canvas: '#17151f',
        canvasBorder: '#2a2739',
        dots: 'rgba(244,241,234,0.07)',
        wire: 'rgba(244,241,234,0.12)',
        wireOn: GOLD,
        flow: '#121018',
        node: NAVY,
        nodeOff: 'rgba(244,241,234,0.04)',
        nodeOffText: 'rgba(244,241,234,0.4)',
        nodeOffBorder: 'rgba(244,241,234,0.1)',
        toolbar: 'rgba(244,241,234,0.45)',
        // kept for MobileSkillsPhysics
        hoverBorder: GOLD,
        cardBg: '#121018',
        pillBg: NAVY,
        pillBorder: '#4a4666',
        ring1: 'rgba(215,196,158,0.15)',
        ring2: 'rgba(215,196,158,0.1)',
        shadow: '0 24px 50px rgba(0,0,0,0.45)',
      }
    : {
        bg: '#D7C49E',
        border: '#000000',
        text: '#121018',
        muted: 'rgba(18,16,24,0.55)',
        accent: NAVY,
        line: 'rgba(52,49,72,0.25)',
        canvas: 'rgba(255,255,255,0.22)',
        canvasBorder: 'rgba(52,49,72,0.22)',
        dots: 'rgba(52,49,72,0.16)',
        wire: 'rgba(52,49,72,0.2)',
        wireOn: NAVY,
        flow: GOLD,
        node: NAVY,
        nodeOff: 'rgba(255,255,255,0.3)',
        nodeOffText: 'rgba(18,16,24,0.45)',
        nodeOffBorder: 'rgba(52,49,72,0.18)',
        toolbar: 'rgba(18,16,24,0.55)',
        hoverBorder: NAVY,
        cardBg: '#D7C49E',
        pillBg: NAVY,
        pillBorder: '#424040',
        ring1: 'rgba(52,49,72,0.15)',
        ring2: 'rgba(52,49,72,0.1)',
        shadow: '0 24px 50px rgba(52,49,72,0.25)',
      };
}

const TOTAL_TOOLS = STAGES.reduce((n, s) => n + s.tools.length, 0);
const LAST = STAGES.length - 1;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

/* One wire: faint track, a solid line that draws itself with scroll,
   and a moving "data flow" dash once the wire is complete */
function Wire({ i, prog, t }) {
  const { d, x1, y1, x2, y2 } = wirePath(i);
  const offset = useTransform(prog, (p) => 1 - clamp01(p * LAST - i));
  const flowOpacity = useTransform(prog, (p) => (p * LAST >= i + 0.98 ? 1 : 0));
  const endOpacity = useTransform(prog, (p) => (p * LAST >= i + 0.98 ? 1 : 0.35));
  return (
    <g>
      <path d={d} fill="none" stroke={t.wire} strokeWidth="3" strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke={t.wireOn}
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        style={{ strokeDashoffset: offset }}
      />
      <motion.path
        className="sk-flow"
        d={d}
        fill="none"
        stroke={t.flow}
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.012 0.033"
        style={{ opacity: flowOpacity }}
      />
      {/* ports */}
      <circle cx={x1} cy={y1} r="6" fill={t.wireOn} />
      <motion.circle cx={x2} cy={y2} r="6" fill={t.wireOn} style={{ opacity: endOpacity }} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop: the section locks and a workflow runs as you scroll.       */
/* Each stage is a node; the wire draws itself to the next one.        */
/* ------------------------------------------------------------------ */
export default function Skills() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isShort = useIsShort();
  const isDark = useIsDark();
  const t = getTheme(isDark);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const triggerRef = useRef(null);
  const activeRef = useRef(0);
  const prog = useMotionValue(0);
  const [active, setActive] = useState(0);

  // Lock the section and turn scroll into workflow progress
  useLayoutEffect(() => {
    if (isMobile) return undefined;
    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * LOCK_SCREENS}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          prog.set(self.progress);
          const idx = Math.min(LAST, Math.round(self.progress * LAST));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    }, sectionRef);
    const refresh = () => ScrollTrigger.refresh();
    const late = setTimeout(refresh, 800);
    window.addEventListener('load', refresh);
    return () => {
      clearTimeout(late);
      window.removeEventListener('load', refresh);
      ctx.revert();
      triggerRef.current = null;
    };
  }, [isMobile, prog]);

  // Mobile: physics playground
  if (isMobile) {
    return <MobileSkills skillGroups={skillGroups} theme={t} sectionRef={sectionRef} />;
  }

  // Click a stage or node: scroll to the point where that node is running
  const goTo = (i) => {
    const st = triggerRef.current;
    if (!st) return;
    const top = st.start + (st.end - st.start) * (i / LAST) + 2;
    if (window.lenis?.scrollTo) window.lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  const progress = (active + 1) / STAGES.length;
  const panelBg = isDark ? NAVY : 'rgba(52,49,72,0.96)';
  const cur = STAGES[active];

  return (
    // Stable wrappers: GSAP wraps the pinned stage in a pin-spacer
    <div style={{ display: 'contents' }}>
      <style>{`
        @keyframes skFlow { to { stroke-dashoffset: -0.09; } }
        .sk-flow { animation: skFlow 1.1s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .sk-flow { animation: none; } }
      `}</style>
      <section id="skills" ref={sectionRef} style={{ position: 'relative', backgroundColor: t.bg, borderTop: `1px solid ${t.border}` }}>
        <div>
          <div
            ref={stageRef}
            style={{
              position: 'relative',
              height: '100vh',
              minHeight: 560,
              boxSizing: 'border-box',
              padding: 'clamp(84px, 12vh, 112px) var(--gutter, 6vw) clamp(24px, 5vh, 48px)',
              backgroundColor: t.bg,
              display: 'grid',
              gridTemplateColumns: isTablet ? 'minmax(210px, 0.75fr) 1.25fr' : 'minmax(280px, 0.85fr) 1.15fr',
              gap: isTablet ? '4vw' : '5vw',
              alignItems: 'center',
            }}
          >
            {/* ── Left: heading + stages ── */}
            <div style={{ minWidth: 0 }}>
              <SectionLabel index="04" title="Skills" color={t.text} accent={t.accent} style={{ marginBottom: isShort ? '1.5rem' : '2.5rem' }} />
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} style={{ overflow: 'hidden' }}>
                <motion.h2
                  variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
                  transition={{ duration: 1, ease: EASE }}
                  style={{
                    fontSize: isShort ? 'clamp(2.2rem, min(4.6vw, 8vh), 4rem)' : isTablet ? 'clamp(2.2rem, 5vw, 3.6rem)' : 'clamp(2.8rem, 5vw, 5rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.045em',
                    lineHeight: 0.95,
                    color: t.text,
                    margin: 0,
                    paddingTop: '0.04em',
                    paddingBottom: '0.26em',
                    marginBottom: '-0.16em',
                  }}
                >
                  How I build<span style={{ color: t.accent }}>.</span>
                </motion.h2>
              </motion.div>

              {/* Stage list */}
              <div style={{ marginTop: 'clamp(1rem, 3.5vh, 2.5rem)', position: 'relative', paddingLeft: 22 }}>
                <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 2, backgroundColor: t.line, borderRadius: 2 }}>
                  <motion.div
                    animate={{ scaleY: progress }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ width: '100%', height: '100%', backgroundColor: t.accent, transformOrigin: 'top', borderRadius: 2 }}
                  />
                </div>
                {STAGES.map((s, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => goTo(i)}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 14,
                        width: '100%',
                        padding: 'clamp(4px, 1vh, 10px) 0',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        font: 'inherit',
                      }}
                    >
                      <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: on ? t.accent : t.muted, minWidth: 22 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <motion.span
                        animate={{ opacity: on ? 1 : 0.38, x: on ? 6 : 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        style={{
                          fontSize: on
                            ? isTablet ? 'clamp(1.2rem, 2.4vw, 1.6rem)' : 'clamp(1.4rem, 2.1vw, 2.1rem)'
                            : isTablet ? 'clamp(0.95rem, 1.8vw, 1.15rem)' : 'clamp(1.05rem, 1.45vw, 1.4rem)',
                          fontWeight: 700,
                          letterSpacing: '-0.025em',
                          lineHeight: 1.15,
                          color: on ? t.accent : t.text,
                          transition: 'font-size 0.45s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      >
                        {s.title}
                      </motion.span>
                    </button>
                  );
                })}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: isTablet ? '1.5rem' : '2.5rem', marginTop: 'clamp(1rem, 3.5vh, 2.25rem)' }}>
                {[
                  { v: String(STAGES.length).padStart(2, '0'), l: 'Stages' },
                  { v: String(TOTAL_TOOLS), l: 'Tools' },
                  { v: String(LANGUAGES.length).padStart(2, '0'), l: 'Languages' },
                ].map((st) => (
                  <div key={st.l}>
                    <div style={{ fontSize: 'clamp(1.3rem, 2vw, 1.9rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: t.text }}>{st.v}</div>
                    <div className="mono" style={{ marginTop: 6, fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: t.muted }}>{st.l}</div>
                  </div>
                ))}
              </div>

              {/* Languages */}
              {!isShort && (
                <div style={{ marginTop: 'clamp(1rem, 3vh, 1.75rem)', paddingTop: 'clamp(0.75rem, 2vh, 1.25rem)', borderTop: `1px solid ${t.line}`, display: 'flex', gap: isTablet ? '1rem' : '1.75rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  {LANGUAGES.map((l) => (
                    <div key={l.lang} style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', color: t.text }}>{l.lang}</span>
                      <span className="mono" style={{ fontSize: '0.56rem', letterSpacing: '0.12em', color: t.muted, textTransform: 'uppercase' }}>{l.level}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: workflow canvas + node details ── */}
            <div
              style={{
                justifySelf: 'end',
                // the canvas also shrinks with screen height, so everything fits on short laptops
                width: 'min(100%, calc((100vh - 360px) * 16 / 9 + 2px))',
                minWidth: 'min(100%, 420px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(10px, 1.6vh, 16px)',
              }}
            >
              {/* Canvas */}
              <div
                style={{
                  borderRadius: 22,
                  border: `1px solid ${t.canvasBorder}`,
                  backgroundColor: t.canvas,
                  overflow: 'hidden',
                }}
              >
                {/* toolbar */}
                <div
                  className="mono"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: `1px solid ${t.canvasBorder}`,
                    fontSize: '0.6rem',
                    letterSpacing: '0.14em',
                    color: t.toolbar,
                  }}
                >
                  <span>HOW-I-BUILD · WORKFLOW</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span>
                      RUN {String(active + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: isDark ? GREEN : '#1f7a4a' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: isDark ? GREEN : '#1f7a4a' }} />
                      ACTIVE
                    </span>
                  </span>
                </div>

                {/* dotted canvas */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    backgroundImage: `radial-gradient(${t.dots} 1.2px, transparent 1.2px)`,
                    backgroundSize: '18px 18px',
                  }}
                >
                  <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} aria-hidden="true">
                    {STAGES.slice(0, -1).map((_, i) => (
                      <Wire key={i} i={i} prog={prog} t={t} />
                    ))}
                  </svg>

                  {STAGES.map((s, i) => {
                    const reached = i <= active;
                    const on = i === active;
                    return (
                      <motion.button
                        key={s.step}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`${s.step}: ${s.title}`}
                        data-magnetic="off"
                        initial={false}
                        animate={{ scale: on ? 1.06 : 1 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        style={{
                          position: 'absolute',
                          left: `${NODE_X[i]}%`,
                          top: `${NODE_Y[i]}%`,
                          width: `${NODE_W}%`,
                          height: `${NODE_H}%`,
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(6px, 0.8vw, 10px)',
                          padding: '0 clamp(6px, 0.8vw, 12px)',
                          borderRadius: 14,
                          border: `1.5px solid ${on ? GOLD : reached ? 'transparent' : t.nodeOffBorder}`,
                          backgroundColor: reached ? t.node : t.nodeOff,
                          color: reached ? '#F4F1EA' : t.nodeOffText,
                          boxShadow: on ? '0 14px 30px rgba(0,0,0,0.28)' : 'none',
                          cursor: 'pointer',
                          font: 'inherit',
                          textAlign: 'left',
                          transition: 'background-color 0.35s, color 0.35s, border-color 0.35s',
                          zIndex: on ? 2 : 1,
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: 'clamp(22px, 2.2vw, 30px)',
                            height: 'clamp(22px, 2.2vw, 30px)',
                            borderRadius: 8,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'clamp(0.65rem, 0.8vw, 0.85rem)',
                            backgroundColor: reached ? 'rgba(215,196,158,0.16)' : 'transparent',
                            color: reached ? GOLD : 'inherit',
                            border: reached ? 'none' : `1px solid ${t.nodeOffBorder}`,
                          }}
                        >
                          {s.glyph}
                        </span>
                        <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 'clamp(0.68rem, 0.95vw, 0.95rem)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                            {s.step}
                          </span>
                          <span className="mono" style={{ fontSize: 'clamp(0.48rem, 0.55vw, 0.58rem)', letterSpacing: '0.1em', opacity: 0.6, whiteSpace: 'nowrap' }}>
                            {String(i + 1).padStart(2, '0')} · {s.tools.length} TOOLS
                          </span>
                        </span>
                        {/* status dot */}
                        <span
                          style={{
                            position: 'absolute',
                            top: 7,
                            right: 7,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: reached ? GREEN : t.nodeOffBorder,
                            transition: 'background-color 0.35s',
                          }}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Node details (like the panel that opens when you click a node) */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 22,
                  backgroundColor: panelBg,
                  color: '#F4F1EA',
                  padding: isShort ? '1rem 1.25rem' : 'clamp(1.1rem, 2.2vh, 1.5rem) clamp(1.25rem, 2vw, 1.75rem)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.22)',
                  overflow: 'hidden',
                  minHeight: isShort ? 128 : 'clamp(140px, 20vh, 170px)',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: EASE }}
                  >
                    <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: '0.6rem', letterSpacing: '0.14em', color: GOLD }}>
                      <span>
                        STEP {String(active + 1).padStart(2, '0')} · {cur.step.toUpperCase()}
                      </span>
                      <span style={{ color: 'rgba(244,241,234,0.5)' }}>OUTPUT ✓</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.9rem', flexWrap: 'wrap', margin: '0.55rem 0 0.8rem' }}>
                      <h3 style={{ fontSize: isTablet ? 'clamp(1.2rem, 2.4vw, 1.6rem)' : 'clamp(1.35rem, 1.9vw, 1.9rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}>
                        {cur.title}
                      </h3>
                      {!isShort && (
                        <span style={{ fontSize: '0.9rem', color: 'rgba(244,241,234,0.65)' }}>{cur.outcome}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {cur.tools.map((tool, j) => (
                        <motion.span
                          key={tool}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 + j * 0.03, ease: EASE }}
                          className="mono"
                          style={{
                            fontSize: '0.66rem',
                            padding: '6px 11px',
                            borderRadius: 999,
                            letterSpacing: '0.02em',
                            backgroundColor: j === 0 ? GOLD : 'rgba(244,241,234,0.08)',
                            color: j === 0 ? '#121018' : 'rgba(244,241,234,0.9)',
                            border: j === 0 ? 'none' : '1px solid rgba(244,241,234,0.12)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tool}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}