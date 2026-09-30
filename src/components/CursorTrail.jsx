import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

export default function CursorTrail() {
  const isMobile = useIsMobile();
  const [isSpecialSection, setIsSpecialSection] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const ringX = useMotionValue(0);
  const ringY = useMotionValue(0);
  const ringSpringX = useSpring(ringX, { damping: 26, stiffness: 220, mass: 0.5 });
  const ringSpringY = useSpring(ringY, { damping: 26, stiffness: 220, mass: 0.5 });

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setIsSpecialSection(!!el?.closest('#education, #projects'));
      setIsHovering(!!el?.closest('a, button, input, textarea, [role="button"]'));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: ringSpringX,
        y: ringSpringY,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9998,
        width: isHovering ? 57 : 37,
        height: isHovering ? 57 : 37,
        borderRadius: '50%',
        border: `2px solid ${isSpecialSection ? '#D7C49E' : '#343148'}`,
        transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
      }}
    />
  );
}