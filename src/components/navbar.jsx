import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // NEW: check if the screen is mobile, so Hire Me only shows on desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const wasOpen = menuOpen;
    closeMenu();

    const scrollToTarget = () => {
      const targetId = href.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navbarHeight = 64;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    };

    if (wasOpen) {
      setTimeout(scrollToTarget, 50);
    } else {
      scrollToTarget();
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 6vw',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: scrolled || menuOpen ? 'rgba(244, 241, 234, 0.92)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid #D1D1C7' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <a
        href="#top"
        onClick={(e) => handleNavClick(e, '#top')}
        className="mono"
        style={{ color: '#343148', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textDecoration: 'none', zIndex: 1001, position: 'relative' }}
      >
        Mr.
      </a>

      {/* NEW: right side group = Hire Me button + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1001 }}>
        {/* Always on the page; hidden with styles (not removed) so React never has to re-insert it */}
        <motion.a
              href="mailto:me.ramzan.zulfiqar@gmail.com"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              style={{
                display: isMobile ? 'none' : 'inline-block',
                pointerEvents: menuOpen ? 'none' : 'auto',
                backgroundColor: '#343148',
                color: '#F4F1EA',
                padding: '10px 28px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.06em',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#343148'; }}
            >
              Hire Me
            </motion.a>

        {/* Hamburger icon */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            padding: '8px',
            zIndex: 1001,
            position: 'relative',
          }}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            style={{ width: '24px', height: '2px', backgroundColor: '#080808', display: 'block' }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            style={{ width: '24px', height: '2px', backgroundColor: '#080808', display: 'block' }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            style={{ width: '24px', height: '2px', backgroundColor: '#080808', display: 'block' }}
          />
        </button>
      </div>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.3 } }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: '100vh',
              backgroundColor: '#F4F1EA',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0rem',
              padding: '0 6vw',
              overflow: 'hidden',
            }}
          >
            {navLinks.map((link, i) => (
              <div key={link.label} style={{ overflow: 'hidden', padding: '0px 0' }}>
                <motion.a
                  initial={{ y: '110%' }}
                  animate={{ y: 0, transition: { delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ y: '-110%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    display: 'inline-block',
                    color: '#080808',
                    textDecoration: 'none',
                    fontSize: 'clamp(2rem, 8vw, 2.8rem)',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.29,
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.6'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {link.label}
                </motion.a>
              </div>
            ))}
            <div style={{ overflow: 'hidden', marginTop: '1.5rem', display: isMobile ? 'block' : 'none' }}>
              <motion.a
                initial={{ y: '110%' }}
                animate={{ y: 0, transition: { delay: 0.15 + navLinks.length * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ y: '-110%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                href="mailto:me.ramzan.zulfiqar@gmail.com"
                onClick={closeMenu}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#343148',
                  color: '#F4F1EA',
                  padding: '12px 45px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  textAlign: 'center',
                }}
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

















// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// const navLinks = [
//   { label: 'About', href: '#about' },
//   { label: 'Experience', href: '#experience' },
//   { label: 'Projects', href: '#projects' },
//   { label: 'Skills', href: '#skills' },
//   { label: 'Contact', href: '#contact' },
// ];

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60);
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const closeMenu = () => setMenuOpen(false);

//   const handleNavClick = (e, href) => {
//     e.preventDefault();
//     const wasOpen = menuOpen;
//     closeMenu();

//     const scrollToTarget = () => {
//       const targetId = href.replace('#', '');
//       const targetEl = document.getElementById(targetId);
//       if (targetEl) {
//         const navbarHeight = 64;
//         const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
//         window.scrollTo({ top: targetPosition, behavior: 'smooth' });
//       }
//     };

//     if (wasOpen) {
//       setTimeout(scrollToTarget, 50);
//     } else {
//       scrollToTarget();
//     }
//   };

//   return (
//     <>
//       <motion.nav
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1000,
//           padding: '0 6vw',
//           height: '64px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           backgroundColor: scrolled ? 'rgba(244, 241, 234, 0.92)' : 'transparent',
//           backdropFilter: scrolled ? 'blur(12px)' : 'none',
//           borderBottom: scrolled ? '1px solid #D1D1C7' : 'none',
//           transition: 'all 0.4s ease',
//         }}
//       >
//         <a
//           href="#top"
//           onClick={(e) => handleNavClick(e, '#top')}
//           className="mono"
//           style={{ color: '#343148', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textDecoration: 'none' }}
//         >
//           Mr.
//         </a>

//         {/* Controls: Hire us pill + hamburger circle, fade out when menu opens */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
//           <AnimatePresence>
//             {!menuOpen && (
//               <motion.a
//                 key="hire-pill"
//                 initial={{ opacity: 1 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0, transition: { duration: 0.2 } }}
//                 href="mailto:me.ramzan.zulfiqar@gmail.com"
//                 style={{
//                   display: 'inline-flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   backgroundColor: '#080808',
//                   color: '#F4F1EA',
//                   padding: '10px 18px',
//                   borderRadius: '999px',
//                   fontSize: '0.85rem',
//                   fontWeight: 500,
//                   textDecoration: 'none',
//                   whiteSpace: 'nowrap',
//                 }}
//               >
//                 Hire us
//                 <span style={{ fontSize: '1rem' }}>→</span>
//               </motion.a>
//             )}
//           </AnimatePresence>

//           <button
//             onClick={() => setMenuOpen(prev => !prev)}
//             aria-label="Toggle menu"
//             style={{
//               width: '44px',
//               height: '44px',
//               borderRadius: '50%',
//               border: '1px solid #08080833',
//               background: menuOpen ? 'transparent' : 'rgba(244,241,234,0.6)',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               position: 'relative',
//               zIndex: 1201,
//               flexShrink: 0,
//             }}
//           >
//             <motion.span
//               animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
//               style={{ position: 'absolute', width: '16px', height: '1.5px', backgroundColor: '#080808' }}
//             />
//             <motion.span
//               animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
//               style={{ position: 'absolute', width: '16px', height: '1.5px', backgroundColor: '#080808' }}
//             />
//           </button>

//           {/* Floating dropdown card, anchored top-right under the hamburger */}
//           <AnimatePresence>
//             {menuOpen && (
//               <>
//                 <motion.div
//                   onClick={closeMenu}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   style={{
//                     position: 'fixed',
//                     inset: 0,
//                     zIndex: 1198,
//                     background: 'transparent',
//                   }}
//                 />
//                 <motion.div
//                   key="dropdown-panel"
//                   initial={{ opacity: 0, scale: 0.85, y: -10 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
//                   transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
//                   style={{
//                     position: 'absolute',
//                     top: '0px',
//                     right: '0px',
//                     transformOrigin: 'top right',
//                     zIndex: 1200,
//                     backgroundColor: '#F4F1EA',
//                     borderRadius: '20px',
//                     boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
//                     padding: '70px 28px 28px 28px',
//                     width: 'min(280px, 78vw)',
//                     display: 'flex',
//                     flexDirection: 'column',
//                   }}
//                 >
//                   {navLinks.map((link, i) => (
//                     <motion.a
//                       key={link.label}
//                       initial={{ opacity: 0, y: 8 }}
//                       animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.05, duration: 0.35 } }}
//                       exit={{ opacity: 0, transition: { duration: 0.15 } }}
//                       href={link.href}
//                       onClick={(e) => handleNavClick(e, link.href)}
//                       style={{
//                         color: '#080808',
//                         textDecoration: 'none',
//                         fontSize: '1.15rem',
//                         fontFamily: "'Montserrat', sans-serif",
//                         fontWeight: 500,
//                         padding: '9px 0',
//                       }}
//                       onMouseEnter={e => { e.currentTarget.style.opacity = '0.55'; }}
//                       onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
//                     >
//                       {link.label}
//                     </motion.a>
//                   ))}

//                   <motion.a
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + navLinks.length * 0.05, duration: 0.35 } }}
//                     exit={{ opacity: 0, transition: { duration: 0.15 } }}
//                     href="mailto:me.ramzan.zulfiqar@gmail.com"
//                     onClick={closeMenu}
//                     style={{
//                       marginTop: '16px',
//                       display: 'inline-flex',
//                       alignItems: 'center',
//                       justifyContent: 'space-between',
//                       gap: '10px',
//                       border: '1px solid #080808',
//                       color: '#080808',
//                       padding: '11px 18px',
//                       borderRadius: '999px',
//                       fontSize: '0.9rem',
//                       fontWeight: 500,
//                       textDecoration: 'none',
//                     }}
//                   >
//                     Start your project
//                     <span>→</span>
//                   </motion.a>
//                 </motion.div>
//               </>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.nav>
//     </>
//   );
// }