import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Award, GraduationCap, BadgeCheck } from 'lucide-react';
import MobileEducation from './MobileEducation';
import { useIsMobile, useIsDark, SectionLabel, EASE } from '../lib/ui';

const education = [
  {
    degree: 'Bachelors in Computer Science — BSCS (Honors)',
    institution: 'University of Central Punjab',
    location: 'Lahore, Pakistan',
    period: 'June 2021 – July 2025',
    details: 'Major: Data Science, Artificial Intelligence, Data Structures, LLMs',
    subjects: ['DSA', 'DAA', 'Artificial Intelligence', 'LLMs', 'Data Science'],
  },
  {
    degree: 'Intermediate of Computer Science — ICS',
    institution: 'Punjab Group of Colleges',
    location: 'Lahore, Pakistan',
    period: 'May 2019 – March 2021',
    details: 'Subjects: Computer Science, Maths, Physics',
    subjects: ['Computer Science', 'Mathematics', 'Physics'],
  },
];

const achievements = [
  {
    title: 'Team Leadership Award',
    org: 'Sybros Tech',
    desc: 'Led the RPA team to deliver enterprise automations. Earned a LinkedIn recommendation from the CEO for leadership and technical excellence.',
  },
  {
    title: 'RPA Workshop Speaker',
    org: 'UMT × Sybros Tech',
    desc: 'Conducted RPA workshop hosted by UMT\'s Department of AI. Contributed to signing of MoU offering internship opportunities for students.',
  },
  {
    title: 'UAE Enterprise Projects',
    org: 'Impact BBDO',
    desc: 'Led AI-driven automation and software projects across the UAE using RPA, n8n, Python, React.js, Node.js, and Docker in multiple sectors.',
  },
];

const GOLD = '#D7C49E';
const NAVY = '#343148';
const INK = '#121018';
const AUTO_MS = 4500;

// One list of "passes": degrees first, then awards
const yearsOf = (p) => p.match(/\d{4}/g) || [];
const PASSES = [
  ...education.map((e) => {
    const [title, short] = e.degree.split(' — ');
    const y = yearsOf(e.period);
    return {
      kind: 'degree',
      label: 'DEGREE',
      title: title.trim(),
      code: (short || '').replace(/\s*\(Honou?rs\)/i, '').trim(),
      honors: /honou?rs/i.test(e.degree),
      issuer: e.institution,
      year: y[1] || y[0] || '',
      span: y.length > 1 ? `${y[0]} — ${y[1]}` : y[0] || '',
      chips: e.subjects,
    };
  }),
  ...achievements.map((a) => ({
    kind: 'award',
    label: 'RECOGNITION',
    title: a.title,
    issuer: a.org,
    desc: a.desc,
  })),
];

function getTheme(isDark) {
  return isDark
    ? {
        bg: INK,
        sectionBorder: NAVY,
        text: '#F4F1EA',
        muted: 'rgba(244,241,234,0.55)',
        line: 'rgba(244,241,234,0.12)',
        rowOn: 'rgba(215,196,158,0.08)',
      }
    : {
        bg: NAVY,
        sectionBorder: '#1A1A1A',
        text: '#FFFFFF',
        muted: 'rgba(255,255,255,0.62)',
        line: 'rgba(255,255,255,0.16)',
        rowOn: 'rgba(215,196,158,0.12)',
      };
}

