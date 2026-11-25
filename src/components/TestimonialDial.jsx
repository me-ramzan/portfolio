import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion, useDragControls } from 'framer-motion';
// Your downloaded icon. Put the file at src/assets/icons/comment.jpg (or change this path).
import commentIcon from '../assets/images/comment.png';
import { useIsDark, useIsMobile, EASE } from '../lib/ui';
import { TESTIMONIALS, getTheme, initials, SERIF, useSerifFont, QuoteLines } from './testimonialsShared';

const useLayoutEffectSafe = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */
/* Floating speed-dial testimonials                                    */
/*                                                                     */
/* Desktop                                                             */
/*   hover button  -> faces peek out in a small arc + label            */
/*   click button  -> faces fan out fully                              */
/*   hover face    -> small bubble with a snippet                      */
/*   click face    -> full quote card (prev / next, Esc or outside     */
/*                    click closes)                                    */
/* Touch / mobile                                                      */
/*   tap button    -> fan out                                          */
/*   tap face      -> full quote as a bottom sheet (drag down to close)*/
/*                                                                     */
/* Open it from anywhere (e.g. a nav link):                            */
/*   window.dispatchEvent(new Event('testimonials:open'))              */
/*                                                                     */
/* Rendered into <body> (portal) so the Navbar's depth-of-field zoom,  */
/* which scales #root, never moves or scales it.                       */
/* Pass show={false} to keep it hidden (e.g. while the preloader runs).*/
/* ------------------------------------------------------------------ */

const FAB = 62; // main button size
const FACE = 44; // face size
const GAP = 28; // distance from the screen edge
const R_PEEK = 62; // arc radius when peeking
const R_OPEN = 118; // arc radius when open
const CARD_BOTTOM = FAB + 16 + R_OPEN - 20; // card sits just above the open fan
const TOP_CLEAR = 96; // keep the card below the Navbar island
const APPEAR_DELAY = 1.2; // seconds after `show` turns true before the button appears

const SPRING = { type: 'spring', stiffness: 420, damping: 30, mass: 0.8 };

function arc(k, total, radius) {
  const a = total > 1 ? (Math.PI / 2) * (k / (total - 1)) : Math.PI / 4;
  return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
}

function snippet(q) {
  const first = q.split(/[.,;]/)[0].trim();
  const words = first.split(' ');
  return words.length > 10 ? `${words.slice(0, 10).join(' ')}…` : `${first}…`;
}

/* Every quote uses the same size and the same card width, so switching
   between people never changes the type or reflows the card */
const QUOTE_FONT = 'clamp(1.15rem, 1.35vw, 1.4rem)';
const CARD_W = 440;

/* Height of an element, kept up to date */
function useHeight(ref) {
  const [h, setH] = useState(null);
  useLayoutEffectSafe(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    setH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);
  return h;
}

