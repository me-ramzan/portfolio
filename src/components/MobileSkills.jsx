import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];
const SLUGS = ['code', 'rpa', 'ai-ml', 'web-api', 'data-cloud', 'platforms'];
const AUTO_MS = 3600;
const SCRAMBLE = '!<>-_\\/[]{}—=+*^?#';

const LANGUAGES = [
  { lang: 'English', level: 'Fluent' },
  { lang: 'Hindi', level: 'Fluent' },
  { lang: 'Urdu', level: 'Native' },
];

const TERM = {
  bg: '#0d0b12',
  bar: '#1a1724',
  text: '#F4F1EA',
  muted: 'rgba(244,241,234,0.45)',
  prompt: '#D7C49E',
  green: '#3ddc84',
  line: 'rgba(244,241,234,0.08)',
};

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/* ------------------------------------------------------------------ */
/* Scroll-velocity marquee "tape"                                      */
/* ------------------------------------------------------------------ */
function TapeRow({ items, baseVelocity, rotate, bg, color }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  const row = [...items, ...items];

  return (
    <div
      style={{
        width: '130%',
        marginLeft: '-15%',
        overflow: 'hidden',
        backgroundColor: bg,
        transform: `rotate(${rotate}deg)`,
        padding: '11px 0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      }}
    >
      <motion.div style={{ x, display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
        {row.map((s, i) => (
          <span
            key={i}
            className="mono"
            style={{
              color,
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              paddingRight: 14,
            }}
          >
            {s}
            <span style={{ opacity: 0.6 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scramble/decrypt heading                                            */
/* ------------------------------------------------------------------ */
function ScrambleHeading({ text, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 26;
    const id = setInterval(() => {
      frame += 1;
      const p = frame / total;
      setOut(
        text
          .split('')
          .map((c, i) =>
            c === ' ' || c === '\n' || p > i / text.length + 0.15
              ? c
              : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
          )
          .join('')
      );
      if (frame >= total + 6) {
        clearInterval(id);
        setOut(text);
      }
    }, 40);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <h2 ref={ref} style={style}>
      {out.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ))}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive terminal                                                */
/* ------------------------------------------------------------------ */
function SkillTerminal({ skillGroups, t }) {
  const n = skillGroups.length;
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(0);
  const [auto, setAuto] = useState(true);

  const termRef = useRef(null);
  const chipsRef = useRef(null);
  const chipRefs = useRef([]);
  const inView = useInView(termRef, { amount: 0.4 });

  const slug = SLUGS[active] ?? `group-${active}`;
  const cmd = `cat ${slug}.txt`;
  const done = typed >= cmd.length;
  const group = skillGroups[active];

  // Type the command one character at a time
  useEffect(() => {
    if (!inView || done) return;
    const id = setTimeout(() => setTyped((c) => c + 1), typed === 0 ? 280 : 38);
    return () => clearTimeout(id);
  }, [inView, typed, done]);

  // Auto-cycle through categories until the user taps one
  useEffect(() => {
    if (!auto || !done || !inView) return;
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % n);
      setTyped(0);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [auto, done, inView, n]);

  // Keep the active chip centred in its scroll row (horizontal only)
  useEffect(() => {
    const row = chipsRef.current;
    const chip = chipRefs.current[active];
    if (!row || !chip) return;
    row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' });
  }, [active]);

  const select = (i) => {
    setAuto(false);
    if (i === active) return;
    setActive(i);
    setTyped(0);
  };

  return (
    <div>
      {/* Command chips */}
      <div
        ref={chipsRef}
        className="ms-chips"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: 4,
          marginBottom: 14,
        }}
      >
        {skillGroups.map((g, i) => {
          const on = i === active;
          return (
            <button
              key={g.category}
              ref={(el) => (chipRefs.current[i] = el)}
              type="button"
              onClick={() => select(i)}
              className="mono"
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: 999,
                border: `1px solid ${on ? t.pillBg : t.border}`,
                backgroundColor: on ? t.pillBg : 'transparent',
                color: on ? '#F4F1EA' : t.text,
                fontSize: '0.7rem',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
              }}
            >
              <span style={{ opacity: 0.6, marginRight: 4 }}>{g.icon}</span>
              ./{SLUGS[i] ?? `group-${i}`}
            </button>
          );
        })}
      </div>

      {/* Terminal window */}
      <motion.div
        ref={termRef}
        initial={{ opacity: 0, y: 40, rotateX: -18 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{
          backgroundColor: TERM.bg,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: t.shadow,
          border: `1px solid ${TERM.line}`,
          transformPerspective: 900,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '11px 14px',
            backgroundColor: TERM.bar,
            borderBottom: `1px solid ${TERM.line}`,
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
          ))}
          <span className="mono" style={{ marginLeft: 8, fontSize: '0.62rem', color: TERM.muted, letterSpacing: '0.04em' }}>
            usman@portfolio: ~/skills
          </span>
          <span
            className="mono"
            style={{
              marginLeft: 'auto',
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              color: auto ? TERM.green : TERM.muted,
            }}
          >
            {auto ? '● AUTO' : '○ MANUAL'}
          </span>
        </div>

        {/* Auto-cycle progress */}
        <div style={{ height: 2, backgroundColor: TERM.line }}>
          {auto && done && inView && (
            <motion.div
              key={active}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
              style={{ height: '100%', backgroundColor: TERM.prompt, transformOrigin: 'left' }}
            />
          )}
        </div>

        {/* Body */}
        <div className="mono" style={{ padding: '1.1rem 1.1rem 1.3rem', minHeight: 290, fontSize: '0.78rem', lineHeight: 1.7 }}>
          <div style={{ color: TERM.text, wordBreak: 'break-all' }}>
            <span style={{ color: TERM.green }}>➜</span>{' '}
            <span style={{ color: TERM.prompt }}>~/skills</span>{' '}
            {cmd.slice(0, typed)}
            {!done && <Cursor />}
          </div>

          <AnimatePresence mode="wait">
            {done && (
              <motion.div
                key={active}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              >
                <motion.div
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  style={{ color: TERM.muted, margin: '10px 0 8px' }}
                >
                  # {group.category}
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 12, rowGap: 4 }}>
                  {group.skills.map((s) => (
                    <motion.div
                      key={s}
                      variants={{
                        hidden: { opacity: 0, x: -10, filter: 'blur(3px)' },
                        show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: EASE } },
                      }}
                      style={{ color: TERM.text, display: 'flex', gap: 6 }}
                    >
                      <span style={{ color: TERM.prompt }}>▸</span>
                      {s}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                  style={{ color: TERM.green, marginTop: 14 }}
                >
                  ✓ {group.skills.length} tools loaded
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  style={{ color: TERM.text, marginTop: 6 }}
                >
                  <span style={{ color: TERM.green }}>➜</span>{' '}
                  <span style={{ color: TERM.prompt }}>~/skills</span> <Cursor />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <p className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: t.text, opacity: 0.6, marginTop: 10, textAlign: 'center' }}>
        TAP A COMMAND TO RUN IT
      </p>
    </div>
  );
}

function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      style={{
        display: 'inline-block',
        width: '0.55em',
        height: '1.05em',
        backgroundColor: TERM.prompt,
        verticalAlign: 'text-bottom',
        marginLeft: 2,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function MobileSkills({ skillGroups, theme: t, sectionRef }) {
  const allSkills = skillGroups.flatMap((g) => g.skills);
  const half = Math.ceil(allSkills.length / 2);
  const rowA = allSkills.slice(0, half);
  const rowB = allSkills.slice(half);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '4rem 0 3.5rem',
        backgroundColor: t.bg,
        borderTop: `1px solid ${t.border}`,
        overflow: 'hidden',
      }}
    >
      <style>{`.ms-chips::-webkit-scrollbar{display:none}`}</style>

      {/* Header */}
      <div style={{ padding: '0 5vw' }}>
        <motion.span
          className="mono"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ color: t.text, fontSize: '0.7rem', letterSpacing: '0.15em', display: 'inline-block' }}
        >
          04 / SKILLS
        </motion.span>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{ width: 32, height: 2, backgroundColor: t.accent, marginTop: 12, transformOrigin: 'left' }}
        />
        <ScrambleHeading
          text={'Technical\nArsenal'}
          style={{
            fontSize: 'clamp(2.4rem, 12vw, 3.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            margin: '1.25rem 0 0.9rem',
            color: t.accent,
          }}
        />
        <motion.div
          className="mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: 18, fontSize: '0.65rem', letterSpacing: '0.12em', color: t.text }}
        >
          <span><strong style={{ fontSize: '1rem' }}>{String(skillGroups.length).padStart(2, '0')}</strong> DOMAINS</span>
          <span><strong style={{ fontSize: '1rem' }}>{allSkills.length}</strong> TOOLS</span>
          <span><strong style={{ fontSize: '1rem' }}>{String(LANGUAGES.length).padStart(2, '0')}</strong> LANGUAGES</span>
        </motion.div>
      </div>

      {/* Crossing tapes — speed up with scroll velocity */}
      <div style={{ position: 'relative', margin: '2.75rem 0 3rem', height: 110 }}>
        <div style={{ position: 'absolute', top: 18, left: 0, right: 0, zIndex: 1 }}>
          <TapeRow items={rowB} baseVelocity={2.2} rotate={3} bg={t.text} color={t.bg} />
        </div>
        <div style={{ position: 'absolute', top: 40, left: 0, right: 0, zIndex: 2 }}>
          <TapeRow items={rowA} baseVelocity={-2.6} rotate={-4} bg={t.pillBg} color="#F4F1EA" />
        </div>
      </div>

      {/* Terminal */}
      <div style={{ padding: '0 5vw' }}>
        <SkillTerminal skillGroups={skillGroups} t={t} />
      </div>

      {/* Spoken languages */}
      <div style={{ padding: '0 5vw', marginTop: '2.5rem' }}>
        <span className="mono" style={{ color: t.accent, fontSize: '0.7rem', letterSpacing: '0.15em', display: 'block', marginBottom: 12 }}>
          LANGUAGES
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {LANGUAGES.map((l, i) => (
            <motion.div
              key={l.lang}
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
              style={{
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                padding: '14px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: t.text }}>{l.lang}</div>
              <div
                className="mono"
                style={{
                  display: 'inline-block',
                  marginTop: 8,
                  fontSize: '0.6rem',
                  color: '#F4F1EA',
                  backgroundColor: t.pillBg,
                  padding: '3px 8px',
                  borderRadius: 4,
                  letterSpacing: '0.06em',
                }}
              >
                {l.level}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}