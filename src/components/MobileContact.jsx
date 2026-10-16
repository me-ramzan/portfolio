import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Mail, Phone, MessageCircle, Copy, Check, ArrowRight, Clock, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';

const EASE = [0.16, 1, 0.3, 1];
const GOLD = '#D7C49E';
const PANEL = '#1d1a28';
const PANEL_TEXT = '#F4F1EA';
const PANEL_MUTED = 'rgba(244,241,234,0.55)';

/* ---- Your details (edit here) ---- */
const EMAIL = 'me.ramzan.zulfiqar@gmail.com';
const PHONE_DISPLAY = '+971 55 499 1245';
const PHONE_RAW = '971554991245';
const CITY = 'Dubai, UAE';
const TIMEZONE = 'Asia/Dubai';
const TZ_OFFSET_HOURS = 4;
const RESPONSE_TIME = 'Replies within 24 hours';
const OPEN_TO = ['Full-time', 'Freelance', 'Remote'];
const TOPICS = ['Full-time role', 'Freelance project', 'Collaboration', 'Just saying hi'];
const WHATSAPP_TEXT = 'Hi! I came across your portfolio and would like to connect.';

function getColors(isDark) {
  return isDark
    ? { bg: '#121018', text: '#F4F1EA', muted: 'rgba(244,241,234,0.55)', line: 'rgba(244,241,234,0.14)', tile: '#1d1a28', tileEdge: 'rgba(244,241,234,0.08)' }
    : { bg: '#D7C49E', text: '#111111', muted: 'rgba(17,17,17,0.6)', line: 'rgba(17,17,17,0.2)', tile: '#343148', tileEdge: 'rgba(0,0,0,0.1)' };
}

/* Masked line reveal */
function Reveal({ children, delay = 0, inView, style }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Bottom padding keeps descenders (g, p, y) inside the mask */}
      <motion.div
        initial={{ y: '110%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 0.9, delay, ease: EASE }}
        style={{ paddingBottom: '0.16em', ...style }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Live clock in your city + difference from the visitor */
function useLocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TIMEZONE }).format(now);
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: TIMEZONE }).format(now));
  const visitorOffset = -now.getTimezoneOffset() / 60;
  const diff = TZ_OFFSET_HOURS - visitorOffset;
  const diffText =
    diff === 0 ? 'Same time as you' : `${Math.abs(diff)}h ${diff > 0 ? 'ahead of' : 'behind'} you`;
  const working = hour >= 9 && hour < 19;
  return { time, diffText, working };
}