function useCanHover() {
  const [can, setCan] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const on = () => setCan(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return can;
}

/* Freeze the page like the Navbar does: pause Lenis, or block touch/wheel
   outside [data-lenis-prevent]. No overflow:hidden (it resizes the mobile
   viewport and makes every ScrollTrigger re-measure = jerk). */
function lockPageScroll() {
  const hasLenis = !!window.lenis?.stop;
  if (hasLenis) window.lenis.stop();
  const block = (e) => {
    if (e.target.closest && e.target.closest('[data-lenis-prevent]')) return;
    e.preventDefault();
  };
  if (!hasLenis) {
    document.addEventListener('touchmove', block, { passive: false });
    document.addEventListener('wheel', block, { passive: false });
  }
  return () => {
    if (hasLenis) window.lenis.start?.();
    document.removeEventListener('touchmove', block);
    document.removeEventListener('wheel', block);
  };
}

function palette(isDark) {
  const t = getTheme(isDark);
  return {
    ...t,
    fab: isDark ? '#D7C49E' : '#343148',
    fabText: isDark ? '#121018' : '#D7C49E',
    face: isDark ? '#343148' : '#D7C49E',
    faceText: isDark ? '#D7C49E' : '#343148',
    faceEdge: isDark ? '#121018' : '#F4F1EA',
    card: isDark ? '#1d1a28' : '#F4F1EA',
    cardText: isDark ? '#F4F1EA' : '#080808',
    peek: isDark ? '#F4F1EA' : '#121018',
    peekText: isDark ? '#080808' : '#F4F1EA',
  };
}

export default function TestimonialDial({ show = true }) {
  const isDark = useIsDark();
  const isMobile = useIsMobile();
  const canHover = useCanHover();
  const reduce = useReducedMotion();
  const c = palette(isDark);
  useSerifFont();

  const rootRef = useRef(null);
  const [appeared, setAppeared] = useState(false); // delayed first entrance
  const [mode, setMode] = useState('closed'); // 'closed' | 'peek' | 'open'
  const [active, setActive] = useState(null); // index of open quote
  const [hovered, setHovered] = useState(null); // index of peeked face

  const total = TESTIMONIALS.length;
  const useSheet = isMobile || !canHover;

  const closeAll = useCallback(() => {
    setMode('closed');
    setActive(null);
    setHovered(null);
  }, []);

  const openQuote = (k) => {
    setHovered(null);
    setActive(((k % total) + total) % total);
  };

  useEffect(() => {
    if (!show) {
      setAppeared(false);
      return undefined;
    }
    const id = setTimeout(() => setAppeared(true), APPEAR_DELAY * 1000);
    return () => clearTimeout(id);
  }, [show]);

  // Esc closes the card first, then the fan
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (active !== null) setActive(null);
      else if (mode !== 'closed') setMode('closed');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, mode]);

  // Click outside closes everything (desktop; the sheet has its own backdrop)
  useEffect(() => {
    if (mode !== 'open' || useSheet) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) closeAll();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [mode, useSheet, closeAll]);

  // Allow opening from a nav link etc.
  useEffect(() => {
    const open = () => {
      setAppeared(true);
      setMode('open');
      setActive(0);
    };
    window.addEventListener('testimonials:open', open);
    return () => window.removeEventListener('testimonials:open', open);
  }, []);

  const radius = mode === 'open' ? R_OPEN : mode === 'peek' ? R_PEEK : 0;
  const item = active !== null ? TESTIMONIALS[active] : null;
  const faceOffset = (FAB - FACE) / 2;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        right: `calc(${GAP}px + env(safe-area-inset-right))`,
        bottom: `calc(${GAP}px + env(safe-area-inset-bottom))`,
        width: FAB,
        height: FAB,
        zIndex: 900, // above the page, below the Navbar scrim (998) and island (1000)
        pointerEvents: appeared ? 'auto' : 'none',
      }}
    >
      {/* Label shown while peeking */}
      <AnimatePresence>
        {mode === 'peek' && (
          <motion.div
            className="mono"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              position: 'absolute',
              right: FAB + 14,
              top: '50%',
              marginTop: -14,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              whiteSpace: 'nowrap',
              borderRadius: 999,
              background: c.card,
              color: c.cardText,
              border: `0.5px solid ${c.hair}`,
              fontSize: '0.66rem',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
            }}
          >
            KIND WORDS · {String(total).padStart(2, '0')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Faces */}
      {TESTIMONIALS.map((tm, k) => {
        const p = arc(k, total, radius);
        const on = active === k;
        const shown = mode !== 'closed';
        return (
          <motion.button
            key={tm.name}
            type="button"
            aria-label={`Read testimonial from ${tm.name}`}
            tabIndex={mode === 'open' ? 0 : -1}
            onMouseEnter={() => canHover && mode === 'open' && active !== k && setHovered(k)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => mode === 'open' && setHovered(k)}
            onBlur={() => setHovered(null)}
            onClick={(e) => {
              e.stopPropagation();
              openQuote(k);
            }}
            initial={false}
            animate={{
              x: -p.x,
              y: -p.y,
              scale: !shown ? 0.4 : mode === 'peek' ? 0.72 : on ? 1.08 : 1,
              opacity: !shown ? 0 : mode === 'peek' ? 0.85 : 1,
            }}
            whileHover={mode === 'open' ? { scale: 1.14 } : undefined}
            transition={
              reduce
                ? { duration: 0 }
                : { ...SPRING, delay: mode === 'open' ? k * 0.045 : mode === 'peek' ? k * 0.025 : (total - 1 - k) * 0.02 }
            }
            style={{
              position: 'absolute',
              right: faceOffset,
              bottom: faceOffset,
              width: FACE,
              height: FACE,
              padding: 0,
              borderRadius: '50%',
              border: `2px solid ${c.faceEdge}`,
              background: on ? c.fab : c.face,
              color: on ? c.fabText : c.faceText,
              fontFamily: SERIF,
              fontSize: 17,
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
              pointerEvents: mode === 'open' ? 'auto' : 'none',
              transition: 'background-color 0.3s, color 0.3s',
            }}
          >
            {tm.photo ? (
              <img
                src={tm.photo}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05)' }}
              />
            ) : (
              initials(tm.name)
            )}
          </motion.button>
        );
      })}

      {/* Hover peek bubble */}
      <AnimatePresence>
        {hovered !== null && mode === 'open' && active !== hovered && (() => {
          const p = arc(hovered, total, R_OPEN);
          const tm = TESTIMONIALS[hovered];
          return (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{
                position: 'absolute',
                right: p.x + FAB - 4,
                bottom: p.y + 14,
                width: 220,
                padding: '10px 12px',
                borderRadius: '12px 12px 4px 12px',
                background: c.peek,
                color: c.peekText,
                pointerEvents: 'none',
                transformOrigin: 'bottom right',
              }}
            >
              <div className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.1em', opacity: 0.65 }}>
                {tm.name.toUpperCase()}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.15, marginTop: 4 }}>“{snippet(tm.quote)}”</div>
              <div className="mono" style={{ fontSize: '0.58rem', letterSpacing: '0.1em', opacity: 0.5, marginTop: 6 }}>
                CLICK TO READ
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Full quote: card on desktop, bottom sheet on touch */}
      {useSheet ? (
        <Sheet item={item} index={active} total={total} c={c} onClose={() => setActive(null)} onStep={(d) => openQuote(active + d)} />
      ) : (
        <AnimatePresence>
          {item && (
            <motion.div
              key="card"
              role="dialog"
              aria-label={`Testimonial from ${item.name}`}
              data-lenis-prevent
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96, transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] } }}
              transition={{ duration: 0.55, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                right: 0,
                bottom: CARD_BOTTOM,
                width: `min(${CARD_W}px, calc(100vw - 56px))`,
                // never taller than the space between the Navbar and the fan
                maxHeight: `calc(100svh - ${CARD_BOTTOM + GAP + TOP_CLEAR}px)`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '22px 24px',
                borderRadius: 18,
                background: c.card,
                color: c.cardText,
                border: `0.5px solid ${c.hair}`,
                transformOrigin: 'bottom right',
              }}
            >
              <QuoteBody item={item} index={active} total={total} c={c} onClose={() => setActive(null)} onStep={(d) => openQuote(active + d)} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Pulse sits beside the button (not inside it) so the button's hover
          scale / rotate never drags it along */}
      {!reduce && <PulseRing color={c.fab} visible={appeared && mode === 'closed'} />}

      {/* Main button */}
      <motion.button
        type="button"
        aria-label={mode === 'open' ? 'Close testimonials' : 'Show testimonials'}
        aria-expanded={mode === 'open'}
        onMouseEnter={() => canHover && mode === 'closed' && setMode('peek')}
        onMouseLeave={() => mode === 'peek' && setMode('closed')}
        onClick={(e) => {
          e.stopPropagation();
          if (mode === 'open') closeAll();
          else setMode('open');
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: !appeared ? 0 : mode === 'peek' ? 1.06 : 1, opacity: appeared ? 1 : 0, rotate: mode === 'open' ? -90 : 0 }}
        whileTap={{ scale: 0.94 }}
        transition={reduce ? { duration: 0 } : { ...SPRING, delay: 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          padding: 0,
          border: 'none',
          borderRadius: '50%',
          background: c.fab,
          color: c.fabText,
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          transition: 'background-color 0.3s, color 0.3s',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode === 'open' ? 'x' : 'q'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'grid', placeItems: 'center', rotate: mode === 'open' ? 90 : 0 }}
          >
            {mode === 'open' ? <CloseIcon /> : <ImageIcon src={commentIcon} isDark={isDark} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>,
    document.body,
  );
}

