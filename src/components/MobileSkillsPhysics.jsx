import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Matter from 'matter-js';

const { Engine, Bodies, Body, Composite, Constraint } = Matter;

const EASE = [0.16, 1, 0.3, 1];
const PALETTE = ['#D7C49E', '#a596e0', '#7fc4a8', '#ee9a7e', '#7fb0e6', '#d39bd0'];
const BOX_BG = '#16131f';
const PILL_BG = '#2a2640';
const PILL_TEXT = '#F4F1EA';
const WALL = 400; // wall thickness — thick so fast flings can't tunnel through
const MAX_SPEED = 32;

const LANGUAGES = [
  { lang: 'English', level: 'Fluent' },
  { lang: 'Hindi', level: 'Fluent' },
  { lang: 'Urdu', level: 'Native' },
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export default function MobileSkillsPhysics({ skillGroups, theme: t, sectionRef }) {
  const items = useMemo(
    () =>
      skillGroups.flatMap((g, gi) =>
        g.skills.map((name) => ({ name, group: gi, color: PALETTE[gi % PALETTE.length] }))
      ),
    [skillGroups]
  );

  const boxRef = useRef(null);
  const pillRefs = useRef([]);
  const engineRef = useRef(null);
  const bodiesRef = useRef([]);
  const dragRef = useRef(null);
  const runningRef = useRef(true);

  const started = useInView(boxRef, { once: true, amount: 0.35 });
  const [focus, setFocus] = useState(null);
  const [tiltOn, setTiltOn] = useState(false);
  const [tiltSupported, setTiltSupported] = useState(false);
  const [grabbed, setGrabbed] = useState(null);

  useEffect(() => {
    setTiltSupported(
      typeof window !== 'undefined' &&
        'DeviceOrientationEvent' in window &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
  }, []);

  /* ---------------- Physics world ---------------- */
  useEffect(() => {
    if (!started) return;
    const box = boxRef.current;
    if (!box) return;

    let W = box.clientWidth;
    let H = box.clientHeight;
    const SPAWN_TOP = -(items.length * 55 + 200);

    const engine = Engine.create();
    engine.gravity.x = 0;
    engine.gravity.y = 1;
    engineRef.current = engine;

    const ground = Bodies.rectangle(W / 2, H + WALL / 2, 5000, WALL, { isStatic: true });
    const sideH = H - SPAWN_TOP + WALL * 2;
    const sideY = (SPAWN_TOP + H) / 2;
    const left = Bodies.rectangle(-WALL / 2, sideY, WALL, sideH, { isStatic: true });
    const right = Bodies.rectangle(W + WALL / 2, sideY, WALL, sideH, { isStatic: true });
    // Ceiling starts far above (so pills can rain in), then closes once they've landed
    const ceiling = Bodies.rectangle(W / 2, SPAWN_TOP - WALL, 5000, WALL, { isStatic: true });
    let closed = false;

    const bodies = items.map((_, i) => {
      const el = pillRefs.current[i];
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = w / 2 + 6 + Math.random() * Math.max(1, W - w - 12);
      const y = -60 - i * 55 - Math.random() * 30;
      const b = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: h / 2 - 0.5 },
        restitution: 0.45,
        friction: 0.08,
        frictionAir: 0.012,
        density: 0.0018,
      });
      Body.setAngle(b, (Math.random() - 0.5) * 0.7);
      b.plugin.w = w;
      b.plugin.h = h;
      el.style.opacity = '1';
      return b;
    });
    bodiesRef.current = bodies;
    Composite.add(engine.world, [ground, left, right, ceiling, ...bodies]);

    // Keep walls glued to the box if it resizes (rotation, address bar, etc.)
    const ro = new ResizeObserver(() => {
      W = box.clientWidth;
      H = box.clientHeight;
      Body.setPosition(ground, { x: W / 2, y: H + WALL / 2 });
      Body.setPosition(right, { x: W + WALL / 2, y: right.position.y });
      if (closed) Body.setPosition(ceiling, { x: W / 2, y: -WALL / 2 });
    });
    ro.observe(box);

    // Pause the simulation when the box is off-screen (saves battery)
    const io = new IntersectionObserver(([entry]) => {
      runningRef.current = entry.isIntersecting;
    });
    io.observe(box);

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!runningRef.current) return;
      Engine.update(engine, 1000 / 60);

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const v = b.velocity;
        const sp = Math.hypot(v.x, v.y);
        if (sp > MAX_SPEED) Body.setVelocity(b, { x: (v.x * MAX_SPEED) / sp, y: (v.y * MAX_SPEED) / sp });

        // Safety net: anything that escapes gets dropped back in
        if (closed && (b.position.x < -40 || b.position.x > W + 40 || b.position.y > H + 40 || b.position.y < -40)) {
          Body.setPosition(b, { x: W / 2, y: b.plugin.h });
          Body.setVelocity(b, { x: 0, y: 0 });
        }

        const el = pillRefs.current[i];
        if (el) {
          el.style.transform = `translate(${b.position.x - b.plugin.w / 2}px, ${b.position.y - b.plugin.h / 2}px) rotate(${b.angle}rad)`;
        }
      }

      if (!closed && bodies.every((b) => b.position.y - b.plugin.h / 2 > 4)) {
        Body.setPosition(ceiling, { x: W / 2, y: -WALL / 2 });
        closed = true;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      engineRef.current = null;
      bodiesRef.current = [];
      dragRef.current = null;
    };
  }, [started, items]);

  /* ---------------- Tilt (device orientation) ---------------- */
  useEffect(() => {
    if (!tiltOn) {
      if (engineRef.current) {
        engineRef.current.gravity.x = 0;
        engineRef.current.gravity.y = 1;
      }
      return;
    }
    const onTilt = (e) => {
      const eng = engineRef.current;
      if (!eng || e.gamma == null || e.beta == null) return;
      eng.gravity.x = clamp(e.gamma / 35, -1, 1);
      eng.gravity.y = clamp(e.beta / 45, -1, 1);
    };
    window.addEventListener('deviceorientation', onTilt);
    return () => window.removeEventListener('deviceorientation', onTilt);
  }, [tiltOn]);

  const toggleTilt = async () => {
    if (tiltOn) return setTiltOn(false);
    try {
      // iOS 13+ needs explicit permission, triggered by a tap
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== 'granted') return;
      }
      setTiltOn(true);
    } catch {
      /* permission denied or unsupported */
    }
  };

  /* ---------------- Interactions ---------------- */
  const shake = () => {
    bodiesRef.current.forEach((b) => {
      Body.setVelocity(b, { x: (Math.random() - 0.5) * 20, y: -(9 + Math.random() * 14) });
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.4);
    });
    navigator.vibrate?.(30);
  };

  const toggleFocus = (gi) => {
    const next = focus === gi ? null : gi;
    setFocus(next);
    if (next === null) return;
    // Make the chosen group jump up out of the pile
    bodiesRef.current.forEach((b, i) => {
      if (items[i].group === next) {
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 6, y: -(12 + Math.random() * 6) });
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.25);
      }
    });
  };

  const onPillDown = (i, e) => {
    const eng = engineRef.current;
    const b = bodiesRef.current[i];
    if (!eng || !b) return;
    const r = boxRef.current.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    const c = Constraint.create({
      pointA: p,
      bodyB: b,
      pointB: { x: p.x - b.position.x, y: p.y - b.position.y },
      stiffness: 0.25,
      damping: 0.08,
      length: 0,
    });
    Composite.add(eng.world, c);
    dragRef.current = c;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setGrabbed(i);
    navigator.vibrate?.(8);
  };

  const onPillMove = (e) => {
    const c = dragRef.current;
    if (!c) return;
    const r = boxRef.current.getBoundingClientRect();
    c.pointA = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPillUp = () => {
    const c = dragRef.current;
    if (c && engineRef.current) Composite.remove(engineRef.current.world, c);
    dragRef.current = null;
    setGrabbed(null);
  };

  /* ---------------- Render ---------------- */
  const ctrlBtn = (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '9px 14px',
    borderRadius: 999,
    border: `1px solid ${active ? '#D7C49E' : t.border}`,
    backgroundColor: active ? '#D7C49E' : 'transparent',
    color: active ? '#121018' : t.text,
    fontSize: '0.68rem',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    fontWeight: 600,
  });

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '4rem 5vw 3.5rem',
        backgroundColor: t.bg,
        borderTop: `1px solid ${t.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
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
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        style={{ overflow: 'hidden', margin: '1.25rem 0 0.6rem' }}
      >
        <motion.h2
          variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ fontSize: 'clamp(2.2rem, 11vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, margin: 0, color: t.accent }}
        >
          Technical<br />Arsenal
        </motion.h2>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        style={{ fontSize: '0.9rem', color: t.text, opacity: 0.8, margin: '0 0 1.25rem', lineHeight: 1.5 }}
      >
        {items.length} tools across {skillGroups.length} domains. Go ahead — throw them around.
      </motion.p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {tiltSupported && (
          <button type="button" className="mono" onClick={toggleTilt} style={ctrlBtn(tiltOn)}>
            <motion.span
              animate={tiltOn ? { rotate: [0, -18, 18, 0] } : { rotate: 0 }}
              transition={{ duration: 1.6, repeat: tiltOn ? Infinity : 0 }}
              style={{ display: 'inline-block' }}
            >
              📱
            </motion.span>
            {tiltOn ? 'TILT ON' : 'TILT YOUR PHONE'}
          </button>
        )}
        <button type="button" className="mono" onClick={shake} style={ctrlBtn(false)}>
          ✦ SHAKE
        </button>
      </div>

      {/* Physics box */}
      <motion.div
        ref={boxRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{
          position: 'relative',
          height: 460,
          borderRadius: 22,
          overflow: 'hidden',
          backgroundColor: BOX_BG,
          backgroundImage: 'radial-gradient(rgba(244,241,234,0.08) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          border: '1px solid rgba(244,241,234,0.08)',
          boxShadow: `inset 0 -40px 60px rgba(0,0,0,0.35), ${t.shadow}`,
        }}
      >
        {/* Watermark */}
        <div
          aria-hidden
          className="mono"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            color: 'rgba(244,241,234,0.07)',
            fontSize: '2.6rem',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '0.05em',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          DRAG
          <br />
          FLING
          <br />
          TILT
        </div>

        {items.map((it, i) => {
          const on = focus === it.group;
          const dim = focus !== null && !on;
          return (
            <div
              key={it.name}
              ref={(el) => (pillRefs.current[i] = el)}
              className="mono"
              onPointerDown={(e) => onPillDown(i, e)}
              onPointerMove={onPillMove}
              onPointerUp={onPillUp}
              onPointerCancel={onPillUp}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: 'translate(-9999px, -9999px)',
                opacity: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '10px 15px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                backgroundColor: on ? it.color : PILL_BG,
                color: on ? '#121018' : PILL_TEXT,
                border: `1px solid ${on ? it.color : 'rgba(244,241,234,0.12)'}`,
                boxShadow: grabbed === i ? `0 12px 28px rgba(0,0,0,0.5), 0 0 0 2px ${it.color}` : '0 4px 10px rgba(0,0,0,0.3)',
                filter: dim ? 'saturate(0.4) brightness(0.6)' : 'none',
                transition: 'background-color 0.3s, color 0.3s, filter 0.3s, box-shadow 0.2s, border-color 0.3s',
                cursor: grabbed === i ? 'grabbing' : 'grab',
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                willChange: 'transform',
                zIndex: grabbed === i ? 5 : 1,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: on ? '#121018' : it.color, flexShrink: 0 }} />
              {it.name}
            </div>
          );
        })}
      </motion.div>

      {/* Group legend — tap to make that group jump */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
        {skillGroups.map((g, gi) => {
          const color = PALETTE[gi % PALETTE.length];
          const on = focus === gi;
          return (
            <motion.button
              key={g.category}
              type="button"
              className="mono"
              onClick={() => toggleFocus(gi)}
              whileTap={{ scale: 0.93 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                borderRadius: 999,
                border: `1px solid ${on ? color : t.border}`,
                backgroundColor: on ? BOX_BG : 'transparent',
                color: on ? PILL_TEXT : t.text,
                fontSize: '0.6rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
              {g.category}
            </motion.button>
          );
        })}
      </div>
      <p className="mono" style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: t.text, opacity: 0.55, marginTop: 10 }}>
        TAP A GROUP TO MAKE IT JUMP
      </p>

      {/* Languages */}
      <div style={{ marginTop: '2.25rem', paddingTop: '1.5rem', borderTop: `1px solid ${t.border}` }}>
        <span className="mono" style={{ color: t.accent, fontSize: '0.65rem', letterSpacing: '0.15em', display: 'block', marginBottom: 12 }}>
          LANGUAGES
        </span>
        <div style={{ display: 'flex', gap: '0.75rem 1.5rem', flexWrap: 'wrap' }}>
          {LANGUAGES.map((l, i) => (
            <motion.div
              key={l.lang}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: t.text }}>{l.lang}</span>
              <span className="mono" style={{ fontSize: '0.6rem', color: '#F4F1EA', backgroundColor: t.pillBg, padding: '3px 8px', borderRadius: 4 }}>
                {l.level}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}