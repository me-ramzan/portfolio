import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 2200; // total loader duration in ms — adjust as needed

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const tick = (now) => {
      const elapsed = now - start;
      const linearT = Math.min(1, elapsed / duration);
      const pct = Math.round(easeOutQuart(linearT) * 100);
      setProgress(pct);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setIsDone(true), 300); // small pause at 100%
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (isDone) {
      // let text swipe + background slide finish before unmounting
      const t = setTimeout(() => onComplete?.(), 1750);
      return () => clearTimeout(t);
    }
  }, [isDone, onComplete]);

  const text = 'LOADING...';

  return (
    <AnimatePresence>
      {(
       <motion.div
            animate={isDone ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1], delay: isDone ? 0.65 : 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* clipping mask so swipe-up looks clean, no float/fade */}
          <div
            style={{
              overflow: 'hidden',
              position: 'relative',
              display: 'inline-flex',
            }}
          >
          <motion.div
            animate={isDone ? { y: '-120%' } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'flex-start',
              willChange: 'transform',
            }}
          >
            <h1
              style={{
                position: 'relative',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: 'clamp(1.1rem, 6vw, 5rem)',
                letterSpacing: '-0.02em',
                margin: 0,
                whiteSpace: 'nowrap',
                color: 'rgba(255,255,255,0.15)',
              }}
            >
              {text}
              {/* white fill clipped by progress % */}
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  whiteSpace: 'nowrap',
                  color: '#ffffff',
                  width: `${progress}%`,
                  overflow: 'hidden',
                  display: 'inline-block',
                  transition: 'width 0.15s linear',
                }}
              >
                {text}
              </span>
            </h1>

            <span
              className="mono"
              style={{
                marginLeft: '0.6em',
                marginTop: '-0.3em',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.6)',
                alignSelf: 'flex-start',
              }}
            >
              {progress}%
            </span>
          </motion.div>
          </div>

          {/* bottom status text */}
          <motion.div
            animate={isDone ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              bottom: '5vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90vw',
              textAlign: 'center',
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 'clamp(0.55rem, 2.2vw, 0.7rem)',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              PLEASE WAIT, CONTENT IS LOADING
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}