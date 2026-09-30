import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';
import spotlightImg from '../assets/images/spotlight.jpg';
import profileImg from '../assets/images/ramzan.png';
import bgVideo from '../assets/videos/bg-video.mp4';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = spotlightImg;
const EASE = [0.16, 1, 0.3, 1];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

export default function Hero({ isLoading }) {
  const ready = true;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState('');
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const profileRef = useRef(null);
  const statusRef = useRef(null);
  const ctaRefs = useRef([]);
  const chipRefs = useRef([]);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const profileFloatY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -30]), { stiffness: 100, damping: 24, mass: 0.6 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  }, []);

  useEffect(() => {
    // No pinning on phones: the hero is taller than the screen there
    if (isMobile) return;

    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    });
    return () => trigger.kill();
  }, [isMobile]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      if (statusRef.current) {
        gsap.fromTo(
          statusRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)' }
        );
      }

      gsap.fromTo(
        chipRefs.current,
        { opacity: 0, y: 16, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, delay: 3.6, ease: 'back.out(1.7)' }
      );

      gsap.fromTo(
        ctaRefs.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 3.9, ease: 'power3.out' }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const [textIndex, setTextIndex] = useState(0);
  const taglines = [
    'Building intelligent systems at the intersection of AI Automation, and full-stack engineering.',
    'Transforming Complex Ideas into Intelligent AI Solutions.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        backgroundColor: '#D7C49E',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '0 5vw' : '0 6vw',
        paddingTop: isMobile ? '100px' : '64px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Background video with scroll-linked zoom */}
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

      {/* Live status */}
      <div
        ref={statusRef}
        style={
          isMobile
            ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px',
                marginBottom: '1.5rem',
                width: '100%',
                opacity: 0,
              }
            : {
                position: 'absolute',
                top: '90px',
                right: '6vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px',
                opacity: 0,
              }
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#00C851',
            animation: 'pulse 2s infinite',
          }} />
          <span className="mono" style={{ color: '#080808', fontSize: '0.9rem' }}>AVAILABLE FOR WORK</span>
        </div>
        <span className="mono" style={{ color: '#343148', fontSize: '0.7rem' }}>Dubai, UAE</span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
        style={
          isMobile
            ? {
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #343148',
                backgroundColor: '#343148',
                marginBottom: '1.5rem',
                y: profileFloatY,
              }
            : {
                position: 'absolute',
                top: '155px',
                right: '6vw',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #343148',
                backgroundColor: '#343148',
                y: profileFloatY,
              }
        }
      >
        <img
          src={profileImg}
          alt="Muhammad Ramzan"
          width="280"
          height="280"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Main hero content */}
      <motion.div style={{ position: 'relative', zIndex: 2, y: contentY, opacity: isMobile ? 1 : contentOpacity }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: 0, duration: 0.5, ease: EASE }}
          style={{ marginBottom: '2rem' }}
        >
          <span className="mono" style={{ color: '#000000', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
            AI AUTOMATION & SOFTWARE ENGINEER
          </span>
        </motion.div>

        <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 3.15, duration: 0.8, ease: EASE }}
            style={{ position: 'relative' }}
          >
            <h1
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 10rem)',
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                WebkitTextStroke: '1.5px #0a0a0a',
                color: 'transparent',
                fontFamily: "'Space Grotesk', sans-serif",
                userSelect: 'none',
                margin: 0,
              }}
            >
              MUHAMMAD<br />RAMZAN
            </h1>

            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                WebkitMaskImage: isMobile ? 'none' : `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                maskImage: isMobile ? 'none' : `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                opacity: isMobile ? 0 : 1,
              }}
            >
              <h1
                style={{
                  fontSize: 'clamp(3.5rem, 10vw, 10rem)',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                  color: '#121018',
                  fontFamily: "'Space Grotesk', sans-serif",
                  userSelect: 'none',
                  margin: 0,
                }}
              >
                MUHAMMAD<br />RAMZAN
              </h1>
            </div>
          </motion.div>
        </div>

        <div style={{ maxWidth: '600px', marginBottom: '2.5rem', minHeight: '5.4rem', display: 'flex', alignItems: 'flex-start' }}>
          <AnimatePresence mode="wait">
            {ready && (
              <motion.p
                key={textIndex}
                variants={{
                  animate: { transition: { staggerChildren: 0.04 } },
                  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                  color: '#000000',
                  lineHeight: 1.6,
                  margin: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.4em',
                }}
              >
                {taglines[textIndex].split(' ').map((word, i) => (
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
            )}
          </AnimatePresence>
        </div>

        {/* Contact chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {[
            { icon: <MapPin size={12} />, text: 'Dubai, UAE' },
            { icon: <Mail size={12} />, text: 'me.ramzan.zulfiqar@gmail.com' },
            { icon: <Phone size={12} />, text: '+971 55 499 1245' },
          ].map((item, i) => (
            <div
              key={i}
              ref={(el) => (chipRefs.current[i] = el)}
              onMouseEnter={(e) => !isMobile && gsap.to(e.currentTarget, { y: -3, borderColor: '#000000', duration: 0.25 })}
              onMouseLeave={(e) => !isMobile && gsap.to(e.currentTarget, { y: 0, borderColor: '#343148', duration: 0.25 })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                border: '1px solid #343148',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                opacity: 0,
              }}
            >
              <span style={{ color: '#000000' }}>{item.icon}</span>
              <span className="mono" style={{ fontSize: '0.7rem', color: '#080808' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '1.5rem',
            marginBottom: isMobile ? '1.5rem' : 0,
            display: 'flex',
            gap: isMobile ? '10px' : '16px',
            flexWrap: 'wrap',
          }}
        >
          <a
            ref={(el) => (ctaRefs.current[0] = el)}
            href="#projects"
            style={{
              backgroundColor: '#343148',
              color: '#F4F1EA',
              padding: isMobile ? '12px 20px' : '14px 32px',
              borderRadius: '4px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'background 0.2s',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              opacity: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2 }); }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#343148'; gsap.to(e.currentTarget, { scale: 1, duration: 0.2 }); }}
          >
            VIEW WORK
          </a>
          <a
            ref={(el) => (ctaRefs.current[1] = el)}
            href="#contact"
            style={{
              backgroundColor: 'transparent',
              color: '#080808',
              padding: isMobile ? '12px 20px' : '14px 32px',
              borderRadius: '4px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.05em',
              border: '1.5px solid #080808',
              transition: 'all 0.2s',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              opacity: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#343148'; e.currentTarget.style.color = '#F4F1EA'; gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2 }); }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#020203'; gsap.to(e.currentTarget, { scale: 1, duration: 0.2 }); }}
          >
            GET IN TOUCH
          </a>
        </div>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
}