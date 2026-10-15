import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Copy, Check, ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import MobileContact from './MobileContact';
import { useIsMobile, useIsDark, SectionLabel, EASE } from '../lib/ui';

const EMAILJS_SERVICE_ID = 'service_bcyigug';
const EMAILJS_TEMPLATE_ID = 'template_pta6w9h';
const EMAILJS_PUBLIC_KEY = '_Y1OJswaMuBHliGao';

/* ---- Your details (edit here) ---- */
const EMAIL = 'me.ramzan.zulfiqar@gmail.com';
const PHONE_DISPLAY = '+971 55 499 1245';
const PHONE_RAW = '971554991245';
const CITY = 'Dubai, United Arab Emirates';
const TIMEZONE = 'Asia/Dubai';
const TZ_OFFSET_HOURS = 4;
const RESPONSE_TIME = 'Replies within 24 hours';
const WHATSAPP_TEXT = 'Hi! I came across your portfolio and would like to connect.';
const TOPICS = ['Full-time role', 'Freelance project', 'Collaboration', 'Just saying hi'];

const PANEL = '#1d1a28';
const PANEL_TEXT = '#F4F1EA';
const PANEL_MUTED = 'rgba(244,241,234,0.55)';
const GOLD = '#D7C49E';

function getTheme(isDark) {
  return isDark
    ? { bg: '#121018', border: '#343148', text: '#F4F1EA', muted: 'rgba(244,241,234,0.6)', hair: 'rgba(244,241,234,0.14)', accent: '#D7C49E', stroke: '#F4F1EA', tile: '#1d1a28', tileText: '#F4F1EA' }
    : { bg: '#D7C49E', border: '#000000', text: '#080808', muted: 'rgba(8,8,8,0.62)', hair: 'rgba(8,8,8,0.2)', accent: '#343148', stroke: '#080808', tile: '#343148', tileText: '#F4F1EA' };
}

/* Live local time + difference from the visitor */
function useLocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TIMEZONE }).format(now);
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: TIMEZONE }).format(now));
  const diff = TZ_OFFSET_HOURS - -now.getTimezoneOffset() / 60;
  const diffText = diff === 0 ? 'Same time as you' : `${Math.abs(diff)}h ${diff > 0 ? 'ahead of' : 'behind'} you`;
  return { time, diffText, working: hour >= 9 && hour < 19 };
}

