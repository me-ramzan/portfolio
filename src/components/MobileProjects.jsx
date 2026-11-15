import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
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
/* Hairline row: tap to open; the open row shows image + details        */
/* ------------------------------------------------------------------ */
function ProjectRow({ project, index, open, onToggle, onOpen, c, isDark }) {
  const id = project.number;
  const line = isDark ? 'rgba(244,241,234,0.14)' : 'rgba(255,255,255,0.18)';
  const words = project.description.split(' ');

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.04, ease: EASE }}
      style={{ borderTop: `1px solid ${line}` }}
    >
      {/* Title line */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`proj-panel-${id}`}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '2rem 1fr auto',
          alignItems: 'baseline',
          gap: 8,
          padding: '1.05rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
          color: c.text,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.1em', color: open ? c.accent : c.muted, transition: 'color 0.3s' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          style={{
            fontSize: 'clamp(1.05rem, 4.8vw, 1.3rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            opacity: open ? 1 : 0.62,
            transition: 'opacity 0.3s',
            minWidth: 0,
          }}
        >
          {project.title}
          {project.link && (
            <span
              aria-label="Live"
              style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3ddc84', marginLeft: 8, verticalAlign: '0.25em' }}
            />
          )}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ fontSize: '1.25rem', fontWeight: 300, lineHeight: 1, color: open ? c.accent : c.text, display: 'inline-block' }}
        >
          +
        </motion.span>
      </button>

      {/* Panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={`proj-panel-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.55, ease: EASE }, opacity: { duration: 0.35, delay: 0.1 } } }}
            exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.45, ease: EASE }, opacity: { duration: 0.2 } } }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: '1.35rem' }}>
              {/* Image: morphs into the full case study when tapped */}
              <motion.div
                layoutId={`card-${id}`}
                role="button"
                tabIndex={0}
                aria-label={`Open ${project.title}`}
                onClick={() => onOpen(project)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(project)}
                whileTap={{ scale: 0.98 }}
                style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}
              >
                <motion.div
                  layoutId={`media-${id}`}
                  style={{ position: 'relative', aspectRatio: '16 / 10', maxHeight: '42svh', width: '100%', backgroundColor: project.bgColor || '#000', overflow: 'hidden' }}
                >
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    initial={{ scale: 1.12 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: project.fill ? 'cover' : 'contain',
                      padding: project.fill ? 0 : 20,
                      display: 'block',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span
                    className="mono"
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 10,
                      fontSize: '0.58rem',
                      letterSpacing: '0.12em',
                      padding: '5px 9px',
                      borderRadius: 999,
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                    }}
                  >
                    OPEN ↗
                  </span>
                </motion.div>
              </motion.div>

              {/* Meta */}
              <div className="mono" style={{ marginTop: 14, fontSize: '0.6rem', letterSpacing: '0.12em', color: c.accent }}>
                {project.tag}
              </div>
              <p
                style={{
                  margin: '8px 0 12px',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: c.muted,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {words.map((w, i) => (
                  <span key={i} style={isMetric(w) ? { color: c.accent, fontWeight: 700 } : undefined}>
                    {w}{' '}
                  </span>
                ))}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minWidth: 0 }}>
                  {project.stack.slice(0, 3).map((s) => (
                    <span key={s} className="mono" style={{ fontSize: '0.58rem', padding: '4px 9px', borderRadius: 999, border: `1px solid ${line}`, color: c.text, whiteSpace: 'nowrap' }}>
                      {s}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onOpen(project)}
                  className="mono"
                  style={{
                    flexShrink: 0,
                    background: 'none',
                    border: 'none',
                    borderBottom: `1px solid ${c.text}`,
                    padding: '2px 0',
                    color: c.text,
                    fontSize: '0.62rem',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  CASE STUDY <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

      {/* Sheet: fixed frame, does NOT scroll itself */}
      <motion.div
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
          top: 0,
          left: 0,
          right: 0,
          height: '100dvh',
          maxWidth: 720,
          margin: '0 auto',
          zIndex: 9999,
          backgroundColor: c.sheetBg,
          borderRadius: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close button: pinned, never scrolls away */}
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
            zIndex: 3,
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

        {/* Scrollable middle */}
        <div
          ref={scrollRef}
          data-lenis-prevent
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
          }}
        >
          {/* Hero media: drag down from here to close */}
          <motion.div
            layoutId={`media-${id}`}
            onPointerDown={(e) => dragControls.start(e)}
            style={{
              position: 'relative',
              height: '36svh',
              minHeight: 200,
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
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3rem 2rem 1.5rem' }}
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
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            style={{ padding: '1.5rem 1.5rem 1.5rem', color: c.text }}
          >
            <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: c.accent }}>
              {project.number} · {project.tag}
            </span>

            <h3
              style={{
                fontSize: 'clamp(1.6rem, 7.5vw, 2.4rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                margin: '10px 0 1.25rem',
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
              style={{ fontSize: '1rem', lineHeight: 1.7, margin: '0 0 1.75rem', display: 'flex', flexWrap: 'wrap', columnGap: '0.3em' }}
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
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
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
          </motion.div>
        </div>

        {/* Footer: pinned to the bottom, always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.4, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          style={{
            flexShrink: 0,
            padding: '12px 1.5rem calc(16px + env(safe-area-inset-bottom))',
            borderTop: `1px solid ${c.border}`,
            backgroundColor: c.sheetBg,
          }}
        >
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
                padding: '15px 20px',
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
/* Draggable filter switch (iPhone segmented-control style)            */
/* ------------------------------------------------------------------ */
function FilterSwitch({ value, onChange, countFor, c }) {
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
    if (idx !== d.idx) navigator.vibrate?.(8); // tiny tick when crossing a segment (Android)
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
        gap: 6,
        padding: 5,
        borderRadius: 999,
        backgroundColor: c.chipBg,
        border: `1px solid ${c.border}`,
        marginBottom: '1.75rem',
        // vertical swipes still scroll the page; sideways drags move the pill
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Gold pill: follows the finger while dragging, springs into place otherwise */}
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
            backgroundColor: c.accent,
            boxShadow:'none',
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
              flex: 1,
              padding: '9px 0',
              border: 'none',
              background: 'transparent',
              borderRadius: 999,
              cursor: 'pointer',
              color: on ? c.accentText : c.text,
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'color 0.2s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>
              {f.label}
              <sup className="mono" style={{ fontSize: '0.55rem', marginLeft: 2, opacity: 0.7 }}>
                {countFor(f.key)}
              </sup>
            </span>
          </button>
        );
      })}
    </div>
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

  // The first project starts open, so the list never looks empty
  const [openId, setOpenId] = useState(() => (filtered[0] ? filtered[0].number : null));

  const changeFilter = (key) => {
    setFilter(key);
    const first = key === 'ALL' ? projects[0] : projects.find((p) => categoryOf(p) === key);
    setOpenId(first ? first.number : null);
  };

  const toggleRow = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <div style={{ backgroundColor: c.bg }}>
      <section
        id="projects"
        ref={sectionRef}
        style={{ padding: '4rem max(5vw, calc((100vw - 980px) / 2)) 4.5rem', backgroundColor: c.bg, borderTop: `1px solid ${c.border}`, position: 'relative' }}
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

        {/* Filters (drag the gold pill, or tap) */}
        <FilterSwitch value={filter} onChange={changeFilter} countFor={countFor} c={c} />

{/* Hairline list */}
        <div>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((p, i) => (
              <ProjectRow
                key={p.number}
                project={p}
                index={i}
                open={openId === p.number}
                onToggle={() => toggleRow(p.number)}
                onOpen={setSelected}
                c={c}
                isDark={isDark}
              />
            ))}
          </AnimatePresence>
          <div style={{ borderTop: `1px solid ${isDark ? 'rgba(244,241,234,0.14)' : 'rgba(255,255,255,0.18)'}` }} />
        </div>
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