/* ------------------------------------------------------------------ */
/* Quick action tile                                                   */
/* ------------------------------------------------------------------ */
function ActionTile({ href, icon, label, sub, primary, delay, inView, onClick, isDark }) {
  // Light theme has a gold page background, so the primary tile goes dark with gold text there
  const bg = primary ? (isDark ? GOLD : '#121018') : isDark ? PANEL : '#343148';
  const fg = primary ? (isDark ? '#1d1a28' : GOLD) : PANEL_TEXT;
  const edge = primary ? GOLD : 'rgba(244,241,234,0.08)';
  return (
    <motion.a
      href={href}
      onClick={onClick}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 18,
        padding: '14px 14px 12px',
        borderRadius: 16,
        textDecoration: 'none',
        backgroundColor: bg,
        color: fg,
        border: `1px solid ${edge}`,
        boxShadow: isDark ? 'none' : '0 10px 24px rgba(0,0,0,0.18)',
        minHeight: 96,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {icon}
        <ArrowRight size={14} style={{ opacity: 0.6, transform: 'rotate(-45deg)' }} />
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{label}</div>
        <div className="mono" style={{ fontSize: '0.52rem', letterSpacing: '0.08em', opacity: 0.65, marginTop: 2 }}>{sub}</div>
      </div>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/* Floating-label field                                                */
/* ------------------------------------------------------------------ */
function Field({ label, value, onChange, type = 'text', multiline, error, autoComplete }) {
  const [focus, setFocus] = useState(false);
  const up = focus || value.length > 0;
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ position: 'relative', paddingTop: 16 }}>
      <motion.label
        initial={false}
        animate={{ y: up ? 0 : 26, scale: up ? 0.82 : 1, color: error ? '#ff8f8f' : up ? GOLD : PANEL_MUTED }}
        transition={{ duration: 0.25, ease: EASE }}
        className="mono"
        style={{ position: 'absolute', top: 0, left: 0, fontSize: '0.72rem', letterSpacing: '0.1em', transformOrigin: 'left top', pointerEvents: 'none' }}
      >
        {label}
      </motion.label>
      <Tag
        type={multiline ? undefined : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        rows={multiline ? 3 : undefined}
        autoComplete={autoComplete}
        aria-label={label}
        aria-invalid={!!error}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: PANEL_TEXT,
          fontSize: '1rem', // 16px stops iOS from zooming in
          padding: '10px 0 10px',
          resize: 'none',
          fontFamily: 'inherit',
          display: 'block',
        }}
      />
      <div style={{ position: 'relative', height: 1, backgroundColor: error ? '#ff8f8f' : 'rgba(244,241,234,0.15)' }}>
        <motion.div
          initial={false}
          animate={{ scaleX: focus ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ position: 'absolute', inset: 0, backgroundColor: GOLD, transformOrigin: 'left' }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mono"
            style={{ fontSize: '0.58rem', color: '#ff8f8f', marginTop: 6, letterSpacing: '0.04em' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function MobileContact({ isDark, sectionRef, emailConfig }) {
  const c = getColors(isDark);
  const { time, diffText, working } = useLocalTime();

  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, amount: 0.4 });
  const actionsRef = useRef(null);
  const actionsIn = useInView(actionsRef, { once: true, amount: 0.4 });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [topic, setTopic] = useState(TOPICS[0]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);

  const waHref = useMemo(() => `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(WHATSAPP_TEXT)}`, []);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Please add your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Please add a valid email';
    if (form.message.trim().length < 5) er.message = 'A short message, please';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending' || !validate()) return;
    setStatus('sending');
    try {
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          name: form.name,
          email: form.email,
          topic: topic,
          message: form.message,
          phone: 'Not provided',
        },
        emailConfig.publicKey
      );
      setStatus('sent');
      navigator.vibrate?.([15, 40, 15]);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  const copyEmail = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ position: 'relative', padding: '4.5rem 6vw 4rem', backgroundColor: c.bg, borderTop: `1px solid ${c.line}`, overflow: 'hidden' }}
    >
      {/* Header */}
      <div ref={headRef}>
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', letterSpacing: '0.15em', color: c.text, marginBottom: 14 }}>
          <span>06 / CONTACT</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: c.muted }}>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#3ddc84', display: 'block' }}
            />
            AVAILABLE
          </span>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={headIn ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ height: 1, backgroundColor: c.line, transformOrigin: 'left' }}
        />

        <div style={{ marginTop: '2rem' }}>
          <Reveal inView={headIn} delay={0.1} style={{ fontSize: 'clamp(2.2rem, 11vw, 3rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.02, color: c.text }}>
            Let's build
          </Reveal>
          <Reveal inView={headIn} delay={0.2} style={{ fontSize: 'clamp(2.2rem, 11vw, 3rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.02, color: isDark ? GOLD : '#343148' }}>
            something great.
          </Reveal>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={headIn ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ fontSize: '0.95rem', lineHeight: 1.6, color: c.muted, margin: '1rem 0 0' }}
        >
          Open to {OPEN_TO.map((o) => o.toLowerCase()).join(', ')} work across the UAE and beyond.
        </motion.p>
      </div>

      {/* Live info strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '2rem', borderTop: `1px solid ${c.line}`, borderBottom: `1px solid ${c.line}` }}
      >
        <div style={{ padding: '14px 12px 14px 0', borderRight: `1px solid ${c.line}` }}>
          <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.55rem', letterSpacing: '0.14em', color: c.muted }}>
            <MapPin size={11} /> {CITY.toUpperCase()}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', color: c.text, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            {time}
          </div>
          <div className="mono" style={{ fontSize: '0.55rem', color: c.muted, marginTop: 2 }}>{diffText}</div>
        </div>
        <div style={{ padding: '14px 0 14px 14px' }}>
          <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.55rem', letterSpacing: '0.14em', color: c.muted }}>
            <Clock size={11} /> RESPONSE
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: c.text, marginTop: 8, lineHeight: 1.3 }}>{RESPONSE_TIME}</div>
          <div className="mono" style={{ fontSize: '0.55rem', color: working ? (isDark ? '#3ddc84' : '#1f7a4a') : c.muted, marginTop: 4 }}>
            {working ? '● Online now' : '○ Outside working hours'}
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div ref={actionsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: '1.5rem' }}>
        <ActionTile href={waHref} icon={<MessageCircle size={20} />} label="WhatsApp" sub="FASTEST" primary delay={0} inView={actionsIn} isDark={isDark} />
        <ActionTile href={`tel:+${PHONE_RAW}`} icon={<Phone size={20} />} label="Call" sub={PHONE_DISPLAY.slice(-8)} delay={0.08} inView={actionsIn} isDark={isDark} />
        <ActionTile href={`mailto:${EMAIL}`} icon={<Mail size={20} />} label="Email" sub="DIRECT" delay={0.16} inView={actionsIn} isDark={isDark} />
      </div>

      {/* Copy email */}
      <motion.button
        type="button"
        onClick={copyEmail}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        style={{
          width: '100%',
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '13px 14px',
          borderRadius: 14,
          border: `1px dashed ${c.line}`,
          background: 'transparent',
          color: c.text,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{EMAIL}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'ok' : 'copy'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="mono"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.58rem', letterSpacing: '0.1em', flexShrink: 0, color: copied ? (isDark ? '#3ddc84' : '#1f7a4a') : c.muted }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'COPIED' : 'COPY'}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ marginTop: '2.25rem', borderRadius: 22, backgroundColor: PANEL, padding: '1.5rem 1.25rem 1.35rem', boxShadow: '0 24px 50px rgba(0,0,0,0.25)', overflow: 'hidden', position: 'relative' }}
      >
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ textAlign: 'center', padding: '2.5rem 0 2rem', color: PANEL_TEXT }}
            >
              <svg width="72" height="72" viewBox="0 0 72 72" style={{ display: 'block', margin: '0 auto 1.25rem' }}>
                <motion.circle
                  cx="36" cy="36" r="33" fill="none" stroke={GOLD} strokeWidth="2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE }}
                />
                <motion.path
                  d="M22 37 l10 10 l19 -21" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.55, ease: EASE }}
                />
              </svg>
              <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 6px' }}>
                Message received.
              </motion.h3>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }} style={{ fontSize: '0.88rem', color: PANEL_MUTED, margin: 0, lineHeight: 1.6 }}>
                Thanks {form.name.split(' ')[0]}. I'll get back to you at
                <br />
                <span style={{ color: PANEL_TEXT }}>{form.email}</span> soon.
              </motion.p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="mono" style={{ fontSize: '0.58rem', letterSpacing: '0.16em', color: GOLD, marginBottom: 6 }}>
                OR LEAVE A MESSAGE
              </div>
              <div style={{ fontSize: '0.8rem', color: PANEL_MUTED, marginTop: 4 }}>
                What's this about?
              </div>

              {/* Topic chips: even 2 x 2 grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '12px 0 10px' }}>
                {TOPICS.map((tp) => {
                  const on = topic === tp;
                  return (
                    <motion.button
                      key={tp}
                      type="button"
                      onClick={() => setTopic(tp)}
                      whileTap={{ scale: 0.97 }}
                      aria-pressed={on}
                      style={{
                        width: '100%',
                        padding: '11px 8px',
                        borderRadius: 12,
                        border: `1px solid ${on ? GOLD : 'rgba(244,241,234,0.14)'}`,
                        backgroundColor: on ? GOLD : 'rgba(244,241,234,0.04)',
                        color: on ? '#1d1a28' : 'rgba(244,241,234,0.8)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        transition: 'background-color 0.25s, color 0.25s, border-color 0.25s',
                      }}
                    >
                      {tp}
                    </motion.button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Field label="NAME" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <Field label="EMAIL" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                <Field label="MESSAGE" value={form.message} onChange={set('message')} error={errors.message} multiline />
              </div>

              {status === 'error' && (
                <p className="mono" style={{ fontSize: '0.62rem', color: '#ff8f8f', margin: '14px 0 0', lineHeight: 1.5 }}>
                  Something went wrong. Please try again or use WhatsApp above.
                </p>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  marginTop: 22,
                  height: 54,
                  borderRadius: 999,
                  border: 'none',
                  backgroundColor: GOLD,
                  color: '#1d1a28',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: status === 'sending' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'sending' ? (
                    <motion.span key="s" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(29,26,40,0.25)', borderTopColor: '#1d1a28', display: 'block' }}
                      />
                      Sending…
                    </motion.span>
                  ) : (
                    <motion.span key="i" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Send message <ArrowRight size={17} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}