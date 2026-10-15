import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowRight, ArrowUpRight, ArrowDown } from 'lucide-react';
import profileImg from '../assets/images/ramzan.png';
import bgVideo from '../assets/videos/bg-video.mp4';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MobileHero from './MobileHero';
import { INTRO_DELAY } from './preloader';
import { useIsMobile, useIsDark, EASE } from '../lib/ui';

gsap.registerPlugin(ScrollTrigger);

/* Everything below starts exactly as the preloader curtain lifts
   (shorter on repeat visits — the preloader decides and exports it) */
const D = INTRO_DELAY;

const TAGLINES = [
  'Building intelligent systems at the intersection of AI Automation, and full-stack engineering.',
  'Transforming Complex Ideas into Intelligent AI Solutions.',
];

/* ---- Your details (edit here) ---- */
const ROLE = 'AI Automation & Software Engineer';
const FIRST = 'MUHAMMAD';
const LAST = 'RAMZAN';
const STATS = [
  { value: '~3', unit: 'yrs', label: 'Experience' },
  { value: '04', unit: '', label: 'Companies' },
  { value: 'AI · RPA · Web', unit: '', label: 'Core expertise' },
];
const CONTACTS = [
  { icon: <MapPin size={12} />, text: 'Dubai, UAE', href: 'https://maps.google.com/?q=Dubai,+UAE' },
  { icon: <Mail size={12} />, text: 'me.ramzan.zulfiqar@gmail.com', href: 'mailto:me.ramzan.zulfiqar@gmail.com' },
  { icon: <Phone size={12} />, text: '+971 55 499 1245', href: 'tel:+971554991245' },
];

/* Two-line name; each line slides up out of its own mask */
function NameLines({ style, delay = 0 }) {
  return (
    <>
      {[FIRST, LAST].map((line, i) => (
        <div key={line} style={{ overflow: 'hidden', paddingBottom: '0.04em' }}>
          <motion.div
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ delay: delay + i * 0.12, duration: 1, ease: EASE }}
            style={style}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </>
  );
}

/* Guarantees the desktop hero always fits one screen:
   if the content is ever taller than the space (short window, zoom, late fonts),
   it is scaled down just enough to fit. */
function useFitScale(enabled) {
  const boxRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    if (!enabled) return undefined;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = boxRef.current;
        const inner = innerRef.current;
        if (!box || !inner) return;
        const avail = box.clientHeight;
        const need = Math.max(inner.offsetHeight, inner.scrollHeight); // layout size (ignores the transform)
        const next = need > avail + 1 ? Math.max(0.6, avail / need) : 1;
        setScale((prev) => (Math.abs(prev - next) > 0.004 ? next : prev));
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (boxRef.current) ro.observe(boxRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    const late = setTimeout(measure, 1200);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
      clearTimeout(late);
    };
  }, [enabled]);
  return { boxRef, innerRef, scale };
}

