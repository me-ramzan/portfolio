import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function Scroll() {
  const { scrollYProgress } = useScroll();
  const trackRef = useRef(null);
  const [trackHeight, setTrackHeight] = useState(0);

  const THUMB_HEIGHT = 80; // thumb ki height px mein — apni pasand se adjust karo

  useEffect(() => {
    const updateHeight = () => {
      if (trackRef.current) {
        setTrackHeight(trackRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // scroll progress (0 to 1) ko thumb ke movable range mein map karo
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(trackHeight - THUMB_HEIGHT, 0)]
  );

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 w-full h-1 bg-[#121018] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Right vertical track + moving thumb */}
      <div
        ref={trackRef}
        className="hidden md:block fixed top-0 right-0 w-1 h-full z-50 bg-white/10 rounded-full"
      >
        <motion.div
          className="w-1 bg-[#121018] rounded-full"
          style={{
            height: `${THUMB_HEIGHT}px`,
            y,
          }}
        />
      </div>
    </>
  );
}