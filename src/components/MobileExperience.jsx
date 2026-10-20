import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useDragControls,
} from 'framer-motion';

const GAP = 12;          // px between cards
const CARD_VW = 0.84;    // card width as a fraction of the scroller width

const pad2 = (n) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
/* Single card in the deck                                             */
/* ------------------------------------------------------------------ */
function DeckCard({ exp, index, total, step, scrollX, t, onOpen, cardWidth }) {
  const center = index * step;
  const range = [center - step, center, center + step];
  const scale = useTransform(scrollX, range, [0.92, 1, 0.92]);
  const opacity = useTransform(scrollX, range, [0.5, 1, 0.5]);
  const rotate = useTransform(scrollX, range, [2.5, 0, -2.5]);

  return (
    <motion.article
      style={{
        scale,
        opacity,
        rotate,
        flex: `0 0 ${cardWidth}px`,
        scrollSnapAlign: 'center',
        scrollSnapStop: 'always',
        backgroundColor: t.card,
        color: t.cardText,
        borderRadius: 24,
        padding: '1.75rem 1.4rem 1.4rem',
        boxShadow: t.shadow,
        display: 'flex',
        flexDirection: 'column',
        transformOrigin: 'center bottom',
        willChange: 'transform, opacity',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', opacity: 0.8 }}>
          {pad2(index + 1)} / {pad2(total)}
        </span>
        <span
          className="mono"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            padding: '4px 10px',
            borderRadius: 999,
            backgroundColor: t.accent === t.card ? t.cardText : t.accent,
            color: t.card,
            fontWeight: 600,
          }}
        >
          {exp.duration.toUpperCase()}
        </span>
      </div>

      <h3
        style={{
          fontSize: 'clamp(1.6rem, 8vw, 2.2rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          margin: '1.1rem 0 0.6rem',
        }}
      >
        {exp.role}
      </h3>

      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{exp.company}</div>
      <div className="mono" style={{ fontSize: '0.65rem', opacity: 0.75, marginTop: 4 }}>
        {exp.location} · {exp.type}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '1.25rem 0 1.5rem' }}>
        {exp.tags.map((tag) => (
          <span
            key={tag}
            className="mono"
            style={{
              fontSize: '0.62rem',
              padding: '6px 12px',
              border: `1px solid ${t.cardText}`,
              borderRadius: 999,
              letterSpacing: '0.03em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="mono" style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: 12 }}>
          {exp.period}
        </div>
        <button
          type="button"
          onClick={() => onOpen(index)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 10px 10px 20px',
            borderRadius: 999,
            border: 'none',
            backgroundColor: t.panel,
            color: t.panelText,
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>View highlights</span>
          <span aria-hidden style={{ display: 'inline-flex' }}>
            <svg width="26" height="26" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="24" cy="24" r="22" />
              <line x1="24" y1="34" x2="24" y2="14" />
              <polyline points="16,22 24,14 32,22" />
            </svg>
          </span>
        </button>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom sheet with description + key contributions                   */
/* ------------------------------------------------------------------ */
function HighlightsSheet({ exp, index, total, t, onClose }) {
  const dragControls = useDragControls();

  useEffect(() => {
    // Lock the page behind the sheet (works on iPhone too, and pauses Lenis)
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyTouch: body.style.touchAction,
    };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    window.lenis?.stop?.();

    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.touchAction = prev.bodyTouch;
      window.lenis?.start?.();
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const EASE_OUT = [0.22, 1, 0.36, 1];
  const words = exp.description.split(' ');
  const descStart = 0.35; // description starts after the title
  const listStart = descStart + words.length * 0.012 + 0.15; // list starts after the description

  // Description: word-by-word fade with a soft blur
  const desc = { hidden: {}, show: { transition: { staggerChildren: 0.012, delayChildren: descStart } } };
  const word = {
    hidden: { opacity: 0, y: 6, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE_OUT } },
  };

  // Contributions: each row rises in, then a line draws underneath it
  const list = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: listStart } } };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  };
  const line = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.15 } },
  };

  return (
    <>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 999,
          touchAction: 'none',
        }}
        onTouchMove={(e) => e.preventDefault()}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${exp.role} at ${exp.company} — highlights`}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 500) onClose();
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '86vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: t.panel,
          color: t.panelText,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: '0 -20px 50px rgba(0,0,0,0.35)',
          zIndex: 1000,
        }}
      >
        {/* Drag handle + header (drag starts here so the list can scroll) */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          style={{ padding: '12px 1.5rem 1rem', touchAction: 'none', cursor: 'grab' }}
        >
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 44, opacity: 0.3 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
            style={{
              height: 5,
              borderRadius: 999,
              backgroundColor: t.panelText,
              margin: '0 auto 1.25rem',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <motion.span
                className="mono"
                initial={{ opacity: 0, letterSpacing: '0.4em' }}
                animate={{ opacity: 1, letterSpacing: '0.15em' }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.12 }}
                style={{ display: 'inline-block', fontSize: '0.65rem', color: t.accent }}
              >
                {pad2(index + 1)} / {pad2(total)} · {exp.period}
              </motion.span>
              {/* Title slides up out of a mask */}
              <div style={{ overflow: 'hidden', margin: '6px 0 2px' }}>
                <motion.h4
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.18 }}
                  style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1, paddingBottom: 2 }}
                >
                  {exp.role}
                </motion.h4>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.85, x: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.28 }}
                style={{ fontSize: '0.9rem', fontWeight: 600 }}
              >
                {exp.company}
              </motion.div>
            </div>
            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Close"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              whileTap={{ scale: 0.88, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.2 }}
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: `1px solid ${t.panelText}`,
                background: 'transparent',
                color: t.panelText,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </motion.button>
          </div>
        </div>

        <div
          data-lenis-prevent
          style={{
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            padding: '0 1.5rem calc(2rem + env(safe-area-inset-bottom))',
          }}
        >
          <motion.p
            variants={desc}
            initial="hidden"
            animate="show"
            style={{ fontSize: '0.95rem', lineHeight: 1.65, margin: '0 0 1.5rem', opacity: 0.9 }}
          >
            {words.map((w, i) => (
              <motion.span key={i} variants={word} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                {w}{i < words.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.p>

          {/* Label with a line that draws out beside it */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <motion.span
              className="mono"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: listStart - 0.1 }}
              style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: t.accent, whiteSpace: 'nowrap' }}
            >
              KEY CONTRIBUTIONS
            </motion.span>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: listStart }}
              style={{ flex: 1, height: 1, backgroundColor: t.panelText, opacity: 0.25, transformOrigin: 'left' }}
            />
          </div>

          <motion.ul variants={list} initial="hidden" animate="show" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {exp.highlights.map((h, j) => {
              const last = j === exp.highlights.length - 1;
              return (
                <motion.li
                  key={j}
                  variants={item}
                  style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '2rem 1fr',
                    alignItems: 'baseline',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    paddingBottom: last ? 0 : 14,
                    marginBottom: last ? 0 : 14,
                  }}
                >
                  <span className="mono" style={{ color: t.accent, fontSize: '0.72rem', fontWeight: 700 }}>
                    {pad2(j + 1)}
                  </span>
                  <span>{h}</span>
                  {!last && (
                    <motion.span
                      aria-hidden
                      variants={line}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 1,
                        backgroundColor: t.panelText,
                        opacity: 0.15,
                        transformOrigin: 'left',
                      }}
                    />
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Main mobile section                                                 */
/* ------------------------------------------------------------------ */
export default function MobileExperience({ experiences, theme: t, sectionRef }) {
  const total = experiences.length;
  const scrollerRef = useRef(null);

  const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
  const [cardWidth, setCardWidth] = useState(Math.round(initialWidth * CARD_VW));
  const [sidePad, setSidePad] = useState(Math.round((initialWidth - initialWidth * CARD_VW) / 2));
  const step = cardWidth + GAP;

  const [active, setActive] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  // Measure the scroller so cards stay centred on every screen size
  useEffect(() => {
    const measure = () => {
      const w = scrollerRef.current?.clientWidth ?? window.innerWidth;
      const cw = Math.round(w * CARD_VW);
      setCardWidth(cw);
      setSidePad(Math.round((w - cw) / 2));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollX } = useScroll({ container: scrollerRef });

  useMotionValueEvent(scrollX, 'change', (v) => {
    const i = Math.max(0, Math.min(total - 1, Math.round(v / step)));
    if (i !== active) setActive(i);
    if (!hasSwiped && v > 12) setHasSwiped(true);
  });

  const progress = useTransform(scrollX, [0, Math.max(1, (total - 1) * step)], [1 / total, 1], { clamp: true });

  const goTo = useCallback(
    (i) => scrollerRef.current?.scrollTo({ left: i * step, behavior: 'smooth' }),
    [step]
  );

  const closeSheet = useCallback(() => setOpenIndex(null), []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: t.bg,
        borderTop: `1px solid ${t.border}`,
        zIndex: 3,
        padding: '4rem 0 3.5rem',
        overflow: 'hidden',
      }}
    >
      <style>{`.mx-scroller::-webkit-scrollbar{display:none}`}</style>

      {/* Heading */}
      <div style={{ padding: '0 5vw', marginBottom: '2rem' }}>
        <motion.span
          className="mono"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          style={{ color: t.label, fontSize: '0.75rem', letterSpacing: '0.15em', display: 'inline-block' }}
        >
          02 / EXPERIENCE
        </motion.span>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 32, height: 2, backgroundColor: t.accent, margin: '14px 0 1.25rem', transformOrigin: 'left' }}
        />
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(2.5rem, 14vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: t.heading,
            margin: 0,
          }}
        >
          WORK<br />HISTORY
        </motion.h2>
      </div>

      {/* Counter + swipe hint */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 5vw', marginBottom: '1rem' }}>
        <div className="mono" style={{ color: t.heading, display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ position: 'relative', display: 'inline-block', height: '1.6rem', overflow: 'hidden', minWidth: '1.6em' }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={active}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', fontSize: '1.4rem', fontWeight: 700 }}
              >
                {pad2(active + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>/ {pad2(total)}</span>
        </div>

        <AnimatePresence>
          {!hasSwiped && (
            <motion.span
              className="mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, 6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ x: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } }}
              style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: t.label }}
            >
              SWIPE →
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* The deck */}
      <div
        ref={scrollerRef}
        className="mx-scroller"
        style={{
          display: 'flex',
          gap: GAP,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          paddingLeft: sidePad,
          paddingRight: sidePad,
          paddingTop: 12,
          paddingBottom: 28,
          alignItems: 'stretch',
          overscrollBehaviorX: 'contain',
        }}
      >
        {experiences.map((exp, i) => (
          <DeckCard
            key={exp.company + exp.period}
            exp={exp}
            index={i}
            total={total}
            step={step}
            scrollX={scrollX}
            t={t}
            cardWidth={cardWidth}
            onOpen={setOpenIndex}
          />
        ))}
      </div>

      {/* Progress bar + dots */}
      <div style={{ padding: '0 5vw' }}>
        <div style={{ height: 2, backgroundColor: `${t.heading}33`, borderRadius: 2, overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', backgroundColor: t.heading, scaleX: progress, transformOrigin: 'left' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.1rem' }}>
          {experiences.map((exp, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to ${exp.role} at ${exp.company}`}
              onClick={() => goTo(i)}
              style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <motion.span
                animate={{ width: i === active ? 22 : 7, opacity: i === active ? 1 : 0.4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ display: 'block', height: 7, borderRadius: 999, backgroundColor: t.heading }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        {openIndex !== null && (
          <HighlightsSheet
            key="sheet"
            exp={experiences[openIndex]}
            index={openIndex}
            total={total}
            t={t}
            onClose={closeSheet}
          />
        )}
      </AnimatePresence>
    </section>
  );
}