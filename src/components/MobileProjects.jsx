import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useInView,
  useDragControls,
} from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'AI', label: 'AI' },
  { key: 'RPA', label: 'RPA' },
  { key: 'FRONTEND', label: 'Web' },
];

const categoryOf = (p) => p.tag.split('/')[0].trim();

function getColors(isDark) {
  return isDark
    ? {
        bg: '#121018',
        cardBg: '#1b1824',
        border: 'rgba(244,241,234,0.08)',
        text: '#F4F1EA',
        muted: 'rgba(244,241,234,0.6)',
        accent: '#D7C49E',
        accentText: '#121018',
        chipBg: 'rgba(244,241,234,0.08)',
        sheetBg: '#121018',
      }
    : {
        bg: '#343148',
        cardBg: '#2a2740',
        border: 'rgba(255,255,255,0.08)',
        text: '#FFFFFF',
        muted: 'rgba(255,255,255,0.65)',
        accent: '#D7C49E',
        accentText: '#343148',
        chipBg: 'rgba(0,0,0,0.25)',
        sheetBg: '#343148',
      };
}

/* Words containing numbers (70%, 10+, etc.) get highlighted — impact jumps out */
const isMetric = (w) => /\d/.test(w);

/* ------------------------------------------------------------------ */
/* Card in the list                                                    */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, onOpen, c }) {
  const ref = useRef(null);
  const id = project.number;

  // Plays the reveal as soon as the card is on screen — instant after a filter tap,
  // and still triggers on scroll for cards further down.
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const CLIP_HIDDEN = 'inset(16% 9.6% 16% 9.6% round 16px)';
  const CLIP_SHOWN = 'inset(0% 0% 0% 0% round 0px)';

  const open = () => onOpen(project);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: EASE }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        layoutId={`card-${id}`}
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title}`}
        onClick={open}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
        style={{
          borderRadius: 22,
          overflow: 'hidden',
          backgroundColor: c.cardBg,
          border: `1px solid ${c.border}`,
          cursor: 'pointer',
          boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
        }}
      >
        {/* Media */}
        <motion.div
          layoutId={`media-${id}`}
          style={{ position: 'relative', height: 220, overflow: 'hidden', borderRadius: 0 }}
        >
          <motion.div
            initial={{ clipPath: CLIP_HIDDEN }}
            animate={{ clipPath: inView ? CLIP_SHOWN : CLIP_HIDDEN }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: project.bgColor || '#000',
              overflow: 'hidden',
            }}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              initial={{ scale: 1.3 }}
              animate={{ scale: inView ? 1 : 1.3 }}
              transition={{ duration: 1.1, ease: EASE }}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24 }}
            />
          </motion.div>

          <span
            className="mono"
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
              padding: '5px 10px',
              borderRadius: 999,
              backgroundColor: 'rgba(0,0,0,0.55)',
              color: '#fff',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            {project.number}
          </span>

          {project.link && (
            <span
              className="mono"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                padding: '5px 10px',
                borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.55)',
                color: '#fff',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3ddc84', display: 'block' }}
              />
              LIVE
            </span>
          )}
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          style={{ padding: '1.1rem 1.2rem 1.25rem' }}
        >
          <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: c.accent }}>
            {project.tag}
          </span>
          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: c.text,
              margin: '6px 0 12px',
            }}
          >
            {project.title}
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {project.stack.slice(0, 3).map((s) => (
              <span
                key={s}
                className="mono"
                style={{ fontSize: '0.6rem', padding: '4px 9px', borderRadius: 4, backgroundColor: c.chipBg, color: c.text }}
              >
                {s}
              </span>
            ))}
            {project.stack.length > 3 && (
              <span className="mono" style={{ fontSize: '0.6rem', padding: '4px 9px', color: c.muted }}>
                +{project.stack.length - 3}
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 12,
              borderTop: `1px solid ${c.border}`,
            }}
          >
            <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: c.muted }}>
              TAP TO EXPLORE
            </span>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: c.accent,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <ArrowUpRight size={16} color={c.accentText} />
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Full-screen case study                                              */
/* ------------------------------------------------------------------ */
function ProjectDetail({ project, onClose, c }) {
  const id = project.number;
  const dragControls = useDragControls();
  const scrollRef = useRef(null);

  const close = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    onClose();
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.lenis?.stop?.();
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.lenis?.start?.();
      window.removeEventListener('keydown', onKey);
    };
  }, [close]);

  const words = project.description.split(' ');

  return (
    <>
      <motion.div
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9998 }}
      />

      <motion.div
        ref={scrollRef}
        layoutId={`card-${id}`}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) close();
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: c.sheetBg,
          borderRadius: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Hero media — drag down from here to close */}
        <motion.div
          layoutId={`media-${id}`}
          onPointerDown={(e) => dragControls.start(e)}
          style={{
            position: 'relative',
            height: '46vh',
            backgroundColor: project.bgColor || '#000',
            overflow: 'hidden',
            borderRadius: 0,
            touchAction: 'none',
          }}
        >
          <motion.img
            src={project.image}
            alt={project.title}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3.5rem 2rem 2rem' }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            style={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 5,
              borderRadius: 999,
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}
          />

          <motion.button
            type="button"
            aria-label="Close"
            onClick={close}
            onPointerDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            style={{
              position: 'absolute',
              top: 'max(16px, env(safe-area-inset-top))',
              right: 16,
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} color="#fff" />
          </motion.button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          style={{ padding: '1.75rem 1.5rem calc(3rem + env(safe-area-inset-bottom))', color: c.text }}
        >
          <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: c.accent }}>
            {project.number} · {project.tag}
          </span>

          <h3
            style={{
              fontSize: 'clamp(1.8rem, 8vw, 2.4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              margin: '10px 0 1.5rem',
            }}
          >
            {project.title}
          </h3>

          <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: c.muted, display: 'block', marginBottom: 10 }}>
            OVERVIEW
          </span>
          <motion.p
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.018, delayChildren: 0.35 } } }}
            style={{ fontSize: '1rem', lineHeight: 1.75, margin: '0 0 2rem', display: 'flex', flexWrap: 'wrap', columnGap: '0.3em' }}
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 8, filter: 'blur(4px)' },
                  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: EASE } },
                }}
                style={{
                  display: 'inline-block',
                  color: isMetric(w) ? c.accent : 'inherit',
                  fontWeight: isMetric(w) ? 700 : 400,
                }}
              >
                {w}
              </motion.span>
            ))}
          </motion.p>

          <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: c.muted, display: 'block', marginBottom: 12 }}>
            TECH STACK
          </span>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } } }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2.25rem' }}
          >
            {project.stack.map((s) => (
              <motion.span
                key={s}
                className="mono"
                variants={{
                  hidden: { opacity: 0, scale: 0.7, y: 10 },
                  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 18 } },
                }}
                style={{
                  fontSize: '0.72rem',
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: `1px solid ${c.accent}`,
                  color: c.text,
                }}
              >
                {s}
              </motion.span>
            ))}
          </motion.div>

          {project.link ? (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderRadius: 999,
                backgroundColor: c.accent,
                color: c.accentText,
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              Visit live site
              <ArrowUpRight size={20} color={c.accentText} />
            </motion.a>
          ) : (
            <div
              className="mono"
              style={{
                padding: '14px 18px',
                borderRadius: 14,
                border: `1px dashed ${c.border}`,
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: c.muted,
                textAlign: 'center',
              }}
            >
              INTERNAL / CLIENT PROJECT · NO PUBLIC LINK
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function MobileProjects({ projects, isDark, sectionRef }) {
  const c = getColors(isDark);
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filtered = filter === 'ALL' ? projects : projects.filter((p) => categoryOf(p) === filter);
  const countFor = (key) => (key === 'ALL' ? projects.length : projects.filter((p) => categoryOf(p) === key).length);

  return (
    <div style={{ backgroundColor: c.bg }}>
      <section
        id="projects"
        ref={sectionRef}
        style={{ padding: '4rem 5vw 4.5rem', backgroundColor: c.bg, borderTop: `1px solid ${c.border}`, position: 'relative' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          {/* The wrapper is what gets observed (it's always on screen), so the
              heading reliably slides up out of its mask. */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            style={{ overflow: 'hidden' }}
          >
            <motion.h2
              className="mono"
              variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ color: c.text, fontSize: 'clamp(1.8rem, 9vw, 2.5rem)', fontWeight: 800, margin: 0 }}
            >
              PROJECTS
            </motion.h2>
          </motion.div>
          {/* Accent line — slides to sit above the active filter.
              Columns mirror the filter bar's padding/gap so it lines up exactly. */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: 6, padding: '0 6px', marginTop: 14 }}
          >
            {FILTERS.map((f) => (
              <div key={f.key} style={{ flex: 1, display: 'flex', justifyContent: 'center', height: 2 }}>
                {filter === f.key && (
                  <motion.div
                    layoutId="projects-accent-line"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    style={{ width: 48, height: 2, borderRadius: 2, backgroundColor: c.accent }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Filters */}
        <LayoutGroup id="project-filters">
          <div
            style={{
              display: 'flex',
              gap: 6,
              padding: 5,
              borderRadius: 999,
              backgroundColor: c.chipBg,
              border: `1px solid ${c.border}`,
              marginBottom: '1.75rem',
            }}
          >
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  style={{
                    position: 'relative',
                    flex: 1,
                    padding: '9px 0',
                    border: 'none',
                    background: 'transparent',
                    borderRadius: 999,
                    cursor: 'pointer',
                    color: active ? c.accentText : c.text,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    transition: 'color 0.3s',
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      style={{ position: 'absolute', inset: 0, borderRadius: 999, backgroundColor: c.accent }}
                    />
                  )}
                  <span style={{ position: 'relative' }}>
                    {f.label}
                    <sup className="mono" style={{ fontSize: '0.55rem', marginLeft: 2, opacity: 0.7 }}>
                      {countFor(f.key)}
                    </sup>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Cards */}
        <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <AnimatePresence initial={false}>
            {filtered.map((p) => (
              <ProjectCard key={p.number} project={p} onOpen={setSelected} c={c} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Expanded case study (portal so no parent transform can break position: fixed) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <ProjectDetail key={selected.number} project={selected} onClose={() => setSelected(null)} c={c} />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}