import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useTransform,
  useMotionValue,
  useMotionTemplate,
  animate,
} from 'framer-motion';
import { Award, Mic, Rocket } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];
const GOLD = '#D7C49E';
const ACH_ICONS = [Award, Mic, Rocket];

function getColors(isDark) {
  return isDark
    ? { bg: '#121018', card: '#1d1a28', cardEdge: 'rgba(244,241,234,0.08)', text: '#F4F1EA', muted: 'rgba(244,241,234,0.55)', line: 'rgba(244,241,234,0.14)' }
    : { bg: '#343148', card: '#2a2740', cardEdge: 'rgba(255,255,255,0.1)', text: '#FFFFFF', muted: 'rgba(255,255,255,0.6)', line: 'rgba(255,255,255,0.18)' };
}

const years = (period) => (period.match(/\d{4}/g) || []).map(Number);

function parseDegree(degree) {
  const [long, rest = ''] = degree.split('—').map((s) => s.trim());
  const tag = (rest.match(/\(([^)]+)\)/) || [])[1] || null;
  const short = rest.replace(/\(.*?\)/, '').trim() || long;
  return { short, long, tag };
}

/* Masked line reveal */
function Reveal({ children, delay = 0, inView, style }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Bottom padding keeps descenders (g, p, y) inside the mask */}
      <motion.div
        initial={{ y: '110%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 0.9, delay, ease: EASE }}
        style={{ paddingBottom: '0.16em', ...style }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Hairline that draws itself */
function Hairline({ inView, delay = 0, c }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.1, delay, ease: EASE }}
      style={{ height: 1, backgroundColor: c.line, transformOrigin: 'left' }}
    />
  );
}

/* Count-up number */
function CountUp({ to, inView, delay = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      delay,
      ease: EASE,
      onUpdate: (x) => setV(Math.round(x)),
    });
    return () => controls.stop();
  }, [inView, to, delay]);
  return <>{v}</>;
}

/* ------------------------------------------------------------------ */
/* Editorial education                                                 */
/* ------------------------------------------------------------------ */
function EducationEditorial({ education, c }) {
  const items = useMemo(() => [...education].sort((a, b) => years(b.period)[0] - years(a.period)[0]), [education]);
  const top = items[0];
  const topDeg = parseDegree(top.degree);

  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <div>
      {/* Label */}
      <div ref={headRef}>
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', letterSpacing: '0.15em', color: c.text, marginBottom: 14 }}>
          <span>05 / EDUCATION</span>
          <span style={{ color: c.muted }}>{items.length} QUALIFICATIONS</span>
        </div>
        <Hairline inView={headIn} c={c} />

        {/* Headline summary */}
        <div style={{ marginTop: '2rem' }}>
          <Reveal inView={headIn} delay={0.1} style={{ fontSize: 'clamp(1.7rem, 8vw, 2.3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12, color: c.text }}>
            {topDeg.short}
            {topDeg.tag && <span style={{ color: GOLD }}> with {topDeg.tag},</span>}
          </Reveal>
          <Reveal inView={headIn} delay={0.2} style={{ fontSize: 'clamp(1.7rem, 8vw, 2.3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12, color: c.muted }}>
            specialised in AI
          </Reveal>
          <Reveal inView={headIn} delay={0.3} style={{ fontSize: 'clamp(1.7rem, 8vw, 2.3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12, color: c.muted }}>
            & Data Science.
          </Reveal>
        </div>
      </div>

      {/* Rows */}
      <div style={{ marginTop: '2.25rem' }}>
        {items.map((edu, i) => (
          <EduRow key={edu.degree} edu={edu} isLast={i === items.length - 1} c={c} />
        ))}
      </div>

    </div>
  );
}

function EduRow({ edu, isLast, c }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { long, tag } = parseDegree(edu.degree);
  const [y1, y2] = [years(edu.period)[0], years(edu.period).slice(-1)[0]];

  return (
    <div ref={ref}>
      <Hairline inView={inView} c={c} />
      <div style={{ display: 'grid', gridTemplateColumns: '78px 1fr', gap: 14, padding: '1.4rem 0 1.5rem' }}>
        {/* Years column */}
        <div>
          <Reveal inView={inView} delay={0.15}>
            <span className="mono" style={{ fontSize: '0.78rem', fontWeight: 600, color: GOLD, letterSpacing: '0.02em' }}>{y2}</span>
          </Reveal>
          <Reveal inView={inView} delay={0.2}>
            <span className="mono" style={{ fontSize: '0.68rem', color: c.muted }}>{y1}</span>
          </Reveal>
        </div>

        {/* Details column */}
        <div>
          <Reveal inView={inView} delay={0.2} style={{ fontSize: '1.08rem', fontWeight: 700, color: c.text, lineHeight: 1.3 }}>
            {long}
          </Reveal>
          <Reveal inView={inView} delay={0.28} style={{ fontSize: '0.88rem', color: c.text, opacity: 0.85, marginTop: 4 }}>
            {edu.institution}
          </Reveal>
          <Reveal inView={inView} delay={0.34}>
            <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.06em', color: c.muted }}>
              {edu.location}
              {tag && <span style={{ color: GOLD }}> · {tag.toUpperCase()}</span>}
            </span>
          </Reveal>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mono"
            style={{ fontSize: '0.64rem', lineHeight: 1.8, letterSpacing: '0.03em', color: c.muted, margin: '12px 0 0' }}
          >
            {edu.subjects.join('  ·  ')}
          </motion.p>
        </div>
      </div>
      {isLast && <Hairline inView={inView} delay={0.3} c={c} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Swipeable achievement deck                                          */
/* ------------------------------------------------------------------ */
function DeckCard({ item, index, depth, total, onSwipe, c }) {
  const isTop = depth === 0;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-16, 16]);
  const glareX = useTransform(x, [-220, 220], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% 0%, rgba(255,255,255,0.16), transparent 60%)`;
  const Icon = ACH_ICONS[index] || Award;

  const handleDragEnd = async (_, info) => {
    const far = Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500;
    if (far) {
      const dir = Math.sign(info.offset.x || info.velocity.x) || 1;
      navigator.vibrate?.(12);
      await animate(x, dir * 520, { duration: 0.28, ease: 'easeIn' });
      onSwipe();
      x.set(0);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  };

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragMomentum={false}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      animate={{ scale: 1 - depth * 0.06, y: depth * 18, opacity: depth > 2 ? 0 : 1 - depth * 0.2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        x,
        rotate,
        position: 'absolute',
        inset: 0,
        zIndex: total - depth,
        borderRadius: 24,
        padding: '1.5rem 1.4rem',
        background: `linear-gradient(155deg, ${c.card} 0%, #13111b 100%)`,
        border: `1px solid ${isTop ? 'rgba(215,196,158,0.35)' : c.cardEdge}`,
        boxShadow: isTop ? '0 30px 60px rgba(0,0,0,0.45)' : '0 10px 20px rgba(0,0,0,0.2)',
        color: '#F4F1EA',
        cursor: isTop ? 'grab' : 'default',
        touchAction: 'pan-y',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <motion.div aria-hidden style={{ position: 'absolute', inset: 0, background: glare, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <motion.div
          animate={isTop ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
          transition={{ duration: 2.4, repeat: isTop ? Infinity : 0, repeatDelay: 1.5 }}
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, rgba(215,196,158,0.25), rgba(215,196,158,0.05))',
            border: '1px solid rgba(215,196,158,0.4)',
          }}
        >
          <Icon size={24} color={GOLD} />
        </motion.div>
        <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: 'rgba(244,241,234,0.55)' }}>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div style={{ marginTop: 'auto', position: 'relative' }}>
        <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: GOLD }}>
          {item.org.toUpperCase()}
        </span>
        <h4 style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '6px 0 10px' }}>
          {item.title}
        </h4>
        <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0, color: 'rgba(244,241,234,0.8)' }}>{item.desc}</p>
      </div>
    </motion.div>
  );
}