/* ---------- Pass contents ---------- */
function PassFace({ pass, index }) {
  const isDegree = pass.kind === 'degree';
  // Degrees: deep navy pass. Awards: gold pass.
  const fg = isDegree ? '#F4F1EA' : INK;
  const sub = isDegree ? 'rgba(244,241,234,0.62)' : 'rgba(18,16,24,0.62)';
  const hair = isDegree ? 'rgba(244,241,234,0.14)' : 'rgba(18,16,24,0.16)';
  const accent = isDegree ? GOLD : NAVY;
  const Icon = isDegree ? GraduationCap : Award;

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: fg }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.62rem', letterSpacing: '0.16em', color: accent }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDegree ? 'rgba(215,196,158,0.14)' : 'rgba(52,49,72,0.12)',
            }}
          >
            <Icon size={16} color={accent} />
          </span>
          {pass.label}
          {pass.code ? ` · ${pass.code.toUpperCase()}` : ''}
          {pass.honors ? ' · HONORS' : ''}
        </span>
        <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.58rem', letterSpacing: '0.14em', color: sub }}>
          {String(index + 1).padStart(2, '0')} / {String(PASSES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Title */}
      <div style={{ marginTop: 'auto' }}>
        <div className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: sub, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <BadgeCheck size={13} color={accent} />
          {pass.issuer.toUpperCase()}
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 'clamp(1.6rem, 2.4vw, 2.3rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.08,
            maxWidth: '16ch',
          }}
        >
          {pass.title}
        </h3>
      </div>

      {/* Bottom */}
      <div style={{ marginTop: '1.4rem', paddingTop: '1.1rem', borderTop: `1px solid ${hair}` }}>
        {isDegree ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {pass.chips.map((c) => (
                <span
                  key={c}
                  className="mono"
                  style={{ fontSize: '0.6rem', padding: '5px 10px', borderRadius: 999, border: `1px solid ${hair}`, color: fg, whiteSpace: 'nowrap' }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="mono" style={{ fontSize: '0.56rem', letterSpacing: '0.14em', color: sub }}>{pass.span}</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: GOLD }}>{pass.year}</div>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'rgba(18,16,24,0.78)', maxWidth: '52ch' }}>
            {pass.desc}
          </p>
        )}
      </div>

    </div>
  );
}

function PassShell({ pass, children }) {
  const isDegree = pass.kind === 'degree';
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 26,
        padding: '1.8rem 2rem 1.7rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: isDegree
          ? `linear-gradient(135deg, #3d3954 0%, ${NAVY} 45%, #26233a 100%)`
          : `linear-gradient(135deg, #e6d6b4 0%, ${GOLD} 50%, #c4ae80 100%)`,
        border: isDegree ? '1px solid rgba(215,196,158,0.28)' : '1px solid rgba(255,255,255,0.35)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Certificate-style rings */}
      <svg aria-hidden="true" viewBox="0 0 200 200" style={{ position: 'absolute', right: -60, bottom: -70, width: 300, height: 300, opacity: isDegree ? 0.12 : 0.18 }}>
        {[90, 78, 66, 54, 42, 30].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={isDegree ? GOLD : NAVY} strokeWidth="0.6" />
        ))}
      </svg>
      {children}
    </div>
  );
}

