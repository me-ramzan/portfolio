import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import MobileSkills from './MobileSkillsPhysics';
import { useIsMobile, useIsDark, SectionLabel, EASE } from '../lib/ui';

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

// Vertical offsets give the wires a gentle wave
const OFFSETS = [0, 46, -26, 34];

const TOTAL_TOOLS = STAGES.reduce((n, s) => n + s.tools.length, 0);
const NODE_COUNT = STAGES.length + 2; // start + stages + end
const STEP_MS = 520;

const LANGUAGES = [
  { lang: 'English', level: 'Fluent' },
  { lang: 'Hindi', level: 'Fluent' },
  { lang: 'Urdu', level: 'Native' },
];

const GOLD = '#D7C49E';
const NAVY = '#343148';
const GREEN = '#5FD38A';

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
        node: NAVY,
        terminal: '#232032',
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
        node: NAVY,
        terminal: '#F4F1EA',
        hoverBorder: NAVY,
        cardBg: '#D7C49E',
        pillBg: NAVY,
        pillBorder: '#424040',
        ring1: 'rgba(52,49,72,0.15)',
        ring2: 'rgba(52,49,72,0.1)',
        shadow: '0 24px 50px rgba(52,49,72,0.25)',
      };
}

/* Small round start / end nodes */
function Terminal({ label, sub, done, nodeRef, t, isDark }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <motion.div
        ref={nodeRef}
        animate={{ opacity: done ? 1 : 0.55 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.terminal,
          border: `1.5px solid ${done ? t.wireOn : t.wire}`,
          color: isDark ? GOLD : NAVY,
          fontSize: '1.3rem',
          boxShadow: done ? `0 0 0 6px ${isDark ? 'rgba(215,196,158,0.12)' : 'rgba(52,49,72,0.12)'}` : 'none',
          transition: 'border-color 0.4s, box-shadow 0.4s',
        }}
      >
        {label}
      </motion.div>
      <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: t.muted, textAlign: 'center', whiteSpace: 'nowrap' }}>
        {sub}
      </span>
    </div>
  );
}

