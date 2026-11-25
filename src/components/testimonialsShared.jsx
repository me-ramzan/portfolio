import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../lib/ui';

/* ------------------------------------------------------------------ */
/* Your testimonials (edit here)                                       */
/* - quote: the full text, WITHOUT quotation marks (added for you)     */
/* - photo: import an image and put it here; any photo is shown in     */
/*   black & white automatically. Leave null to show initials.         */
/* ------------------------------------------------------------------ */
// import ahmedPhoto from '../assets/images/testimonials/ahmed.webp';

export const TESTIMONIALS = [

    {
    name: 'Abhishek Negi',
    role: 'Project Manager',
    company: 'Impact BBDO',
    linkedin: 'https://www.linkedin.com/in/muhammad-ramzan-111576246/details/recommendations/?detailScreenTabIndex=0',
    photo: null,
    quote:
      'I had the pleasure of working with Muhammad Ramzan and he consistently impressed me with his skills as a developer. He has a sharp eye for detail and approaches every challenge with a solution-focused mindset, often finding practical ways to solve complex problems. Muhammad is proactive and doesnt wait to be told what needs doing. Hes also a collaborative team player who works well with both technical and non-technical colleagues. Id recommend him to any team looking for a dependable and talented engineer',
  },

  {
    name: 'Santosh Suvarna',
    role: 'Technical Lead',
    company: 'Impact BBDO',
    linkedin: 'https://www.linkedin.com/in/muhammad-ramzan-111576246/details/recommendations/?detailScreenTabIndex=0',
    photo: null, // e.g. ahmedPhoto
    quote:
      'I had the pleasure of working with Ramzan and found him to be a great team player. He is approachable, open to feedback, and always willing to listen and understand different perspectives. His collaborative attitude, problem-solving approach, and willingness to learn make him a valuable Full Stack Developer. It was a pleasure working with him, and I wish him continued success in his career.',
  },

  {
    name: 'Ravi Teja',
    role: 'Senior Project Manager',
    company: 'Impact BBDO',
    linkedin: 'https://www.linkedin.com/in/muhammad-ramzan-111576246/details/recommendations/?detailScreenTabIndex=0',
    photo: null,
    quote:
      "I've had the pleasure of working with Muhammad Ramzan, and I truly appreciate his dedication, commitment, and technical expertise. He consistently demonstrates a strong willingness to learn, takes ownership of his responsibilities, and approaches challenges with a positive, solution-oriented mindset. His ability to understand requirements, deliver quality work, and collaborate effectively with the team makes him a valuable team player. Beyond his technical skills, his professionalism, proactive attitude, and willingness to support others are truly commendable. Wishing him continued success in his career and all the very best for his future endeavours!",
  },
  {
    name: 'Ateeb Shahid',
    role: 'Team Lead',
    company: 'Sybros Tech',
    linkedin: 'https://www.linkedin.com/in/muhammad-ramzan-111576246/details/recommendations/?detailScreenTabIndex=0',
    photo: null,
    quote:
      "I had the pleasure of working closely with Ramzan during his time as an RPA Developer at Sybros Tech, where he was part of the automation team I led and mentored. Throughout his time on the team, Ramzan consistently demonstrated a strong aptitude for learning and an impressive ability to quickly grasp the concepts of Robotic Process Automation (RPA) and workflow automation. He developed hands-on expertise with tools such as UiPath, Power Automate and n8n, while also strengthening his programming and scripting skills in Python, Google Apps Script and other coding technologies. Having witnessed his professional growth firsthand, I can confidently say that Ramzan has the technical potential, work ethic and attitude needed to excel in his career. It was a pleasure having him on my team and I would gladly recommend him to any organization looking for a skilled, motivated and dependable professional.",
  },
];

/* Big heading under the quote. The last line is italic + accent colour. */
export const HEADING = ['Straight from', "the source."];
export const LEFT_LABEL = '(TESTIMONIALS)';
export const AUTO_MS = 8000; // time on each testimonial before moving on

export const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

export function getTheme(isDark) {
  return isDark
    ? {
        bg: '#121018',
        text: '#F4F1EA',
        muted: 'rgba(244,241,234,0.55)',
        idle: 'rgba(244,241,234,0.4)',
        accent: '#D7C49E',
        hair: 'rgba(244,241,234,0.14)',
        photoBg: '#1d1a28',
        photoText: '#D7C49E',
      }
    : {
        bg: '#D7C49E',
        text: '#080808',
        muted: 'rgba(8,8,8,0.6)',
        idle: 'rgba(8,8,8,0.4)',
        accent: '#343148',
        hair: 'rgba(8,8,8,0.2)',
        photoBg: '#343148',
        photoText: '#D7C49E',
      };
}

