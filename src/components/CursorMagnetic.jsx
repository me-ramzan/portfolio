import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------
   Smart magnetic cursor — the page reacts to the cursor:
   buttons / links   → pulled toward the cursor, soft circle follows
   [data-tilt]       → tilts in 3D toward the cursor + "View" tag
   paragraphs        → thin text bar; after a moment the other text
                       in that section fades so the reader can focus
   headings          → thin text bar sized to the heading
   inputs            → hidden (normal text cursor shows)
   anywhere else     → small solid dot

   Custom tag text:      data-cursor="Open"
   No magnetic pull:     data-magnetic="off"
   No focus fading:      data-focus="off"   (on a section or element)
------------------------------------------------------------------- */

const NAVY = '#343148';
const GOLD = '#D7C49E';
const DARK_SECTIONS = '#education, #projects';

const SKIP = 'input, textarea, select, [contenteditable="true"]';
const BUTTON = 'a, button, [role="button"]';
const TILT = '[data-tilt]';
const MEDIA = 'img, video, picture';
const HEADING = 'h1, h2, h3';
const READ = 'p, li, blockquote';
const FOCUS_SCOPE = 'section, footer, article';

const DOT = 10;
const PULL = 0.3;        // how strongly buttons follow the cursor
const MAX_W = 420;       // bigger links don't move (cards, full-width rows)
const MAX_H = 220;
const TILT_DEG = 8;
const FOCUS_DELAY = 300; // ms resting on a paragraph before others fade

