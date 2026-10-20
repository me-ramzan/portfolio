import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup, useScroll, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, Lock } from 'lucide-react';
import MobileProjects from './MobileProjects';

import aiDocProcessing from '../assets/images/AIDocumentProcessingWorkflow.png';
import invoiceAutomation from '../assets/images/AutomatedInvoiceProcessingWorkflow.png';
import aiCallingAgent from '../assets/images/AIVoiceCallingAgentPipeline.png';
import futureMineralForum from '../assets/images/FutureMineralForum.png';
import sadiaChicken from '../assets/images/SadiaChicken.png';
import hybrdx from '../assets/images/hybrdx.jpg';
import cboj from '../assets/images/CBOJ.jpg';
import bunningsAU from '../assets/images/bunningsAU.svg';
import wellskyARCC from '../assets/images/wellskyARCC.png';
import machShip from '../assets/images/machShip.jpg';
import powerBI from '../assets/images/powerBI.png';
import { useIsMobile, useIsDark, SectionLabel, EASE } from '../lib/ui';


/*   CHANGE THE ORDER OF YOUR PROJECTS HERE                         */
/*  Delete a line to hide that project.                               */

const ORDER = [
  'wellsky',
  'bunnings',
  'sadia', 
  'fmf', 
  'hybrdx',
  'calling-agent',
  'invoice',
  'doc-ai',         
  'machship', 
  'cboj',              
  'powerbi',        
];

const projectData = [
  {
    id: 'doc-ai',
    title: 'AI-Powered Document Processing System',
    stack: ['n8n', 'OpenAI', 'Pinecone', 'Vector Search'],
    description: 'End-to-end n8n workflow integrated with OpenAI and Pinecone to intelligently process and analyze documents. Implemented vector-based semantic search that reduced manual document review time by 70%.',
    tag: 'AI / AUTOMATION',
    image: aiDocProcessing,
    bgColor: '#ffffff',
  },
  {
    id: 'invoice',
    title: 'Invoice Processing Automation',
    stack: ['UiPath', 'SharePoint', 'Outlook', 'OCR'],
    description: 'RPA solution that automatically retrieves invoice PDFs and client signatures from Outlook, merges documents, embeds digital signatures, and archives to SharePoint. Saved 10+ hours of manual work per week.',
    tag: 'RPA / ENTERPRISE',
    image: invoiceAutomation,
    bgColor: '#FBF4EC',
  },
  {
    id: 'calling-agent',
    title: 'AI Calling Agent for Customer Support',
    stack: ['n8n', 'Twilio', 'ElevenLabs', 'LLM'],
    description: 'AI-powered voice calling agent integrated with Twilio for call automation and ElevenLabs for natural voice synthesis, enabling autonomous handling and resolution of customer queries.',
    tag: 'AI / VOICE',
    image: aiCallingAgent,
    bgColor: '#ffffff',
  },
  {
    id: 'fmf',
    title: 'Future Mineral Forum - UI',
    stack: ['React.js', 'HTML', 'CSS', 'JavaScript'],
    description: 'Built and maintained a responsive front-end website including reusable UI components. Diagnosed and resolved cross-device UI/UX inconsistencies based on visual QA review and feedback.',
    tag: 'FRONTEND / WEB',
    image: futureMineralForum,
    bgColor: '#000000',
    link: 'https://www.futuremineralsforum.com/',
  },
  {
    id: 'hybrdx',
    title: 'HYBRDX - Shamal Group',
    stack: ['JavaScript', 'HTML', 'CSS', 'Mailchimp'],
    description: "Contributed to the front-end of a public-facing campaign site for Dubai's hybrid fitness competition. Built responsive layouts, animations and a live event countdown, and designed the Mailchimp emailer for participant updates.",
    tag: 'FRONTEND / WEB',
    image: hybrdx,
    bgColor: '#06313e',
    link: 'https://www.hybrdx.ae/',
  },
  {
    id: 'sadia',
    title: 'Sadia Chicken',
    stack: ['React.js', 'HTML', 'CSS', 'JavaScript'],
    description: 'Developed and maintained a responsive front-end, ensuring a consistent user experience across desktop, tablet, and mobile devices.',
    tag: 'FRONTEND / WEB',
    image: sadiaChicken,
    bgColor: '#FFCD00',
    link: 'https://www.sadia-life.com/en/',
  },
  {
    id: 'cboj',
    title: 'CBOJ',
    stack: ['React.js', 'HTML', 'C#', 'JavaScript'],
    description: 'Implemented responsive user interfaces using C#, ensuring consistent functionality and an optimized experience across desktop and mobile devices.',
    tag: 'FRONTEND / WEB',
    image: cboj,
    bgColor: '#ffffff',
  },
  {
    id: 'bunnings',
    title: 'Bunnings AU',
    stack: ['UiPath', 'AppScript', 'VB.NET', 'GoogleSheets'],
    description: 'Automated product validation for Bunnings AU by matching product name and model number with Regex against a Google Sheets catalog, and emailing requesters when an item was unavailable. Built with UiPath.',
    tag: 'RPA / Enterprise',
    image: bunningsAU,
    bgColor: '#06313e',
  },
  {
    id: 'wellsky',
    title: 'WellSky ARCC',
    stack: ['UiPath', 'AppScript', 'VB.NET', 'Regex', 'GoogleSheets'],
    description: 'Built an automated appointment scheduling system for WellSky ARCC that synced doctor and patient appointments to calendars and sent timely email notifications, using UiPath, Google Apps Script, VB.NET, Regex, and Google Sheets.',
    tag: 'RPA / Enterprise',
    image: wellskyARCC,
    bgColor: '#ffffff',
  },
  {
    id: 'machship',
    title: 'MachShip Consignment Automation',
    stack: ['UiPath', 'HubSpot', 'GoogleSheets', 'Regex', 'VB.NET'],
    description: 'Engineered an automated order-tracking workflow for Machship that verifies order IDs, returns order status, and creates HubSpot tickets with customer details for unmatched orders.',
    tag: 'RPA / Enterprise',
    image: machShip,
    bgColor: '#004AAD',
  },
  {
    id: 'powerbi',
    title: 'Automation Monitoring Dashboard',
    stack: ['PowerBI'],
    description: 'Built a Power BI dashboard that monitors all ongoing automation projects, showing total projects, running status, queue allocation, and successful versus failed runs at a glance.',
    tag: 'RPA / Analytics',
    image: powerBI,
    bgColor: '#ffffff',
  },
];