export default function Hero() {
  const heroRef = useRef(null);
  const isMobileForFit = useIsMobile();
  const fit = useFitScale(!isMobileForFit);
  const nameRef = useRef(null);
  const videoRef = useRef(null);
  const isMobile = useIsMobile();
  const isDark = useIsDark();
  const t = isDark
    ? { bg: '#121018', text: '#F4F1EA', strong: '#F4F1EA', stroke: '#F4F1EA', fill: '#F4F1EA', line: '#D7C49E', chipBorder: 'rgba(244,241,234,0.35)', chipHover: '#D7C49E', profileBg: '#D7C49E', btnBg: '#D7C49E', btnText: '#121018', btnHover: '#F4F1EA', muted: 'rgba(244,241,234,0.6)', hair: 'rgba(244,241,234,0.14)' }
    : { bg: '#D7C49E', text: '#080808', strong: '#000000', stroke: '#0a0a0a', fill: '#121018', line: '#343148', chipBorder: 'rgba(8,8,8,0.35)', chipHover: '#000000', profileBg: '#343148', btnBg: '#343148', btnText: '#F4F1EA', btnHover: '#000000', muted: 'rgba(8,8,8,0.6)', hair: 'rgba(8,8,8,0.18)' };

  /* Scroll-linked depth */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const portraitY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -60]), { stiffness: 100, damping: 24, mass: 0.6 });

  /* Mouse: spotlight on the name + gentle 3D tilt on the portrait */
  const [spot, setSpot] = useState({ x: -999, y: -999 });
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e) => {
    if (nameRef.current) {
      const r = nameRef.current.getBoundingClientRect();
      setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    tiltX.set((e.clientY / h - 0.5) * -8);
    tiltY.set((e.clientX / w - 0.5) * 10);
  };
  const handleMouseLeave = () => {
    setSpot({ x: -999, y: -999 });
    tiltX.set(0);
    tiltY.set(0);
  };

  /* Live Dubai time */
  const fmtTime = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }).format(new Date());
  const [time, setTime] = useState(fmtTime);
  useEffect(() => {
    const id = setInterval(() => setTime(fmtTime()), 15000);
    return () => clearInterval(id);
  }, []);

  /* Rotating tagline (original word-drop animation) */
  const [textIndex, setTextIndex] = useState(0);
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    let id;
    const start = setTimeout(() => {
      setBooted(true);
      id = setInterval(() => setTextIndex((p) => (p + 1) % TAGLINES.length), 4500);
    }, (D + 0.5) * 1000 + 3500);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 1.5;
  }, [isMobile]);

  /* Pin (desktop only) */
  useEffect(() => {
    if (isMobile) return;
    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
      pinType: 'fixed',
      invalidateOnRefresh: true,
    });
    return () => trigger.kill(true);
  }, [isMobile]);

  // Stable outer wrapper + keyed inner wrapper: lets React swap desktop <-> mobile
  // safely even though GSAP wraps the pinned desktop section in a pin-spacer.
  if (isMobile) {
    return (
      <div style={{ display: 'contents' }}>
        <div key="hero-mobile" style={{ display: 'contents' }}>
          <MobileHero t={t} heroRef={heroRef} profileImg={profileImg} bgVideo={bgVideo} taglines={TAGLINES} startDelay={D} />
        </div>
      </div>
    );
  }

  const nameStyle = {
    fontSize: 'clamp(3.4rem, min(9.5vw, 16.5vh), 10rem)',
    fontWeight: 700,
    lineHeight: 0.88,
    letterSpacing: '-0.04em',
    fontFamily: "'Space Grotesk', sans-serif",
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7, ease: EASE },
  });

  return (
    <div style={{ display: 'contents' }}>
      <div key="hero-desktop" style={{ display: 'contents' }}>
        <section
          id="top"
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100vh',
            minHeight: 520,
            backgroundColor: t.bg,
            transition: 'background-color 0.3s',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(84px, 11vh, 104px) 6vw clamp(18px, 3.5vh, 36px)',
            boxSizing: 'border-box',
          }}
        >
          {/* Background video */}
          <motion.video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.15,
              filter: 'brightness(0.6)',
              pointerEvents: 'none',
              scale: videoScale,
            }}
          >
            <source src={bgVideo} type="video/mp4" />
          </motion.video>

          <motion.div ref={fit.boxRef} style={{ position: 'relative', zIndex: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', y: contentY, opacity: contentOpacity }}>
          <div
            ref={fit.innerRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100%',
              transform: fit.scale < 1 ? `scale(${fit.scale})` : 'none',
              transformOrigin: 'top center',
            }}
          >
            {/* ── Top bar ── */}
            <motion.div
              {...fadeUp(D - 0.3)}
              className="mono"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', letterSpacing: '0.15em', color: t.strong }}
            >
              <span>{ROLE.toUpperCase()}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-block' }}>
                    {/* Ripple sits behind the dot and fades out fully before it restarts, so the loop is seamless */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        backgroundColor: '#02b84b',
                        animation: 'heroPulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                      }}
                    />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: '#02b84b' }} />
                  </span>
                  AVAILABLE FOR WORK
                </span>
                {/* <span style={{ color: t.muted }}>DXB {time}</span> */}
              </span>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: D - 0.2, duration: 1.2, ease: EASE }}
              style={{ height: 1, backgroundColor: t.hair, marginTop: 18, transformOrigin: 'left' }}
            />

            {/* ── Main ── */}
            <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '4vw', padding: '2.5vh 0 2vh' }}>
              <div style={{ minWidth: 0 }}>
                {/* Name with mouse spotlight */}
                <div ref={nameRef} style={{ position: 'relative', marginBottom: 'clamp(0.9rem, 2.6vh, 1.75rem)' }}>
                  <div style={{ ...nameStyle, color: 'transparent', WebkitTextStroke: `1.5px ${t.stroke}` }}>
                    <NameLines delay={D} style={{}} />
                  </div>
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      WebkitMaskImage: `radial-gradient(circle 140px at ${spot.x}px ${spot.y}px, black 0%, transparent 100%)`,
                      maskImage: `radial-gradient(circle 140px at ${spot.x}px ${spot.y}px, black 0%, transparent 100%)`,
                    }}
                  >
                    <div style={{ ...nameStyle, fontWeight: 800, color: t.fill }}>
                      <NameLines delay={D} style={{}} />
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <div style={{ maxWidth: 620, minHeight: '4.2rem', marginBottom: 'clamp(1rem, 2.8vh, 2rem)' }}>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={textIndex}
                      variants={{
                        animate: { transition: { staggerChildren: 0.04, delayChildren: booted ? 0 : D + 0.5 } },
                        exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                      }}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ fontSize: 'clamp(1rem, 1.4vw, 1.25rem)', color: t.strong, lineHeight: 1.6, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0 0.35em' }}
                    >
                      {TAGLINES[textIndex].split(' ').map((word, i) => (
                        <motion.span
                          key={i}
                          variants={{
                            initial: { opacity: 0, y: -24 },
                            animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                            exit: { opacity: 0, y: 24, transition: { duration: 0.4, ease: EASE } },
                          }}
                          style={{ display: 'inline-block' }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* CTAs */}
                <motion.div {...fadeUp(D + 0.7)} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 'clamp(0.9rem, 2.2vh, 1.5rem)' }}>
                  <motion.a
                    href="#projects"
                    whileHover={{ scale: 1.04, backgroundColor: t.btnHover, color: t.bg }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      height: 'clamp(46px, 6vh, 54px)',
                      padding: '0 28px',
                      borderRadius: 999,
                      backgroundColor: t.btnBg,
                      color: t.btnText,
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    View my work <ArrowRight size={17} />
                  </motion.a>
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.04, backgroundColor: t.btnBg, color: t.btnText, borderColor: t.btnBg }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      height: 'clamp(46px, 6vh, 54px)',
                      padding: '0 28px',
                      borderRadius: 999,
                      border: `1.5px solid ${t.text}`,
                      color: t.text,
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Get in touch <ArrowUpRight size={17} />
                  </motion.a>
                </motion.div>

                {/* Contact chips (clickable) */}
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: D + 0.9 } } }}
                  style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
                >
                  {CONTACTS.map((c) => (
                    <motion.a
                      key={c.text}
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                      whileHover={{ y: -3, borderColor: t.chipHover }}
                      className="mono"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        padding: '8px 14px',
                        borderRadius: 999,
                        border: `1px solid ${t.chipBorder}`,
                        color: t.text,
                        fontSize: '0.7rem',
                        textDecoration: 'none',
                      }}
                    >
                      {c.icon}
                      {c.text}
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              {/* Portrait card */}
              <motion.div style={{ y: portraitY, perspective: 900 }}>
                <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d', position: 'relative' }}>
                  {/* Offset gold frame */}
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, x: 16, y: 16 }}
                    transition={{ delay: D + 0.6, duration: 0.9, ease: EASE }}
                    style={{ position: 'absolute', inset: 0, borderRadius: 28, border: `1px solid ${t.line}` }}
                  />
                  <motion.div
                    initial={{ clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
                    transition={{ delay: D + 0.15, duration: 1.1, ease: EASE }}
                    style={{
                      position: 'relative',
                      width: 'clamp(200px, min(22vw, 40vh), 340px)',
                      aspectRatio: '3 / 4',
                      borderRadius: 28,
                      overflow: 'hidden',
                      backgroundColor: t.profileBg,
                      boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                    }}
                  >
                    <motion.img
                      src={profileImg}
                      alt="Muhammad Ramzan"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: D + 0.15, duration: 1.4, ease: EASE }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                    />
                    <span
                      className="mono"
                      style={{
                        position: 'absolute',
                        left: 14,
                        bottom: 14,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 12px',
                        borderRadius: 999,
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        color: '#F4F1EA',
                        backgroundColor: 'rgba(18,16,24,0.55)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                    >
                      <MapPin size={11} /> DUBAI, UAE
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* ── Bottom bar: proof + scroll cue ── */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: D + 0.8, duration: 1.2, ease: EASE }}
              style={{ height: 1, backgroundColor: t.hair, transformOrigin: 'left' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'clamp(10px, 2vh, 18px)' }}>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: D + 1 } } }}
                style={{ display: 'flex', gap: '3.5rem' }}
              >
                {STATS.map((s) => (
                  <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', color: t.strong }}>
                      {s.value}
                      {s.unit && <span style={{ fontSize: '0.85rem', fontWeight: 500, marginLeft: 3, color: t.muted }}>{s.unit}</span>}
                    </span>
                    <span className="mono" style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.14em', color: t.muted, marginTop: 4, textTransform: 'uppercase' }}>
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.a
                href="#about"
                aria-label="Scroll to explore"
                {...fadeUp(D + 1.3)}
                whileHover="hover"
                className="hero-scroll-badge"
                style={{ position: 'relative', width: 66, height: 66, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: t.strong, textDecoration: 'none', flexShrink: 0 }}
              >
                {/* Rotating circular text */}
                <svg
                  viewBox="0 0 100 100"
                  width="66"
                  height="66"
                  aria-hidden="true"
                  className="hero-scroll-ring"
                  style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
                >
                  <defs>
                    <path id="heroScrollCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, fill: 'currentColor', opacity: 0.8 }}>
                    <textPath href="#heroScrollCircle" textLength="236" lengthAdjust="spacing">SCROLL · TO · EXPLORE · </textPath>
                  </text>
                </svg>
                {/* Centre arrow */}
                <motion.span
                  variants={{ hover: { y: 3 } }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: t.btnBg,
                    color: t.btnText,
                  }}
                >
                  <ArrowDown size={14} />
                </motion.span>
              </motion.a>
            </div>
          </div>
          </motion.div>

          <style>{`
            @keyframes heroPulse {
              0%   { transform: scale(1);   opacity: 0.55; }
              70%  { transform: scale(2.8); opacity: 0; }
              100% { transform: scale(2.8); opacity: 0; }
            }
            @media (prefers-reduced-motion: reduce) {
              [style*="heroPulse"] { animation: none !important; }
            }
            @keyframes heroSpin { to { transform: rotate(360deg); } }
            .hero-scroll-ring { animation: heroSpin 14s linear infinite; transform-origin: 50% 50%; }
            .hero-scroll-badge:hover .hero-scroll-ring { animation-duration: 5s; }
            @media (prefers-reduced-motion: reduce) { .hero-scroll-ring { animation: none; } }
          `}</style>
        </section>
      </div>
    </div>
  );
}