function StageNode({ stage, index, done, running, dim, dimOpacity, onEnter, onLeave, nodeRef }) {
  return (
    <motion.div
      ref={nodeRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{ opacity: dim ? dimOpacity : done ? 1 : dimOpacity }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{
        position: 'relative',
        top: OFFSETS[index] || 0,
        backgroundColor: NAVY,
        color: '#F4F1EA',
        borderRadius: 18,
        border: `1.5px solid ${running || done ? GOLD : 'rgba(244,241,234,0.12)'}`,
        boxShadow: running ? '0 0 0 6px rgba(215,196,158,0.18), 0 24px 50px rgba(0,0,0,0.35)' : '0 18px 40px rgba(0,0,0,0.25)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Node header, like a workflow editor */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.8rem 1rem',
          borderBottom: '1px solid rgba(244,241,234,0.1)',
          backgroundColor: 'rgba(0,0,0,0.12)',
        }}
      >
        <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.6rem', letterSpacing: '0.1em', color: GOLD, whiteSpace: 'nowrap' }}>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(215,196,158,0.14)',
              fontSize: '0.7rem',
              letterSpacing: 0,
            }}
          >
            {stage.glyph}
          </span>
          {String(index + 1).padStart(2, '0')} · {stage.step.toUpperCase()}
        </span>
        <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.54rem', letterSpacing: '0.1em', whiteSpace: 'nowrap', color: done ? '#9BE3B0' : 'rgba(244,241,234,0.45)' }}>
          <motion.span
            animate={running ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={running ? { duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
            style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: done ? GREEN : running ? GOLD : 'rgba(244,241,234,0.3)' }}
          />
          {done ? 'DONE' : running ? 'RUNNING' : 'IDLE'}
        </span>
      </div>

      {/* Node body */}
      <div style={{ padding: '1.1rem 1rem 1.15rem' }}>
        <div style={{ fontSize: 'clamp(1.05rem, 1.35vw, 1.3rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {stage.title}
        </div>
        <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.8rem', lineHeight: 1.5, color: 'rgba(244,241,234,0.72)' }}>
          {stage.outcome}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {stage.tools.map((tool, j) => (
            <span
              key={tool}
              className="mono"
              style={{
                fontSize: '0.58rem',
                padding: '4px 8px',
                borderRadius: 6,
                letterSpacing: '0.02em',
                backgroundColor: j === 0 ? GOLD : 'rgba(244,241,234,0.08)',
                color: j === 0 ? '#121018' : 'rgba(244,241,234,0.88)',
                whiteSpace: 'nowrap',
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const isMobile = useIsMobile();
  const isDark = useIsDark();
  const t = getTheme(isDark);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const nodeRefs = useRef([]);
  const [paths, setPaths] = useState([]);
  const [step, setStep] = useState(0); // how many nodes have executed
  const [hovered, setHovered] = useState(null);
  const [runId, setRunId] = useState(0);
  const inView = useInView(canvasRef, { once: true, amount: 0.45 });

  // Measure node positions and draw a wire between each neighbour
  const measure = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    const next = [];
    for (let i = 0; i < NODE_COUNT - 1; i++) {
      const a = nodeRefs.current[i];
      const b = nodeRefs.current[i + 1];
      if (!a || !b) continue;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const x1 = ar.right - cr.left;
      const y1 = ar.top + ar.height / 2 - cr.top;
      const x2 = br.left - cr.left;
      const y2 = br.top + br.height / 2 - cr.top;
      const dx = Math.max(24, (x2 - x1) * 0.55);
      next.push(`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`);
    }
    setPaths(next);
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    if (canvasRef.current) ro.observe(canvasRef.current);
    nodeRefs.current.forEach((n) => n && ro.observe(n));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, [isMobile, measure]);

  // "Run" the workflow: execute one node at a time
  useEffect(() => {
    if (isMobile || !inView) return;
    setStep(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= NODE_COUNT) clearInterval(id);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [isMobile, inView, runId]);

  // Mobile: physics playground
  if (isMobile) {
    return <MobileSkills skillGroups={skillGroups} theme={t} sectionRef={sectionRef} />;
  }

  const finished = step >= NODE_COUNT;
  // node index in the full chain: 0 = start, 1..4 = stages, 5 = end
  const isDone = (n) => step > n;
  const isRunning = (n) => step === n && !finished && inView;
  const wireLit = (w) => step > w + 1 || finished;
  const wireHot = (w) => hovered !== null && (w === hovered || w === hovered + 1);

  const stats = [
    { v: String(STAGES.length).padStart(2, '0'), l: 'Stages' },
    { v: String(TOTAL_TOOLS), l: 'Tools' },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ position: 'relative', padding: '9vw 6vw 8vw', backgroundColor: t.bg, borderTop: `1px solid ${t.border}` }}
    >
      <SectionLabel index="04" title="Skills" color={t.text} accent={t.accent} />

      {/* Heading + stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} style={{ overflow: 'hidden' }}>
          <motion.h2
            variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
            transition={{ duration: 1, ease: EASE }}
            style={{ fontSize: 'clamp(3.2rem, 7.5vw, 7rem)', fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.95, color: t.text, margin: 0, paddingTop: '0.04em', paddingBottom: '0.26em', marginBottom: '-0.16em' }}
          >
            How I build<span style={{ color: t.accent }}>.</span>
          </motion.h2>
        </motion.div>

        <div style={{ display: 'flex', gap: '3rem', paddingBottom: '0.8rem' }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
            >
              <div style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: t.text }}>
                {s.v}
              </div>
              <div className="mono" style={{ marginTop: 8, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: t.muted }}>
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Workflow canvas */}
      <div
        ref={canvasRef}
        style={{
          position: 'relative',
          borderRadius: 28,
          border: `1px solid ${t.canvasBorder}`,
          backgroundColor: t.canvas,
          backgroundImage: `radial-gradient(${t.dots} 1.2px, transparent 1.2px)`,
          backgroundSize: '22px 22px',
          padding: '1.25rem 2.25rem 4.5rem',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.75rem' }}>
          <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: t.muted, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-flex', gap: 5 }}>
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: t.wire }} />
              ))}
            </span>
            toolkit.workflow
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: finished ? (isDark ? '#9BE3B0' : '#2E7D4F') : t.muted }}>
              {finished ? '✓ EXECUTED SUCCESSFULLY' : inView ? `EXECUTING ${Math.min(step + 1, NODE_COUNT)} / ${NODE_COUNT}` : 'READY'}
            </span>
            <button
              type="button"
              onClick={() => setRunId((r) => r + 1)}
              disabled={!finished}
              className="mono"
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                padding: '8px 14px',
                borderRadius: 999,
                border: 'none',
                cursor: finished ? 'pointer' : 'default',
                backgroundColor: t.accent,
                color: isDark ? '#121018' : '#F4F1EA',
                opacity: finished ? 1 : 0.4,
                transition: 'opacity 0.3s',
              }}
            >
              ▶ RUN AGAIN
            </button>
          </div>
        </div>

        {/* Wires */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
        >
          {paths.map((d, w) => (
            <g key={`${w}-${runId}`}>
              <path d={d} fill="none" stroke={t.wire} strokeWidth={2} strokeDasharray="4 6" />
              <motion.path
                d={d}
                fill="none"
                stroke={t.wireOn}
                strokeWidth={wireHot(w) ? 3 : 2}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: wireLit(w) ? 1 : 0, opacity: hovered !== null && !wireHot(w) ? 0.35 : 1 }}
                transition={{ pathLength: { duration: STEP_MS / 1000, ease: 'easeInOut' }, opacity: { duration: 0.3 } }}
              />
              {finished && (
                <circle r={wireHot(w) ? 4.5 : 3.5} fill={t.wireOn}>
                  <animateMotion dur={`${1.6 + (w % 2) * 0.3}s`} repeatCount="indefinite" path={d} begin={`${w * 0.25}s`} />
                </circle>
              )}
            </g>
          ))}
        </svg>

        {/* Nodes */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '64px repeat(4, minmax(0, 1fr)) 64px',
            columnGap: 'clamp(22px, 2.6vw, 56px)',
            alignItems: 'center',
          }}
        >
          <Terminal label="✦" sub="YOUR IDEA" done={isDone(0) || step >= 1} nodeRef={(el) => (nodeRefs.current[0] = el)} t={t} isDark={isDark} />
          {STAGES.map((s, i) => (
            <StageNode
              key={s.title}
              stage={s}
              index={i}
              done={isDone(i + 1)}
              running={isRunning(i + 1)}
              dim={hovered !== null && hovered !== i}
              dimOpacity={isDark ? 0.45 : 0.72}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
              nodeRef={(el) => (nodeRefs.current[i + 1] = el)}
            />
          ))}
          <Terminal label="✓" sub="IN PRODUCTION" done={finished} nodeRef={(el) => (nodeRefs.current[NODE_COUNT - 1] = el)} t={t} isDark={isDark} />
        </div>
      </div>

      {/* Languages */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ marginTop: '3.5rem', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <span className="mono" style={{ color: t.muted, fontSize: '0.7rem', letterSpacing: '0.15em' }}>LANGUAGES</span>
        {LANGUAGES.map((l) => (
          <div key={l.lang} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.01em', color: t.text }}>{l.lang}</span>
            <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: t.muted, textTransform: 'uppercase' }}>{l.level}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}