// Builds the final list in the ORDER above and numbers it 01, 02, 03...
const projects = ORDER
  .map((id) => projectData.find((p) => p.id === id))
  .filter(Boolean)
  .map((p, i) => ({ ...p, number: String(i + 1).padStart(2, '0') }));

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'AI', label: 'AI' },
  { key: 'RPA', label: 'RPA' },
  { key: 'FRONTEND', label: 'Web' },
];
const categoryOf = (p) => p.tag.split('/')[0].trim();
const isMetric = (w) => /\d/.test(w);

function getTheme(isDark) {
  return isDark
    ? {
        bg: '#121018',
        sectionBorder: '#343148',
        text: '#F4F1EA',
        muted: 'rgba(244,241,234,0.55)',
        faint: 'rgba(244,241,234,0.32)',
        line: 'rgba(244,241,234,0.12)',
        accent: '#D7C49E',
        accentText: '#121018',
        panel: '#1b1824',
        chip: 'rgba(244,241,234,0.08)',
      }
    : {
        bg: '#343148',
        sectionBorder: '#1A1A1A',
        text: '#FFFFFF',
        muted: 'rgba(255,255,255,0.65)',
        faint: 'rgba(255,255,255,0.38)',
        line: 'rgba(255,255,255,0.14)',
        accent: '#D7C49E',
        accentText: '#343148',
        panel: '#2a2740',
        chip: 'rgba(0,0,0,0.22)',
      };
}

