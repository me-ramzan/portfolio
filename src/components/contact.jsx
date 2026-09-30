import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EMAILJS_SERVICE_ID = 'service_bcyigug';
const EMAILJS_TEMPLATE_ID = 'template_pta6w9h';
const EMAILJS_PUBLIC_KEY = '_Y1OJswaMuBHliGao';
const EASE = [0.16, 1, 0.3, 1];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sliderValue, setSliderValue] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const isDragging = useRef(false);
  const trackRef = useRef(null);
  const handleElRef = useRef(null);
  const sectionRef = useRef(null);
  const formPanelRef = useRef(null);
  const contactItemsRef = useRef([]);
  const successRef = useRef(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const labelY = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), { stiffness: 100, damping: 24, mass: 0.6 });
  const underlineWidth = useTransform(scrollYProgress, [0, 0.4], ['0%', '100%']);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contactItemsRef.current,
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(
        formPanelRef.current,
        { boxShadow: '0 0px 0px rgba(0,0,0,0)' },
        {
          boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (sent && successRef.current) {
      gsap.fromTo(
        successRef.current.children,
        { opacity: 0, y: 16, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.7)' }
      );
    }
  }, [sent]);

  useEffect(() => {
    if (handleElRef.current) {
      gsap.to(handleElRef.current, {
        scale: isDragging.current ? 1.08 : 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [sliderValue]);

  const sendEmail = () => {
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields before confirming.');
      setConfirmed(false);
      setSliderValue(0);
      if (trackRef.current) {
        gsap.to(trackRef.current, { x: -8, duration: 0.08, repeat: 5, yoyo: true, ease: 'power1.inOut' });
      }
      return;
    }

    setSending(true);
    setError('');

    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { name: form.name, email: form.email, message: form.message, phone: '' },
      EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setSending(false);
        setSent(true);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        setSending(false);
        setError('Something went wrong. Please try again.');
        setConfirmed(false);
        setSliderValue(0);
      });
  };

  const handleDragStart = () => { isDragging.current = true; };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSliderValue(pct);
    if (pct > 85 && !confirmed) {
      setConfirmed(true);
      isDragging.current = false;
      sendEmail();
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (!confirmed) setSliderValue(0);
  };

  const handleTouchMove = (e) => {
    if (!trackRef.current) return;
    const touch = e.touches[0];
    const rect = trackRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSliderValue(pct);
    if (pct > 85 && !confirmed) {
      setConfirmed(true);
      sendEmail();
    }
  };

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const inputStyle = {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #2A2A2A',
    color: '#F4F1EA',
    fontSize: '1rem',
    padding: '14px 0',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s',
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        padding: isMobile ? '4rem 5vw' : '10vw 6vw',
        backgroundColor: '#D7C49E',
        borderTop: '1px solid #000000',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? '3rem' : '6rem', alignItems: 'start' }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <motion.span
            className="mono"
            style={{ color: '#000000', fontSize: '0.7rem', letterSpacing: '0.15em', display: 'inline-block', y: isMobile ? 0 : labelY }}
          >
            06 / CONTACT
          </motion.span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#4a4566', marginTop: '12px', marginBottom: '2rem', overflow: 'hidden' }}>
            <motion.div style={{ width: underlineWidth, height: '100%', backgroundColor: '#343148' }} />
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            <span style={{ color: '#343148' }}>Let's Build<br /></span>
            <span style={{ WebkitTextStroke: '1.5px #080808', color: 'transparent' }}>Something Great</span>
          </h2>
          <p style={{ color: '#000000', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Open to full-time roles, freelance projects, and collaborations across the UAE and beyond.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: <Mail size={14} />, text: 'me.ramzan.zulfiqar@gmail.com', href: 'mailto:me.ramzan.zulfiqar@gmail.com' },
              { icon: <Phone size={14} />, text: '+971 55 499 1245', href: 'tel:+971554991245' },
              { icon: <MapPin size={14} />, text: 'Dubai, United Arab Emirates', href: '#' },
            ].map((item, i) => (
              <a
                key={i}
                ref={(el) => (contactItemsRef.current[i] = el)}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#080808',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#343148'}
                onMouseLeave={e => e.currentTarget.style.color = '#080808'}
              >
                <span style={{ color: '#343148' }}>{item.icon}</span>
                {item.text}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          ref={formPanelRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{
            backgroundColor: '#343148',
            borderRadius: '8px',
            padding: isMobile ? '1.75rem' : '3rem',
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {sent ? (
            <div ref={successRef} style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ color: '#F4F1EA', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h3 style={{ color: '#F4F1EA', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Connection Confirmed</h3>
              <p style={{ color: '#9B9B8E', fontSize: '0.9rem' }}>Thanks {form.name}. I'll be in touch shortly.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2.5rem' }}>
                {[
                  { field: 'name', label: 'Your Name', type: 'text' },
                  { field: 'email', label: 'Your Email', type: 'email' },
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label className="mono" style={{ display: 'block', fontSize: '0.65rem', color: '#f8f8ed', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      {label.toUpperCase()}
                    </label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={handleChange(field)}
                      onFocus={(e) => gsap.to(e.target, { borderBottomColor: '#F4F1EA', duration: 0.3 })}
                      onBlur={(e) => gsap.to(e.target, { borderBottomColor: '#2A2A2A', duration: 0.3 })}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.65rem', color: '#f8f8ed', letterSpacing: '0.1em', marginBottom: '8px' }}>
                    MESSAGE
                  </label>
                  <textarea
                    value={form.message}
                    onChange={handleChange('message')}
                    onFocus={(e) => gsap.to(e.target, { borderBottomColor: '#F4F1EA', duration: 0.3 })}
                    onBlur={(e) => gsap.to(e.target, { borderBottomColor: '#2A2A2A', duration: 0.3 })}
                    placeholder="Describe your project or opportunity..."
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                  />
                </div>
              </div>

              {error && (
                <p style={{ color: '#ff8080', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>
              )}

              {/* Slider */}
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.65rem', color: '#9B9B8E', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  {confirmed ? (sending ? 'SENDING...' : '✓ CONNECTION CONFIRMED') : 'SLIDE TO CONFIRM CONNECTION '}
                </label>
                <div
                  ref={trackRef}
                  style={{
                    position: 'relative',
                    height: '52px',
                    backgroundColor: '#1A1A1A',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: confirmed ? '1px solid #000000' : '1px solid #2A2A2A',
                    transition: 'border-color 0.3s',
                    cursor: 'ew-resize',
                    userSelect: 'none',
                  }}
                  onTouchMove={handleTouchMove}
                >
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${sliderValue}%`,
                    backgroundColor: '#f4f1ea',
                    transition: confirmed ? 'none' : 'width 0.1s',
                  }} />
                  <div
                    ref={handleElRef}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    style={{
                      position: 'absolute',
                      left: `calc(${Math.min(sliderValue, 93)}% - 24px)`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '44px',
                      height: '36px',
                      backgroundColor: '#F4F1EA',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'grab',
                      transition: confirmed ? 'none' : 'left 0.05s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}
                  >
                    <span style={{ color: '#080808', fontSize: '0.7rem', fontWeight: 700 }}>››</span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}>
                    <span className="mono" style={{ fontSize: '0.65rem', color: confirmed ? '#F4F1EA' : '#9B9B8E', letterSpacing: '0.1em' }}>
                      {confirmed ? (sending ? 'DEPLOYING CONNECTION...' : 'SENT!') : 'CONFIRM CONNECTION'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}