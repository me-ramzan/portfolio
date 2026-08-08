import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';
import spotlightImg from '../assets/images/spotlight.jpg';
import profileImg from '../assets/images/ramzan.png';
import bgVideo from '../assets/videos/bg-video.mp4';




const HERO_IMAGE = spotlightImg;


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
  const isMobile = useIsMobile();


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
  setMousePos({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  });
};


useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 1.5; 
  }
}, []);



  const [textIndex, setTextIndex] = useState(0);
  const taglines = [
    'Building intelligent systems at the intersection of AI Automation, and full-stack engineering.',
    'Transforming Complex Ideas into Intelligent AI Solutions.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % taglines.length);
    }, 4000); // har 4 seconds baad switch hoga
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
        overflow: 'hidden',
      }}
    >

      {/* Background video */}
      <video
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
        }}
      >
      <source src={bgVideo} type="video/mp4" />
      </video>





      {/* Background architectural image */}
      {/* <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
    filter: 'brightness(0.6)',
    pointerEvents: 'none',
        }}
      /> */}


      {/* Grid lines decoration */}
      {/* <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[20, 40, 60, 80].map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${pos}%`,
            width: '1px',
            backgroundColor: '#d8d6ca',
            opacity: 0.4,
          }} />
        ))}
      </div> */}

      {/* Live status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
       style={
  isMobile
    ? {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px',
        marginBottom: '1.5rem',
        width: '100%',
      }
    : {
        position: 'absolute',
        top: '90px',
        right: '6vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px',
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.25, duration: 0.6 }}
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
      }
}
      >
        <img
          src={profileImg}
          alt="Muhammad Ramzan"
          width="280"
          height="280"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </motion.div>


      {/* Main hero content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: 0, duration: 0.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <span className="mono" style={{ color: '#000000', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
            AI AUTOMATION & SOFTWARE ENGINEER
          </span>
        </motion.div>

        {/* Hero name — slides up in sync with preloader exit */}
        <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ delay: 3.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} //for speed of the name
          style={{ position: 'relative' }}
        >
          {/* Outlined version */}
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

          {/* Solid version revealed by circle mask — desktop only */}
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
            animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            exit: { opacity: 0, y: 24, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}
        >
          {[
            { icon: <MapPin size={12} />, text: 'Dubai, UAE' },
            { icon: <Mail size={12} />, text: 'me.ramzan.zulfiqar@gmail.com' },
            { icon: <Phone size={12} />, text: '+971 55 499 1245' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                border: '1px solid #343148',
                borderRadius: '4px',
                backgroundColor: 'transparent',
              }}
            >
              <span style={{ color: '#000000' }}>{item.icon}</span>
              <span className="mono" style={{ fontSize: '0.7rem', color: '#080808' }}>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          
          style={{ 
            marginTop: '1.5rem', 
            marginBottom: isMobile ? '2.5rem' : 0,
            display: 'flex', 
            gap: isMobile ? '10px' : '16px', 
            flexWrap: 'wrap' 
          }}
        >
          <a
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
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#000000'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#343148'}
          >
            VIEW WORK
          </a>
          <a
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
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#343148'; e.currentTarget.style.color = '#F4F1EA'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#020203'; }}
          >
            GET IN TOUCH
          </a>
        </motion.div>
      </div>

    
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