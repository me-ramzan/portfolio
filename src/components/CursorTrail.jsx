import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const cursorQuotes = [
  'AI AUTOMATION',
  'FULL STACK ENGINEER',
  'BUILDING SMART SYSTEMS',
];

export default function CursorTrail() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const idleTimer = useRef(null);
  const wasIdle = useRef(true);
  const [isIdle, setIsIdle] = useState(false);
  const [isSpecialSection, setIsSpecialSection] = useState(false);

  const MAX_LETTERS = Math.max(...cursorQuotes.map(q => q.length));
  const currentQuote = cursorQuotes[quoteIndex];

  const letterMotionValues = useRef(
    Array.from({ length: MAX_LETTERS }, () => ({
      x: useMotionValue(0),
      y: useMotionValue(0),
    }))
  ).current;

const letterSprings = letterMotionValues.map((mv, i) => ({
    x: useSpring(mv.x, { damping: 30 - i * 0.3, stiffness: 500 - i * 6 }),
    y: useSpring(mv.y, { damping: 30 - i * 0.3, stiffness: 500 - i * 6 }),
  }));

  useEffect(() => {
      const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setIsSpecialSection(!!el?.closest('#education, #projects'));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    currentQuote.split('').forEach((_, i) => {
      letterMotionValues[i].x.set(mousePos.x + 18 + i * 8);
      letterMotionValues[i].y.set(mousePos.y - 8);
    });

    setShowQuote(true);
    if (wasIdle.current) {
      setQuoteIndex((prev) => (prev + 1) % cursorQuotes.length);
      wasIdle.current = false;
    }
    setIsIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      wasIdle.current = true;
      setShowQuote(false);
      setIsIdle(true);
    }, 400);
    return () => clearTimeout(idleTimer.current);
  }, [mousePos]);

  return (
    <>

    {isIdle && (
        <motion.span
          className="mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: mousePos.y - 8,
            left: mousePos.x + 18,
            pointerEvents: 'none',
            zIndex: 9999,
            fontSize: '0.7rem',
            fontWeight: 600,
            color: isSpecialSection ? '#D7C49E' : '#343148',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          I'M HERE
        </motion.span>
      )}


      {showQuote && currentQuote.split('').map((letter, i) => (
        <motion.span
          key={i}
          className="mono"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            x: letterSprings[i].x,
            y: letterSprings[i].y,
            pointerEvents: 'none',
            zIndex: 9999,
            fontSize: '0.7rem',
            fontWeight: 600,
            color: isSpecialSection ? '#D7C49E' : '#343148',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </>
  );
}