/* Masked line reveal */
function Reveal({ children, delay = 0, inView, style }) {
  return (
    // Negative margin cancels the extra padding, so spacing between lines stays the same
    <div style={{ overflow: 'hidden', marginBottom: '-0.12em' }}>
      <motion.div
        initial={{ y: '110%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 0.95, delay, ease: EASE }}
        style={{ ...style, paddingBottom: '0.24em', paddingTop: '0.04em' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Floating-label field */
function Field({ label, value, onChange, type = 'text', multiline, error, autoComplete }) {
  const [focus, setFocus] = useState(false);
  const up = focus || value.length > 0;
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ position: 'relative', paddingTop: 18 }}>
      <motion.label
        initial={false}
        animate={{ y: up ? 0 : 28, scale: up ? 0.82 : 1, color: error ? '#ff8f8f' : up ? GOLD : PANEL_MUTED }}
        transition={{ duration: 0.25, ease: EASE }}
        className="mono"
        style={{ position: 'absolute', top: 0, left: 0, fontSize: '0.75rem', letterSpacing: '0.12em', transformOrigin: 'left top', pointerEvents: 'none' }}
      >
        {label}
      </motion.label>
      <Tag
        type={multiline ? undefined : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        rows={multiline ? 4 : undefined}
        autoComplete={autoComplete}
        aria-label={label}
        aria-invalid={!!error}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: PANEL_TEXT,
          fontSize: '1.05rem',
          padding: '12px 0',
          resize: 'none',
          fontFamily: 'inherit',
          display: 'block',
        }}
      />
      <div style={{ position: 'relative', height: 1, backgroundColor: error ? '#ff8f8f' : 'rgba(244,241,234,0.15)' }}>
        <motion.div
          initial={false}
          animate={{ scaleX: focus ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
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
            style={{ fontSize: '0.62rem', color: '#ff8f8f', marginTop: 6, letterSpacing: '0.04em' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Quick action row (left column) */
function ActionRow({ href, icon, label, value, onClick, t, delay, inView, primary }) {
  const external = href?.startsWith('http');
  return (
    <motion.a
      href={href}
      onClick={onClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover="hover"
      style={{
        display: 'grid',
        gridTemplateColumns: '44px 1fr auto',
        alignItems: 'center',
        gap: 14,
        padding: '14px 0',
        borderBottom: `1px solid ${t.hair}`,
        textDecoration: 'none',
        color: t.text,
        cursor: 'pointer',
      }}
    >
      <motion.span
        variants={{ hover: { scale: 1.08 } }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          backgroundColor: primary ? t.accent : t.tile,
          color: primary ? t.bg : t.tileText,
        }}
      >
        {icon}
      </motion.span>
      <span style={{ minWidth: 0 }}>
        <span className="mono" style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.14em', color: t.muted }}>{label}</span>
        <span style={{ display: 'block', fontSize: '0.98rem', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
      </span>
      <motion.span variants={{ hover: { x: 3, y: -3 } }} transition={{ duration: 0.3 }} style={{ color: t.muted }}>
        <ArrowUpRight size={18} />
      </motion.span>
    </motion.a>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const isDark = useIsDark();
  const t = getTheme(isDark);
  const { time, diffText, working } = useLocalTime();

  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, amount: 0.35 });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [topic, setTopic] = useState(TOPICS[0]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);

  const waHref = useMemo(() => `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(WHATSAPP_TEXT)}`, []);

  // Mobile: one-tap actions, live local time, simple form
  if (isMobile) {
    return (
      <MobileContact
        isDark={isDark}
        sectionRef={sectionRef}
        emailConfig={{ serviceId: EMAILJS_SERVICE_ID, templateId: EMAILJS_TEMPLATE_ID, publicKey: EMAILJS_PUBLIC_KEY }}
      />
    );
  }

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
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name: form.name, email: form.email, message: `[${topic}] ${form.message}`, phone: '' },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('sent');
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

  const headline = { fontSize: 'clamp(2.8rem, 5.2vw, 5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ position: 'relative', padding: '9vw 6vw 8vw', backgroundColor: t.bg, borderTop: `1px solid ${t.border}` }}
    >
      <SectionLabel
        index="06"
        title="Contact"
        color={t.text}
        accent={t.accent}
        aside={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ position: 'relative', width: 8, height: 8 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: '#02b84b' }} />
              <motion.span
                animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: '#02b84b' }}
              />
            </span>
            AVAILABLE FOR WORK
          </span>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '6vw', alignItems: 'start' }}>
        {/* ── Left: headline, live info, direct actions ── */}
        <div ref={headRef}>
          <Reveal inView={headIn} delay={0.05} style={{ ...headline, color: t.accent }}>
            Let's build
          </Reveal>
          <Reveal inView={headIn} delay={0.15} style={{ ...headline, color: 'transparent', WebkitTextStroke: `1.5px ${t.stroke}` }}>
            something great<span style={{ color: t.accent, WebkitTextStroke: 0 }}>.</span>
          </Reveal>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headIn ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
            style={{ fontSize: '1.05rem', lineHeight: 1.7, color: t.muted, maxWidth: 460, margin: '1.5rem 0 2.25rem' }}
          >
            Open to full-time roles, freelance projects and collaborations across the UAE and beyond.
          </motion.p>

          {/* Live info strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headIn ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${t.hair}`, borderBottom: `1px solid ${t.hair}`, marginBottom: '1.5rem' }}
          >
            <div style={{ padding: '16px 16px 16px 0', borderRight: `1px solid ${t.hair}` }}>
              <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6rem', letterSpacing: '0.14em', color: t.muted }}>
                <MapPin size={12} /> DUBAI · LOCAL TIME
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: t.text, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{time}</div>
              <div className="mono" style={{ fontSize: '0.62rem', color: t.muted, marginTop: 2 }}>{diffText}</div>
            </div>
            <div style={{ padding: '16px 0 16px 18px' }}>
              <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6rem', letterSpacing: '0.14em', color: t.muted }}>
                <Clock size={12} /> RESPONSE
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: t.text, marginTop: 10, lineHeight: 1.3 }}>{RESPONSE_TIME}</div>
              <div className="mono" style={{ fontSize: '0.62rem', color: working ? (isDark ? '#3ddc84' : '#1f7a4a') : t.muted, marginTop: 4 }}>
                {working ? '● Online now' : '○ Outside working hours'}
              </div>
            </div>
          </motion.div>

          {/* Direct actions */}
          <div>
            <ActionRow href={waHref} icon={<MessageCircle size={19} />} label="WHATSAPP · FASTEST" value="Message me directly" t={t} delay={0.55} inView={headIn} primary />
            <ActionRow
              href={`mailto:${EMAIL}`}
              icon={<Mail size={19} />}
              label="EMAIL"
              value={EMAIL}
              t={t}
              delay={0.62}
              inView={headIn}
            />
            <ActionRow href={`tel:+${PHONE_RAW}`} icon={<Phone size={19} />} label="CALL" value={PHONE_DISPLAY} t={t} delay={0.69} inView={headIn} />
          </div>

          <motion.button
            type="button"
            onClick={copyEmail}
            initial={{ opacity: 0 }}
            animate={headIn ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mono"
            style={{
              marginTop: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 14px',
              borderRadius: 999,
              border: `1px dashed ${t.hair}`,
              background: 'transparent',
              color: copied ? (isDark ? '#3ddc84' : '#1f7a4a') : t.muted,
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'EMAIL COPIED' : 'COPY EMAIL ADDRESS'}
          </motion.button>
        </div>

        {/* ── Right: form ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          style={{
            position: 'relative',
            borderRadius: 28,
            backgroundColor: PANEL,
            padding: '2.75rem 2.75rem 2.5rem',
            boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ minHeight: 460, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: PANEL_TEXT }}
              >
                <svg width="88" height="88" viewBox="0 0 72 72" style={{ marginBottom: '1.5rem' }}>
                  <motion.circle cx="36" cy="36" r="33" fill="none" stroke={GOLD} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE }} />
                  <motion.path
                    d="M22 37 l10 10 l19 -21"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, delay: 0.55, ease: EASE }}
                  />
                </svg>
                <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ fontSize: '1.9rem', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
                  Message received.
                </motion.h3>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }} style={{ fontSize: '0.98rem', color: PANEL_MUTED, margin: 0, lineHeight: 1.7 }}>
                  Thanks {form.name.split(' ')[0]}. I'll get back to you at <span style={{ color: PANEL_TEXT }}>{form.email}</span> soon.
                </motion.p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: GOLD, marginBottom: 14 }}>
                  WHAT'S THIS ABOUT?
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.75rem' }}>
                  {TOPICS.map((tp) => {
                    const on = topic === tp;
                    return (
                      <motion.button
                        key={tp}
                        type="button"
                        onClick={() => setTopic(tp)}
                        whileTap={{ scale: 0.96 }}
                        aria-pressed={on}
                        style={{
                          padding: '9px 16px',
                          borderRadius: 999,
                          border: `1px solid ${on ? GOLD : 'rgba(244,241,234,0.18)'}`,
                          backgroundColor: on ? GOLD : 'transparent',
                          color: on ? '#1d1a28' : PANEL_TEXT,
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background-color 0.25s, color 0.25s, border-color 0.25s',
                        }}
                      >
                        {tp}
                      </motion.button>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 1.75rem' }}>
                  <Field label="YOUR NAME" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                  <Field label="YOUR EMAIL" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <Field label="TELL ME ABOUT IT" value={form.message} onChange={set('message')} error={errors.message} multiline />
                </div>

                {status === 'error' && (
                  <p className="mono" style={{ fontSize: '0.66rem', color: '#ff8f8f', margin: '16px 0 0', lineHeight: 1.6 }}>
                    Something went wrong. Please try again, or reach me on WhatsApp.
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: PANEL_MUTED }}>
                    {RESPONSE_TIME.toUpperCase()}
                  </span>
                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={status === 'sending' ? {} : { scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      height: 56,
                      padding: '0 30px',
                      borderRadius: 999,
                      border: 'none',
                      backgroundColor: GOLD,
                      color: '#1d1a28',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      cursor: status === 'sending' ? 'default' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
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
                          Send message <ArrowRight size={18} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}