/* Quote, name and prev/next: shared by the card and the sheet */
function QuoteBody({ item, index, total, c, onClose, onStep, onHeaderPointerDown }) {
  // Scrollable middle: fades at the edges only when there is more text that way
  const scrollRef = useRef(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    el.scrollTop = 0;
    const check = () =>
      setEdges({ top: el.scrollTop > 2, bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 2 });
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener('scroll', check, { passive: true });
    const t = setTimeout(check, 700); // after the line reveal settles
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', check);
      clearTimeout(t);
    };
  }, [index]);

  const fade = 28;
  const mask = `linear-gradient(to bottom, ${edges.top ? 'transparent' : '#000'} 0, #000 ${fade}px, #000 calc(100% - ${fade}px), ${
    edges.bottom ? 'transparent' : '#000'
  } 100%)`;

  // Smooth switching: the old quote is popped out of the layout (so the new one
  // is measured right away) and the box glides to the new height instead of
  // snapping. The new quote waits for the old lines to leave before rising.
  const innerRef = useRef(null);
  const [settled, setSettled] = useState(true);
  const contentH = useHeight(innerRef);
  const first = useRef(true);
  useEffect(() => {
    const id = setTimeout(() => (first.current = false), 50);
    return () => clearTimeout(id);
  }, []);
  const enterDelay = first.current ? 0.05 : 0.2;

  return (
    <>
      <div
        className="mono"
        onPointerDown={onHeaderPointerDown}
        style={{ flex: 'none', display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', letterSpacing: '0.1em', color: c.muted, touchAction: onHeaderPointerDown ? 'none' : undefined }}
      >
        <span>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button type="button" onClick={onClose} className="mono" style={linkBtn(c.muted)}>
          CLOSE ✕
        </button>
      </div>

      <motion.div
        ref={scrollRef}
        data-lenis-prevent
        initial={false}
        animate={contentH == null ? undefined : { height: contentH }}
        onAnimationStart={() => setSettled(false)}
        onAnimationComplete={() => setSettled(true)}
        // resize once the old lines have left, while the new ones rise in
        transition={{ duration: 0.55, ease: EASE, delay: first.current ? 0 : 0.16 }}
        style={{
          position: 'relative',
          flex: '0 1 auto', // may shrink below its height when space is short, then it scrolls
          minHeight: 0,
          // no scrollbar while the box is resizing (it would flash in and out),
          // and its space is always reserved so the text width never changes
          overflowY: settled ? 'auto' : 'hidden',
          scrollbarGutter: 'stable',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
          marginTop: 14,
          marginRight: -14, // the reserved scrollbar lane sits in the card's padding
          paddingRight: 4,
          scrollbarWidth: 'thin',
          scrollbarColor: `${c.hair} transparent`,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
      <div ref={innerRef} style={{ position: 'relative' }}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial="hidden"
          animate="show"
          exit="exit"
          // the old quote fades out quickly as one block (no line-by-line overlap
          // with the new one), then the new quote rises in line by line
          variants={{ hidden: { opacity: 1 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: 'easeIn' } } }}
          style={{ paddingBottom: 2, width: '100%' }}
        >
          <QuoteLines
            text={`“${item.quote}”`}
            delay={enterDelay}
            style={{ fontFamily: SERIF, fontWeight: 400, fontSize: QUOTE_FONT, lineHeight: 1.16, letterSpacing: '-0.01em', color: c.cardText }}
          />
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: enterDelay + 0.3 } },
              exit: { opacity: 0, transition: { duration: 0.15 } },
            }}
            style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 18 }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                flex: 'none',
                overflow: 'hidden',
                display: 'grid',
                placeItems: 'center',
                background: c.fab,
                color: c.fabText,
                fontFamily: SERIF,
                fontSize: 16,
              }}
            >
              {item.photo ? (
                <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }} />
              ) : (
                initials(item.name)
              )}
            </div>
            <div className="mono" style={{ fontSize: '0.66rem', letterSpacing: '0.1em', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700 }}>{item.name.toUpperCase()}</div>
              <div style={{ color: c.muted }}>
                {item.role.toUpperCase()}, {item.company.toUpperCase()}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      </div>
      </motion.div>

      <div className="mono" style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 18, marginTop: 18, fontSize: '0.66rem', letterSpacing: '0.1em' }}>
        <button type="button" onClick={() => onStep(-1)} className="mono" style={linkBtn(c.accent)}>
          ← PREV
        </button>
        <button type="button" onClick={() => onStep(1)} className="mono" style={linkBtn(c.accent)}>
          NEXT →
        </button>
        {item.linkedin && (
          <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', color: c.accent, textDecoration: 'none' }}>
            LINKEDIN ↗
          </a>
        )}
      </div>
    </>
  );
}