export const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/* Loads the serif once. (Adding the same <link> to index.html is even better:
   it avoids a brief font swap on first load.) */
export function useSerifFont() {
  useEffect(() => {
    if (document.querySelector('link[data-serif-font]')) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap';
    l.setAttribute('data-serif-font', '');
    document.head.appendChild(l);
  }, []);
}

/* Shared keyframes for the progress line on the active index */
export const ProgressKeyframes = () => (
  <style>{`
    @keyframes testiProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  `}</style>
);

/* ------------------------------------------------------------------ */
/* Quote that reveals line by line, each line sliding out of its mask. */
/* Lines are measured from the real wrapping, and re-measured on       */
/* resize / font load, so it works at any width.                       */
/* Driven by the parent's variants: hidden -> show -> exit.            */
/* ------------------------------------------------------------------ */
export function QuoteLines({ text, style, delay = 0 }) {
  const measureRef = useRef(null);
  const [lines, setLines] = useState(null);
  const words = text.split(' ');

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return undefined;
    const measure = () => {
      const spans = [...el.querySelectorAll('[data-w]')];
      const out = [];
      let top = null;
      let cur = [];
      spans.forEach((s) => {
        const t = s.offsetTop;
        if (top === null || Math.abs(t - top) < 4) cur.push(s.textContent);
        else {
          out.push(cur.join(' '));
          cur = [s.textContent];
        }
        top = t;
      });
      if (cur.length) out.push(cur.join(' '));
      setLines((prev) => (prev && prev.join('\n') === out.join('\n') ? prev : out));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Invisible copy, only used to find where the lines wrap */}
      <p
        ref={measureRef}
        aria-hidden="true"
        style={{ ...style, margin: 0, position: 'absolute', left: 0, right: 0, top: 0, visibility: 'hidden', pointerEvents: 'none' }}
      >
        {words.map((w, k) => (
          <React.Fragment key={k}>
            {/* nowrap: a hyphenated word ("solution-focused") must be measured as
                one unit, or it splits across two lines here but not in the real text */}
            <span data-w="" style={{ whiteSpace: 'nowrap' }}>{w}</span>{' '}
          </React.Fragment>
        ))}
      </p>

      <p aria-label={text} style={{ ...style, margin: 0 }}>
        {(lines || [text]).map((line, k) => (
          <span
            key={`${k}-${line}`}
            aria-hidden="true"
            style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em' }}
          >
            <motion.span
              style={{ display: 'block', willChange: 'transform' }}
              variants={{
                hidden: { y: '105%' },
                show: { y: '0%', transition: { duration: 0.85, ease: EASE, delay: delay + k * 0.07 } },
                exit: { y: '-105%', transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0], delay: k * 0.03 } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </p>
    </div>
  );
}

/* Black & white portrait that wipes open from the bottom and closes upwards */
export function Portrait({ item, t, style }) {
  return (
    <motion.div
      variants={{
        hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
        show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 } },
        exit: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] } },
      }}
      style={{ position: 'relative', overflow: 'hidden', backgroundColor: t.photoBg, ...style }}
    >
      <motion.div
        variants={{
          hidden: { scale: 1.12 },
          show: { scale: 1, transition: { duration: 1.4, ease: EASE, delay: 0.1 } },
          exit: { scale: 1.04, transition: { duration: 0.5 } },
        }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {item.photo ? (
          <img
            src={item.photo}
            alt={item.name}
            loading="lazy"
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'grayscale(1) contrast(1.05)' }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontFamily: SERIF, fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: t.photoText, letterSpacing: '-0.02em' }}
          >
            {initials(item.name)}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* Big heading: each line slides up out of its own mask when the section is seen */
export function Heading({ inView, t, style }) {
  return (
    <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.03em', color: t.text, ...style }}>
      {HEADING.map((line, k) => {
        const last = k === HEADING.length - 1;
        return (
          <span key={line} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
            <motion.span
              initial={{ y: '105%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.15 + k * 0.1 }}
              style={{ display: 'block', fontStyle: last ? 'italic' : 'normal', color: last ? t.accent : t.text }}
            >
              {line}
            </motion.span>
          </span>
        );
      })}
    </h3>
  );
}