/* Front pass: 3D tilt and a light sheen that follows the cursor */
function FrontPass({ pass, index }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 160, damping: 18 });
  const sx = useTransform(mx, (v) => `${v * 100}%`);
  const sy = useTransform(my, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sx} ${sy}, rgba(255,255,255,0.18), transparent 55%)`;

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ position: 'absolute', inset: 0, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
    >
      <PassShell pass={pass}>
        <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: sheen, pointerEvents: 'none' }} />
        <PassFace pass={pass} index={index} />
      </PassShell>
    </motion.div>
  );
}

/* Arrow icons (circle outline style). They use currentColor, so they follow the theme. */
function CircleChevronRight({ size = 50 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22" />
      <polyline points="21,15 30,24 21,33" />
    </svg>
  );
}

function CircleChevronLeft({ size = 50 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22" />
      <polyline points="27,15 18,24 27,33" />
    </svg>
  );
}

/* ---------- Section ---------- */
export default function Education() {
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  const isMobile = useIsMobile();
  const isDark = useIsDark();
  const t = getTheme(isDark);
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [hovering, setHovering] = useState(false);
  const inView = useInView(stackRef, { amount: 0.5 });
  const auto = inView && !manual && !hovering;

  // Gently cycle through the passes until the visitor takes over
  useEffect(() => {
    if (isMobile || !auto) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % PASSES.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [isMobile, auto, active]);

  // Mobile: editorial timeline + swipeable achievement deck
  if (isMobile) {
    return <MobileEducation education={education} achievements={achievements} isDark={isDark} sectionRef={sectionRef} />;
  }

  const n = PASSES.length;
  const depthOf = (i) => (i - active + n) % n; // 0 = front
  const pick = (i) => {
    setManual(true);
    setActive(i);
  };

  return (
    <section
      id="education"
      ref={sectionRef}
      style={{ padding: '9vw 6vw 9vw', backgroundColor: t.bg, borderTop: `1px solid ${t.sectionBorder}` }}
    >
      <SectionLabel
        index="05"
        title="Education"
        color={t.text}
        accent={GOLD}
        aside={`${String(education.length).padStart(2, '0')} DEGREES · ${String(achievements.length).padStart(2, '0')} AWARDS`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 0.85fr) 1.15fr', gap: '6vw', alignItems: 'center' }}>
        {/* Left: heading + index */}
        <div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
              transition={{ duration: 1, ease: EASE }}
              style={{
                fontSize: 'clamp(3rem, 6.2vw, 6rem)',
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
              Credentials<span style={{ color: GOLD }}>.</span>
            </motion.h2>
          </motion.div>
          <p style={{ margin: '1.25rem 0 2.5rem', fontSize: '1.02rem', lineHeight: 1.65, color: t.muted, maxWidth: '38ch' }}>
            A Computer Science degree with honors, backed by recognition earned on real projects.
          </p>

          <div role="tablist" aria-label="Credentials" style={{ borderTop: `1px solid ${t.line}` }}>
            {PASSES.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.title}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(i)}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '2.4rem 1fr auto',
                    alignItems: 'center',
                    padding: '1rem 0.9rem',
                    border: 'none',
                    borderBottom: `1px solid ${t.line}`,
                    background: on ? t.rowOn : 'transparent',
                    transition: 'background-color 0.35s',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'inherit',
                    font: 'inherit',
                    overflow: 'hidden',
                  }}
                >
                  <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: on ? GOLD : t.muted }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', color: on ? t.text : t.muted, transition: 'color 0.35s' }}>
                    {p.title}
                  </span>
                  <span className="mono" style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: on ? GOLD : t.muted }}>
                    {p.kind === 'degree' ? p.year : 'AWARD'}
                  </span>
                  {/* Auto-play progress */}
                  {on && auto && (
                    <motion.span
                      key={`prog-${active}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, backgroundColor: GOLD, transformOrigin: 'left' }}
                    />
                  )}
                  {on && !auto && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: GOLD }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: the wallet stack */}
        <div
          ref={stackRef}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{ position: 'relative', height: 'clamp(430px, 34vw, 480px)', paddingTop: 96, boxSizing: 'border-box' }}
        >
          <div style={{ position: 'relative', height: '100%' }}>
            {PASSES.map((p, i) => {
              const d = depthOf(i);
              const visible = d < 4;
              return (
                <motion.div
                  key={p.title}
                  onClick={() => d !== 0 && pick(i)}
                  initial={false}
                  animate={{
                    y: -d * 30,
                    scale: 1 - d * 0.055,
                    opacity: visible ? 1 - d * 0.18 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: n - d,
                    cursor: d === 0 ? 'default' : 'pointer',
                    pointerEvents: visible ? 'auto' : 'none',
                    transformOrigin: 'center top',
                  }}
                >
                  {d === 0 ? (
                    <FrontPass pass={p} index={i} />
                  ) : (
                    <PassShell pass={p}>
                      <PassFace pass={p} index={i} />
                    </PassShell>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Prev / next */}
          <div style={{ position: 'absolute', right: 0, bottom: -70, display: 'flex', gap: 10 }}>
            {[
              { Icon: CircleChevronLeft, f: () => pick((active - 1 + n) % n), a: 'Previous credential' },
              { Icon: CircleChevronRight, f: () => pick((active + 1) % n), a: 'Next credential' },
            ].map(({ Icon, f, a }) => (
              <motion.button
                key={a}
                type="button"
                aria-label={a}
                onClick={f}
                initial={false}
                whileHover={{ scale: 1.08, color: GOLD }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{
                  width: 50,
                  height: 50,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  color: t.text,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}