/* Bottom sheet for touch screens */
function Sheet({ item, index, total, c, onClose, onStep }) {
  const dragControls = useDragControls();
  const startDrag = (e) => dragControls.start(e);
  const isOpen = !!item;
  useEffect(() => (isOpen ? lockPageScroll() : undefined), [isOpen]);

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(18,16,24,0.5)', zIndex: 61 }}
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-label={`Testimonial from ${item.name}`}
            data-lenis-prevent
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] } }}
            transition={{ duration: 0.55, ease: EASE }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) onClose();
            }}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 62,
              maxHeight: '88svh',
              display: 'flex',
              flexDirection: 'column',
              padding: '0 max(5vw, 20px) calc(24px + env(safe-area-inset-bottom))',
              borderRadius: '20px 20px 0 0',
              background: c.card,
              color: c.cardText,
            }}
          >
            {/* Drag handle (drag down here or on the header to close) */}
            <div onPointerDown={startDrag} style={{ flex: 'none', padding: '10px 0 16px', touchAction: 'none', cursor: 'grab' }}>
              <div style={{ width: 44, height: 4, borderRadius: 2, background: c.hair, margin: '0 auto' }} />
            </div>
            <QuoteBody item={item} index={index} total={total} c={c} onClose={onClose} onStep={onStep} onHeaderPointerDown={startDrag} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* Small pieces */