function useIsTouch() {
  const query = '(hover: none), (pointer: coarse)';
  const [isTouch, setIsTouch] = useState(
    typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isTouch;
}

export default function CursorMagnetic() {
  const isTouch = useIsTouch();
  const dotRef = useRef(null);
  const tagRef = useRef(null);

  useEffect(() => {
    if (isTouch) return;

    const dot = dotRef.current;
    const tag = tagRef.current;
    const root = document.documentElement;
    root.classList.add('custom-cursor');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerp = (a, b, t) => a + (b - a) * t;

    const mouse = { x: -100, y: -100 };
    const c = { x: -100, y: -100, w: DOT, h: DOT, r: DOT / 2 };
    const t = { x: -100, y: -100 };

    let mode = 'dot'; // dot | button | text | hidden
    let barHeight = 22;
    let tagText = '';
    let onNavy = false;
    let visible = false;
    let pressed = false;
    let scale = 1;
    let opacity = 0;
    let colorKey = '';
    let raf;

    // Elements currently moving back/forth: Map<el, {x, y}>
    const magnets = new Map();
    const tilts = new Map();
    let magnetTarget = null;
    let tiltTarget = null;

    // Focus mode
    let focusScope = null;
    let focusEl = null;
    let focusTimer = null;

    const clearFocus = () => {
      clearTimeout(focusTimer);
      focusTimer = null;
      focusScope?.classList.remove('cursor-focus-on');
      focusEl?.classList.remove('cursor-focus-target');
      focusScope = null;
      focusEl = null;
    };

    const requestFocus = (el) => {
      if (reduced || el === focusEl) return;
      const scope = el.closest(FOCUS_SCOPE);
      if (!scope || el.closest('[data-focus="off"]')) {
        clearFocus();
        return;
      }
      clearFocus();
      focusTimer = setTimeout(() => {
        focusScope = scope;
        focusEl = el;
        scope.classList.add('cursor-focus-on');
        el.classList.add('cursor-focus-target');
      }, FOCUS_DELAY);
      focusEl = el; // remember the pending target so we don't restart the timer
    };

    const hitTest = () => {
      const el = document.elementFromPoint(mouse.x, mouse.y);
      onNavy = (root.dataset.theme === 'dark') !== !!el?.closest(DARK_SECTIONS);
      magnetTarget = null;
      tiltTarget = null;
      tagText = '';

      if (!el) {
        mode = 'dot';
        clearFocus();
        return;
      }
      if (el.closest(SKIP)) {
        mode = 'hidden';
        clearFocus();
        return;
      }

      const custom = el.closest('[data-cursor]');
      const tilt = el.closest(TILT);
      const button = el.closest(BUTTON);

      if (tilt) {
        if (!reduced) tiltTarget = tilt;
        tagText = custom?.dataset.cursor || 'View';
        mode = 'dot';
        clearFocus();
        return;
      }

      if (button) {
        const r = button.getBoundingClientRect();
        const small = r.width <= MAX_W && r.height <= MAX_H;
        if (small && !reduced && button.dataset.magnetic !== 'off') magnetTarget = button;
        if (custom) tagText = custom.dataset.cursor;
        else if (el.closest(MEDIA)) tagText = 'View';
        mode = small ? 'button' : 'dot';
        clearFocus();
        return;
      }

      if (custom) tagText = custom.dataset.cursor;

      const heading = el.closest(HEADING);
      const read = el.closest(READ);
      if (heading || read) {
        const target = read || heading;
        const cs = getComputedStyle(target);
        const lh = parseFloat(cs.lineHeight);
        const fs = parseFloat(cs.fontSize);
        barHeight = Math.min(Math.max(Number.isNaN(lh) ? fs * 1.3 : lh, 16), 56);
        mode = 'text';
        if (read) requestFocus(read);
        else clearFocus();
        return;
      }

      mode = 'dot';
      clearFocus();
    };

    const applyColors = () => {
      const key = `${mode}-${onNavy}`;
      if (key === colorKey) return;
      colorKey = key;
      const fg = onNavy ? GOLD : NAVY;
      dot.style.backgroundColor = fg;
      tag.style.backgroundColor = fg;
      tag.style.color = onNavy ? NAVY : GOLD;
    };

    const updateMoving = (map, active, compute, write) => {
      if (active && !map.has(active)) map.set(active, { x: 0, y: 0 });
      map.forEach((v, el) => {
        const target = el === active && el.isConnected ? compute(el) : { x: 0, y: 0 };
        v.x = lerp(v.x, target.x, 0.18);
        v.y = lerp(v.y, target.y, 0.18);
        if (el !== active && Math.abs(v.x) < 0.05 && Math.abs(v.y) < 0.05) {
          write(el, null);
          map.delete(el);
        } else {
          write(el, v);
        }
      });
    };

    const tick = () => {
      // Magnetic buttons (uses the CSS `translate` property, so it
      // doesn't overwrite animations that use `transform`)
      updateMoving(
        magnets,
        magnetTarget,
        (el) => {
          const r = el.getBoundingClientRect();
          const v = magnets.get(el);
          const cx = r.left - v.x + r.width / 2;
          const cy = r.top - v.y + r.height / 2;
          return { x: (mouse.x - cx) * PULL, y: (mouse.y - cy) * PULL };
        },
        (el, v) => {
          el.style.translate = v ? `${v.x.toFixed(2)}px ${v.y.toFixed(2)}px` : '';
        }
      );

      // 3D tilt
      updateMoving(
        tilts,
        tiltTarget,
        (el) => {
          const r = el.getBoundingClientRect();
          const px = (mouse.x - r.left) / r.width - 0.5;
          const py = (mouse.y - r.top) / r.height - 0.5;
          return { x: -py * TILT_DEG * 2, y: px * TILT_DEG * 2 };
        },
        (el, v) => {
          el.style.transform = v
            ? `perspective(800px) rotateX(${v.x.toFixed(2)}deg) rotateY(${v.y.toFixed(2)}deg)`
            : '';
        }
      );

      // Cursor shape
      let tw = DOT;
      let th = DOT;
      let tr = DOT / 2;
      let tOpacity = 1;
      if (mode === 'button') {
        tw = th = 38;
        tr = 19;
        tOpacity = 0.25;
      } else if (mode === 'text') {
        tw = 2;
        th = barHeight;
        tr = 1;
      } else if (mode === 'hidden') {
        tOpacity = 0;
      }

      const k = reduced ? 1 : 0.26;
      const ks = reduced ? 1 : 0.2;
      c.x = lerp(c.x, mouse.x, k);
      c.y = lerp(c.y, mouse.y, k);
      c.w = lerp(c.w, tw, ks);
      c.h = lerp(c.h, th, ks);
      c.r = lerp(c.r, tr, ks);
      scale = lerp(scale, pressed ? 0.85 : 1, 0.25);
      opacity = lerp(opacity, visible ? tOpacity : 0, 0.2);

      applyColors();
      dot.style.width = `${c.w}px`;
      dot.style.height = `${c.h}px`;
      dot.style.borderRadius = `${c.r}px`;
      dot.style.opacity = opacity.toFixed(3);
      dot.style.transform = `translate3d(${c.x - c.w / 2}px, ${c.y - c.h / 2}px, 0) scale(${scale})`;

      // Tag sits beside the cursor so it never covers what you're looking at
      t.x = lerp(t.x, mouse.x, 0.16);
      t.y = lerp(t.y, mouse.y, 0.16);
      if (tagText && tag.textContent !== tagText) tag.textContent = tagText;
      tag.style.opacity = visible && tagText ? '1' : '0';
      tag.style.transform = `translate3d(${t.x + 18}px, ${t.y + 16}px, 0)`;

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      visible = true;
      hitTest();
    };
    const onScroll = () => visible && hitTest();
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);
    const onOut = (e) => {
      if (!e.relatedTarget) {
        visible = false;
        magnetTarget = null;
        tiltTarget = null;
        clearFocus();
      }
    };
    const themeObserver = new MutationObserver(() => visible && hitTest());
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      clearFocus();
      magnets.forEach((_, el) => (el.style.translate = ''));
      tilts.forEach((_, el) => (el.style.transform = ''));
      root.classList.remove('custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseout', onOut);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: DOT,
          height: DOT,
          borderRadius: DOT / 2,
          backgroundColor: NAVY,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          willChange: 'transform, width, height',
          transition: 'background-color 0.3s ease',
        }}
      />
      <div
        ref={tagRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          padding: '5px 10px',
          borderRadius: 999,
          backgroundColor: NAVY,
          color: GOLD,
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.25s ease, background-color 0.3s ease, color 0.3s ease',
        }}
      />
    </>
  );
}