/* Circle-outline chevrons — same icons as the desktop Education section */
function CircleChevron({ dir = 'right', size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22" />
      {dir === 'left' ? <polyline points="27,15 18,24 27,33" /> : <polyline points="21,15 30,24 21,33" />}
    </svg>
  );
}

function AchievementDeck({ achievements, c }) {
  const [order, setOrder] = useState(achievements.map((_, i) => i));
  const next = () => setOrder((o) => [...o.slice(1), o[0]]);
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  const topIndex = order[0];

  const navBtn = {
    width: 42,
    height: 42,
    padding: 0,
    border: 'none',
    background: 'transparent',
    color: c.text,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 20 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ position: 'relative', height: 360, transformPerspective: 900 }}
      >
        <div style={{ position: 'absolute', inset: '0 0 36px 0' }}>
          {order.map((idx, depth) => (
            <DeckCard key={idx} item={achievements[idx]} index={idx} depth={depth} total={achievements.length} onSwipe={next} c={c} />
          ))}
        </div>
      </motion.div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <motion.button type="button" aria-label="Previous achievement" onClick={prev} style={navBtn} whileTap={{ scale: 0.9, color: GOLD }}>
          <CircleChevron dir="left" />
        </motion.button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {achievements.map((_, i) => (
              <motion.span
                key={i}
                animate={{ width: i === topIndex ? 20 : 6, opacity: i === topIndex ? 1 : 0.4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ height: 6, borderRadius: 999, backgroundColor: GOLD, display: 'block' }}
              />
            ))}
          </div>
          <motion.span
            className="mono"
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: c.muted }}
          >
            ← SWIPE →
          </motion.span>
        </div>
        <motion.button type="button" aria-label="Next achievement" onClick={next} style={navBtn} whileTap={{ scale: 0.9, color: GOLD }}>
          <CircleChevron dir="right" />
        </motion.button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function MobileEducation({ education, achievements, isDark, sectionRef }) {
  const c = getColors(isDark);

  return (
    <section
      id="education"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '4.5rem 6vw 4rem',
        backgroundColor: c.bg,
        borderTop: `1px solid ${c.line}`,
        overflow: 'hidden',
      }}
    >
      <EducationEditorial education={education} c={c} />

      <div style={{ height: '4.5rem' }} />

      <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', letterSpacing: '0.15em', color: c.text, marginBottom: 14 }}>
        <span>ACHIEVEMENTS</span>
        <span style={{ color: c.muted }}>{String(achievements.length).padStart(2, '0')}</span>
      </div>
      <div style={{ height: 1, backgroundColor: c.line, marginBottom: '1.75rem' }} />
      <AchievementDeck achievements={achievements} c={c} />
    </section>
  );
}