/* Soft ring that breathes out from behind the button.
   Pure CSS transform/opacity, so it runs on the compositor and stays smooth
   even while Lenis / GSAP keep the main thread busy. It starts hidden behind
   the button and ends fully transparent, so the loop restart is invisible. */
function PulseRing({ color, visible }) {
  return (
    <>
      <style>{`
        @keyframes tdPulse {
          0%   { transform: scale(1);    opacity: 0; }
          15%  { opacity: 0.45; }
          100% { transform: scale(1.55); opacity: 0; }
        }
      `}</style>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `1px solid ${color}`,
          pointerEvents: 'none',
          animation: 'tdPulse 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          opacity: 0,
          visibility: visible ? 'visible' : 'hidden',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      />
    </>
  );
}

/* Your JPEG icon on the button.
   A JPEG can't be transparent, so blending hides its white background:
   - dark theme (gold button): multiply -> white disappears, the dark icon stays
   - light theme (dark button): invert first, then screen -> the background
     disappears and the icon shows light on the dark button
   Assumes a dark icon on a white background (the usual download). */
function ImageIcon({ src, isDark }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        width: 26,
        height: 26,
        objectFit: 'contain',
        display: 'block',
        pointerEvents: 'none',
        mixBlendMode: isDark ? 'multiply' : 'screen',
        filter: isDark ? 'none' : 'invert(1)',
      }}
    />
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const linkBtn = (color) => ({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color,
  font: 'inherit',
  letterSpacing: 'inherit',
});