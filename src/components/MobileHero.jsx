import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Download } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

/* ---- Your details (edit here) ---- */
const ROLE = 'AI Automation & Software Engineer';
const FIRST = 'Muhammad';
const LAST = 'Ramzan';
const CITY = 'Dubai, UAE';
const TIMEZONE = 'Asia/Dubai';
const RESUME_URL = '/resume.pdf';
const RESUME_FILENAME = 'Muhammad-Ramzan-Resume.pdf';

function useDubaiTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TIMEZONE }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function MobileHero({ t, heroRef, photoRef, coverRef, profileImg, bgVideo, taglines, startDelay = 3.1 }) {
  const time = useDubaiTime();
  const D = startDelay;
  const isLight = t.text === '#080808';

  // Card colours: card uses the profile background, name contrasts with it
  const cardBg = t.profileBg;
  const nameColor = isLight ? '#D7C49E' : '#121018';
  const muted = isLight ? 'rgba(8,8,8,0.6)' : 'rgba(244,241,234,0.6)';

  /* Tagline rotation — first one waits for the preloader */
  const [tag, setTag] = useState(0);
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    let id;
    const start = setTimeout(() => {
      setBooted(true);
      id = setInterval(() => setTag((i) => (i + 1) % taglines.length), 4500);
    }, (D + 0.6) * 1000 + 3500);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [taglines.length, D]);

  /* Scroll: name lines drift apart, portrait zooms */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const line1X = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const line2X = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  // NOTE: the portrait no longer zooms and the video no longer scales on scroll.
  // The portrait is the take-off point for the fly-to-navbar: scaling it moves
  // its rect every frame, so the flying copy chases a moving target (= jerk).
  // Scaling a filtered, full-screen video each frame also drops frames on phones.

  /* Pause the background video once the hero is off screen (saves decode/paint while scrolling) */
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    const hero = heroRef?.current;
    if (!v || !hero) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play?.().catch(() => {});
      else v.pause?.();
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroRef]);

  const nameStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    // capped so big phones, small tablets and landscape don't blow the name up
    fontSize: 'min(20vw, 128px)',
    lineHeight: 0.82,
    letterSpacing: '-0.05em',
    color: nameColor,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  return (
    <section
      id="top"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        // content stays phone-width (max 640px) and centred on wider screens
        padding: 'max(88px, calc(env(safe-area-inset-top) + 76px)) max(5vw, calc((100vw - 640px) / 2)) max(2rem, env(safe-area-inset-bottom))',
        backgroundColor: t.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1,
        boxSizing: 'border-box',
      }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // brightness(0.6) at 0.12 opacity ≈ plain 0.08 opacity — no per-frame filter
          opacity: 0.08,
          pointerEvents: 'none',
          transform: 'translateZ(0)',
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Status row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D - 0.2, duration: 0.6, ease: EASE }}
          className="mono"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.62rem', letterSpacing: '0.14em', color: t.text, marginBottom: 14 }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ position: 'relative', width: 8, height: 8 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: '#02b84b' }} />
              <motion.span
                animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: '#02b84b' }}
              />
            </span>
            AVAILABLE FOR WORK
          </span>
          {/* <span style={{ color: muted }}>DXB {time}</span> */}
        </motion.div>

        {/* Cover card */}
        <motion.div
          ref={coverRef}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: D - 0.1, duration: 1, ease: EASE }}
          style={{
            position: 'relative',
            height: 'min(62svh, 520px)',
            minHeight: 'min(400px, 82svh)',
            borderRadius: 28,
            overflow: 'hidden',
            backgroundColor: cardBg,
            boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
          }}
        >
          {/* Giant name — behind the portrait */}
          <div style={{ position: 'absolute', top: '6%', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ overflow: 'hidden', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ delay: D + 0.15, duration: 1, ease: EASE }}
                style={{ ...nameStyle, x: line1X, fontSize: 'min(16vw, 102px)', willChange: 'transform' }}
              >
                {FIRST.toUpperCase()}
              </motion.div>
            </div>
            <div style={{ overflow: 'hidden', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ delay: D + 0.25, duration: 1, ease: EASE }}
                style={{ ...nameStyle, x: line2X, willChange: 'transform' }}
              >
                {LAST.toUpperCase()}
              </motion.div>
            </div>
          </div>

          {/* Portrait — in front of the name (also the take-off point for the fly-to-navbar) */}
          <motion.img
            ref={photoRef}
            src={profileImg}
            fetchPriority="high"
            loading="eager"
            alt={`${FIRST} ${LAST}`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.35, duration: 1.1, ease: EASE }}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              x: '-50%',
              height: '78%',
              width: 'auto',
              maxWidth: '110%',
              objectFit: 'contain',
              objectPosition: 'bottom',
              transformOrigin: 'bottom center',
              // static now, so the shadow is drawn once and cached on its own layer
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.35))',
              willChange: 'transform',
            }}
          />

          {/* Bottom fade for legibility */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '32%',
              background: `linear-gradient(180deg, transparent, ${cardBg}e6)`,
              pointerEvents: 'none',
            }}
          />

          {/* Location pill */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.8, duration: 0.6, ease: EASE }}
            className="mono"
            style={{
              position: 'absolute',
              left: 14,
              bottom: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 11px',
              borderRadius: 999,
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              backgroundColor: 'rgba(255,255,255,0.14)',
              color: isLight ? '#F4F1EA' : '#121018',
              border: `1px solid ${isLight ? 'rgba(244,241,234,0.25)' : 'rgba(18,16,24,0.25)'}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <MapPin size={11} /> {CITY.toUpperCase()}
          </motion.span>

          {/* Year mark */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: D + 0.9, duration: 0.6 }}
            className="mono"
            style={{
              position: 'absolute',
              right: 16,
              bottom: 18,
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              color: isLight ? 'rgba(244,241,234,0.75)' : 'rgba(18,16,24,0.7)',
            }}
          >
            {/* PORTFOLIO ©{new Date().getFullYear()} */}
          </motion.span>
        </motion.div>

        {/* Role */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D + 0.5, duration: 0.6, ease: EASE }}
          className="mono"
          style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: t.strong, textTransform: 'uppercase', marginTop: '1.5rem' }}
        >
          {ROLE}
        </motion.span>

        {/* Tagline — original word-drop animation */}
        <div style={{ minHeight: '4.8em', marginTop: '0.75rem', fontSize: '1.02rem', lineHeight: 1.55 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={tag}
              variants={{
                animate: { transition: { staggerChildren: 0.04, delayChildren: booted ? 0 : D + 0.6 } },
                exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ margin: 0, color: t.strong, display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}
            >
              {taglines[tag].split(' ').map((word, i) => (
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
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D + 0.9, duration: 0.7, ease: EASE }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: '0.75rem' }}
        >
          <motion.a
            href="#projects"
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 52,
              borderRadius: 999,
              backgroundColor: t.btnBg,
              color: t.btnText,
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            View work <ArrowRight size={16} />
          </motion.a>
          <motion.a
            href="#contact"
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 52,
              borderRadius: 999,
              border: `1.5px solid ${t.text}`,
              color: t.text,
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Get in touch
          </motion.a>
          <motion.a
            href={RESUME_URL}
            download={RESUME_FILENAME}
            aria-label="Download resume (PDF)"
            whileTap={{ scale: 0.97 }}
            className="mono"
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 46,
              borderRadius: 999,
              border: `1.5px dashed ${t.chipBorder}`,
              color: t.text,
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textDecoration: 'none',
            }}
          >
            <Download size={15} /> DOWNLOAD RESUME
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}