/* ------------------------------------------------------------------ */
/* List row                                                            */
/* ------------------------------------------------------------------ */
function ProjectRow({ project, active, onActivate, registerRef, t }) {
  return (
    <motion.button
      type="button"
      ref={registerRef}
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      aria-current={active ? 'true' : undefined}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '3.2rem 1fr auto',
        alignItems: 'start',
        gap: '1rem',
        width: '100%',
        textAlign: 'left',
        padding: '2.1rem 0 2.1rem 1.25rem',
        background: 'none',
        border: 'none',
        borderTop: `1px solid ${t.line}`,
        color: t.text,
        cursor: 'pointer',
        font: 'inherit',
      }}
    >
      {/* Active indicator */}
      <motion.span
        aria-hidden
        animate={{ scaleY: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ position: 'absolute', left: 0, top: '1.9rem', bottom: '1.9rem', width: 3, borderRadius: 3, backgroundColor: t.accent, transformOrigin: 'top' }}
      />

      <span className="mono" style={{ fontSize: '0.75rem', color: active ? t.accent : t.faint, paddingTop: '0.55rem', transition: 'color 0.3s' }}>
        {project.number}
      </span>

      <span style={{ minWidth: 0 }}>
        <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.62rem', letterSpacing: '0.12em', color: active ? t.accent : t.muted, transition: 'color 0.3s' }}>
          {project.tag}
          {project.link && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.muted }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3ddc84' }} />
              LIVE
            </span>
          )}
        </span>
        <motion.span
          animate={{ opacity: active ? 1 : 0.45, x: active ? 6 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ display: 'block', fontSize: 'clamp(1.35rem, 2.1vw, 2rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15, margin: '0.5rem 0 0.75rem' }}
        >
          {project.title}
        </motion.span>
        <span className="mono" style={{ fontSize: '0.66rem', letterSpacing: '0.04em', color: active ? t.muted : t.faint, transition: 'color 0.3s' }}>
          {project.stack.join('  ·  ')}
        </span>
      </span>

      <motion.span
        aria-hidden
        animate={{ opacity: active ? 1 : 0.25, rotate: active ? 0 : -45, x: active ? 0 : -6 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          border: `1px solid ${active ? t.accent : t.line}`,
          display: 'grid',
          placeItems: 'center',
          marginTop: '0.4rem',
          color: active ? t.accent : t.text,
        }}
      >
        <ArrowUpRight size={18} />
      </motion.span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky preview panel                                                */
/* ------------------------------------------------------------------ */
function PreviewPanel({ project, index, total, t }) {
  return (
    <div
      style={{
        // fits below the navbar on any screen height
        height: 'min(74vh, calc(100vh - 190px))',
        minHeight: 420,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: t.panel,
        border: `1px solid ${t.line}`,
        boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', flex: '0 0 50%', overflow: 'hidden' }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={project.number}
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0.6, transition: { duration: 0.6 } }}
            transition={{ duration: 0.75, ease: EASE }}
            style={{ position: 'absolute', inset: 0, backgroundColor: project.bgColor || '#000' }}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.1, ease: EASE }}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2.25rem' }}
            />
          </motion.div>
        </AnimatePresence>

        <span
          className="mono"
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {project.number} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Progress */}
      <div style={{ height: 2, backgroundColor: t.line }}>
        <motion.div
          animate={{ scaleX: (index + 1) / total }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ height: '100%', backgroundColor: t.accent, transformOrigin: 'left' }}
        />
      </div>

      {/* Details */}
      <div style={{ position: 'relative', flex: 1, padding: '1.75rem 2rem 1.75rem', overflow: 'hidden' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.number}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {[
              <span key="tag" className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: t.accent }}>
                {project.tag}
              </span>,
              <h3 key="title" style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, color: t.text, margin: '0.5rem 0 0.75rem' }}>
                {project.title}
              </h3>,
              <p key="desc" style={{ fontSize: '0.92rem', lineHeight: 1.7, color: t.muted, margin: 0 }}>
                {project.description.split(' ').map((w, i) => (
                  <span key={i} style={isMetric(w) ? { color: t.accent, fontWeight: 700 } : undefined}>
                    {w}{' '}
                  </span>
                ))}
              </p>,
            ].map((node, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
              >
                {node}
              </motion.div>
            ))}

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
              style={{ marginTop: 'auto', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {project.stack.map((s) => (
                  <span key={s} className="mono" style={{ fontSize: '0.62rem', padding: '5px 10px', borderRadius: 999, backgroundColor: t.chip, color: t.text }}>
                    {s}
                  </span>
                ))}
              </div>

              {project.link ? (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '11px 18px',
                    borderRadius: 999,
                    backgroundColor: t.accent,
                    color: t.accentText,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Visit live site <ArrowUpRight size={16} />
                </motion.a>
              ) : (
                <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.6rem', letterSpacing: '0.1em', color: t.faint }}>
                  <Lock size={12} /> PRIVATE CLIENT PROJECT
                </span>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Column that makes its child follow the scroll (JS, not CSS sticky)  */
/* Works even when a parent has overflow set or a smooth-scroll lib.   */
/* ------------------------------------------------------------------ */
const FOLLOW_TOP = 0.12; // keep the panel 12% from the top of the screen…
const FOLLOW_MIN_PX = 104; // …but never under the navbar

function FollowColumn({ children }) {
  const colRef = useRef(null);
  const panelRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useMotionValue(0);
  const m = useRef({ top: 0, h: 0, ph: 0 });

  const update = useCallback(
    (sy) => {
      const { top, h, ph } = m.current;
      const target = sy + Math.max(window.innerHeight * FOLLOW_TOP, FOLLOW_MIN_PX) - top;
      y.set(Math.min(Math.max(target, 0), Math.max(0, h - ph)));
    },
    [y]
  );

  const measure = useCallback(() => {
    const col = colRef.current;
    const panel = panelRef.current;
    if (!col || !panel) return;
    const r = col.getBoundingClientRect();
    m.current = { top: r.top + window.scrollY, h: col.offsetHeight, ph: panel.offsetHeight };
    update(window.scrollY);
  }, [update]);

  useMotionValueEvent(scrollY, 'change', update);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (colRef.current) ro.observe(colRef.current);
    ro.observe(document.body); // content above may change height (images, fonts)
    window.addEventListener('resize', measure);
    const late = setTimeout(measure, 800);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      clearTimeout(late);
    };
  }, [measure]);

  return (
    <div ref={colRef} style={{ alignSelf: 'stretch', position: 'relative' }}>
      <motion.div ref={panelRef} style={{ y, willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const isDark = useIsDark();
  const t = getTheme(isDark);

  const [filter, setFilter] = useState('ALL');
  const [activeId, setActiveId] = useState(projects[0].number);
  const rowRefs = useRef(new Map());

  const visible = filter === 'ALL' ? projects : projects.filter((p) => categoryOf(p) === filter);
  const countFor = (key) => (key === 'ALL' ? projects.length : projects.filter((p) => categoryOf(p) === key).length);

  // Preload images so the preview never flashes empty
  useEffect(() => {
    projects.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  // Keep the active project valid after filtering
  useEffect(() => {
    if (!visible.some((p) => p.number === activeId)) setActiveId(visible[0]?.number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Scroll-sync: whichever row crosses the middle of the screen becomes active
  useEffect(() => {
    if (isMobile) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.dataset.id);
        });
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 }
    );
    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isMobile, filter]);

  const register = useCallback(
    (id) => (el) => {
      if (el) {
        el.dataset.id = id;
        rowRefs.current.set(id, el);
      } else {
        rowRefs.current.delete(id);
      }
    },
    []
  );

  // Mobile: App Store–style expanding case-study cards
  if (isMobile) {
    return <MobileProjects projects={projects} isDark={isDark} sectionRef={ref} />;
  }

  const activeIndex = Math.max(0, visible.findIndex((p) => p.number === activeId));
  const activeProject = visible[activeIndex] || visible[0];

  return (
    <div style={{ backgroundColor: t.bg }}>
      <section
        id="projects"
        ref={ref}
        style={{ position: 'relative', padding: '9vw 6vw 8vw', backgroundColor: t.bg, borderTop: `1px solid ${t.sectionBorder}` }}
      >
        {/* Header */}
        <SectionLabel index="03" title="Projects" color={t.text} accent={t.accent} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          {/* The wrapper is observed (always on screen), so the heading reliably slides up out of its mask */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
              transition={{ duration: 1, ease: EASE }}
              style={{ fontSize: 'clamp(3.2rem, 7.5vw, 7rem)', fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.95, color: t.text, margin: 0, paddingBottom: '0.1em' }}
            >
              Selected work<span style={{ color: t.accent }}>.</span>
            </motion.h2>
          </motion.div>

          {/* Filters */}
          <LayoutGroup id="projects-desktop-filters">
            <div role="tablist" aria-label="Filter projects" style={{ display: 'flex', gap: 4, padding: 5, borderRadius: 999, backgroundColor: t.chip, border: `1px solid ${t.line}` }}>
              {FILTERS.map((f) => {
                const on = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(f.key)}
                    style={{
                      position: 'relative',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: 999,
                      background: 'transparent',
                      color: on ? t.accentText : t.text,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'color 0.3s',
                    }}
                  >
                    {on && (
                      <motion.span
                        layoutId="projects-desktop-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        style={{ position: 'absolute', inset: 0, borderRadius: 999, backgroundColor: t.accent }}
                      />
                    )}
                    <span style={{ position: 'relative' }}>
                      {f.label}
                      <sup className="mono" style={{ fontSize: '0.58rem', marginLeft: 3, opacity: 0.7 }}>{countFor(f.key)}</sup>
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '5vw', alignItems: 'start' }}>
          <div>
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p) => (
                <ProjectRow
                  key={p.number}
                  project={p}
                  active={p.number === activeProject?.number}
                  onActivate={() => setActiveId(p.number)}
                  registerRef={register(p.number)}
                  t={t}
                />
              ))}
            </AnimatePresence>
            <div style={{ borderTop: `1px solid ${t.line}` }} />
            {/* Runway: lets the last project reach the middle of the screen while the panel stays fully visible */}
            <div aria-hidden="true" style={{ height: '32vh' }} />
          </div>

          {/* Stretched column = room for the sticky panel to follow the whole list */}
          <FollowColumn>
            {activeProject && <PreviewPanel project={activeProject} index={activeIndex} total={visible.length} t={t} />}
          </FollowColumn>
        </div>
      </section>
    </div>
  );
}