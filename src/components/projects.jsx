import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import pulse from '../assets/images/pulse-logo-for-dark-backgrounds.svg';
import edb from '../assets/images/edb.png';
import { useIsMobile, useIsDark, useIsTablet, useIsShort, SectionLabel, EASE } from '../lib/ui';

gsap.registerPlugin(ScrollTrigger);


/*   CHANGE THE ORDER OF YOUR PROJECTS HERE                         */
/*  Delete a line to hide that project.                               */

const ORDER = [
  'wellsky',
  'bunnings',
  'sadia', 
  'fmf', 
  'pulse',
  'hybrdx',
  'edb',
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
    bgColor: '#ffffff',
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
  {
    id: 'pulse',
    title: 'Pulse - Fitness App',
    stack: ['React Native, Expo, TypeScript, Supabase'],
    description: 'Designed and developed a cross-platform fitness app that combines workout tracking, guided training plans, step counting and nutrition logging in a single codebase for iOS and Android.',
    tag: 'Mobile App · iOS & Android',
    image: pulse,
    bgColor: '#0E1116',
  },
  {
    id: 'edb',
    fill: true,
    title: 'EDB Bahrain',
    stack: ['WordPress', 'QA Testing', 'Cross-Browser Testing', 'Responsive Testing'],
    description: 'Independently managed all website content on WordPress and performed QA testing across devices and browsers for the Bahrain Economic Development Board. ',
    tag: 'FRONTEND / CMS & QA',
    image: edb,
    bgColor: '#ffffff',
    link: 'https://www.bahrainedb.com/',
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
/* Draggable filter switch (iPhone segmented-control style)            */
/* ------------------------------------------------------------------ */
function FilterSwitch({ value, onChange, countFor, t }) {
  const wrapRef = useRef(null);
  const btnRefs = useRef([]);
  const dragRef = useRef(null);
  const suppressClickUntil = useRef(0);
  const [segs, setSegs] = useState([]);
  const [drag, setDrag] = useState(null); // { left, width, idx }

  const activeIdx = Math.max(0, FILTERS.findIndex((f) => f.key === value));

  // Measure each button so the pill knows where to sit
  useLayoutEffect(() => {
    const measure = () =>
      setSegs(btnRefs.current.map((b) => (b ? { left: b.offsetLeft, width: b.offsetWidth } : { left: 0, width: 0 })));
    measure();
    document.fonts?.ready?.then(measure);
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const localX = (e) => {
    const n = wrapRef.current;
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
    const s = segs[activeIdx];
    if (!s || x < s.left || x > s.left + s.width) return; // only the gold pill is draggable
    dragRef.current = { id: e.pointerId, startX: x, offset: x - s.left, w0: s.width, moved: false, idx: activeIdx };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const x = localX(e);
    if (!d.moved) {
      if (Math.abs(x - d.startX) < 4) return; // small movement = tap
      d.moved = true;
      wrapRef.current.setPointerCapture(e.pointerId);
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
    if (!d.moved) return; // plain tap: button onClick handles it
    suppressClickUntil.current = performance.now() + 300;
    setDrag(null);
    if (d.idx !== activeIdx) onChange(FILTERS[d.idx].key);
  };

  const pill = drag || segs[activeIdx];
  const shown = drag ? drag.idx : activeIdx;

  return (
    <div
      ref={wrapRef}
      role="tablist"
      aria-label="Filter projects"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'relative',
        display: 'flex',
        gap: 4,
        padding: 5,
        borderRadius: 999,
        backgroundColor: t.chip,
        border: `1px solid ${t.line}`,
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
              : { type: 'spring', stiffness: 420, damping: 34 }
          }
          style={{
            position: 'absolute',
            top: 5,
            bottom: 5,
            left: 0,
            borderRadius: 999,
            backgroundColor: t.accent,
            boxShadow: 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {FILTERS.map((f, i) => {
        const on = i === shown;
        return (
          <button
            key={f.key}
            ref={(el) => (btnRefs.current[i] = el)}
            type="button"
            role="tab"
            aria-selected={i === activeIdx}
            onClick={() => {
              if (performance.now() < suppressClickUntil.current) return;
              onChange(f.key);
            }}
            style={{
              position: 'relative',
              padding: '10px 20px',
              border: 'none',
              borderRadius: 999,
              background: 'transparent',
              color: on ? t.accentText : t.text,
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: i === activeIdx ? (drag ? 'grabbing' : 'grab') : 'pointer',
              transition: 'color 0.2s',
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>
              {f.label}
              <sup className="mono" style={{ fontSize: '0.58rem', marginLeft: 3, opacity: 0.7 }}>{countFor(f.key)}</sup>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One project card in the horizontal gallery                          */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, total, t, index, isTablet, isShort }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: Math.min(index, 4) * 0.07, ease: EASE }}
      whileHover="hover"
      style={{
        flex: '0 0 auto',
        // width follows the screen height too, so cards keep their shape on short laptops
        width: isTablet ? 'clamp(260px, min(42vw, 58vh), 380px)' : 'clamp(270px, min(30vw, 62vh), 460px)',
        height: '100%',
        maxHeight: isShort ? 500 : 580,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: t.panel,
        border: `1px solid ${t.line}`,
        boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', flex: '0 0 52%', overflow: 'hidden', backgroundColor: project.bgColor || '#000' }}>
        <motion.img
          src={project.image}
          alt={project.title}
          variants={{ hover: { scale: 1.06 } }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: project.fill ? 'cover' : 'contain',
            padding: project.fill ? 0 : '1.75rem',
            display: 'block',
          }}
        />
        <span
          className="mono"
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            padding: '5px 11px',
            borderRadius: 999,
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {project.number} / {String(total).padStart(2, '0')}
        </span>
        {project.link && (
          <span
            className="mono"
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 11px',
              borderRadius: 999,
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3ddc84' }} />
            LIVE
          </span>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: isShort ? '0.9rem 1.1rem 1rem' : '1.25rem 1.4rem 1.3rem' }}>
        <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: t.accent }}>
          {project.tag.toUpperCase()}
        </span>
        <h3 style={{ fontSize: 'clamp(1.15rem, 1.5vw, 1.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, color: t.text, margin: '0.45rem 0 0.5rem' }}>
          {project.title}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: t.muted,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: isShort ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description.split(' ').map((w, i) => (
            <span key={i} style={isMetric(w) ? { color: t.accent, fontWeight: 700 } : undefined}>
              {w}{' '}
            </span>
          ))}
        </p>

        <div style={{ marginTop: 'auto', paddingTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, minWidth: 0 }}>
            {project.stack.slice(0, 3).map((s) => (
              <span key={s} className="mono" style={{ fontSize: '0.58rem', padding: '4px 9px', borderRadius: 999, backgroundColor: t.chip, color: t.text, whiteSpace: 'nowrap' }}>
                {s}
              </span>
            ))}
          </div>
          {project.link ? (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title}`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: t.accent,
                color: t.accentText,
              }}
            >
              <ArrowUpRight size={18} />
            </motion.a>
          ) : (
            <span title="Private client project" style={{ flexShrink: 0, color: t.faint, display: 'inline-flex' }}>
              <Lock size={15} />
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Section: desktop locks the screen and scrolling slides the cards    */
/* sideways like a gallery. Mobile keeps its own card layout.          */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const ref = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isShort = useIsShort();
  const isDark = useIsDark();
  const t = getTheme(isDark);

  const [filter, setFilter] = useState('ALL');
  const visible = filter === 'ALL' ? projects : projects.filter((p) => categoryOf(p) === filter);
  const countFor = (key) => (key === 'ALL' ? projects.length : projects.filter((p) => categoryOf(p) === key).length);

  // Preload images so cards never flash empty
  useEffect(() => {
    projects.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  // Lock the section and turn vertical scrolling into sideways movement
  useLayoutEffect(() => {
    if (isMobile) return undefined;
    const track = trackRef.current;
    const total = visible.length;
    const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            if (countRef.current) {
              const i = Math.min(total, 1 + Math.round(self.progress * (total - 1)));
              countRef.current.textContent = `${String(i).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
            }
          },
        },
      });
    }, pinRef);

    // re-measure once images and fonts have loaded
    const refresh = () => ScrollTrigger.refresh();
    const late = setTimeout(refresh, 600);
    window.addEventListener('load', refresh);
    return () => {
      clearTimeout(late);
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, filter]);

  // Mobile: App Store-style expanding case-study cards
  if (isMobile) {
    return <MobileProjects projects={projects} isDark={isDark} sectionRef={ref} />;
  }

  return (
    <div style={{ backgroundColor: t.bg }}>
      <section
        id="projects"
        ref={(el) => {
          ref.current = el;
          pinRef.current = el;
        }}
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: isShort ? 500 : 600,
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(84px, 11vh, 104px) 0 clamp(20px, 4vh, 36px)',
          boxSizing: 'border-box',
          backgroundColor: t.bg,
          borderTop: `1px solid ${t.sectionBorder}`,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '0 var(--gutter, 6vw)' }}>
          <SectionLabel index="03" title="Projects" color={t.text} accent={t.accent} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap', marginBottom: 'clamp(1.25rem, 3.5vh, 2.5rem)' }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} style={{ overflow: 'hidden' }}>
              <motion.h2
                variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
                transition={{ duration: 1, ease: EASE }}
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.6rem)', fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.95, color: t.text, margin: 0, paddingBottom: '0.1em' }}
              >
                Selected work<span style={{ color: t.accent }}>.</span>
              </motion.h2>
            </motion.div>
            <FilterSwitch value={filter} onChange={setFilter} countFor={countFor} t={t} />
          </div>
        </div>

        {/* Horizontal track */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'visible' }}>
          <div
            ref={trackRef}
            key={filter}
            style={{
              display: 'flex',
              gap: 'clamp(16px, 1.8vw, 28px)',
              height: '100%',
              alignItems: 'center',
              padding: '0 var(--gutter, 6vw)',
              willChange: 'transform',
            }}
          >
            {visible.map((p, i) => (
              <ProjectCard key={p.number} project={p} total={projects.length} t={t} index={i} isTablet={isTablet} isShort={isShort} />
            ))}
            {/* end spacer so the last card can reach the right margin */}
            <div aria-hidden="true" style={{ flex: '0 0 1px' }} />
          </div>
        </div>

        {/* Progress */}
        <div style={{ padding: '0 var(--gutter, 6vw)', marginTop: 'clamp(0.75rem, 3vh, 2rem)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span ref={countRef} className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: t.text, minWidth: 56 }}>
            01 / {String(visible.length).padStart(2, '0')}
          </span>
          <div style={{ flex: 1, height: 2, backgroundColor: t.line, borderRadius: 2, overflow: 'hidden' }}>
            <div ref={barRef} style={{ height: '100%', backgroundColor: t.accent, transform: 'scaleX(0)', transformOrigin: 'left' }} />
          </div>
          <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: t.muted }}>
            SCROLL →
          </span>
        </div>
      </section>
    </div>
  );
}