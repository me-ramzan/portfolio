import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sliderValue, setSliderValue] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [sent, setSent] = useState(false);
  const isDragging = useRef(false);
  const trackRef = useRef(null);

  const handleDragStart = () => { isDragging.current = true; };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSliderValue(pct);
    if (pct > 85) {
      setConfirmed(true);
      isDragging.current = false;
      setTimeout(() => setSent(true), 400);
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
    if (pct > 85) {
      setConfirmed(true);
      setTimeout(() => setSent(true), 400);
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
      style={{
        padding: '10vw 6vw',
        backgroundColor: '#D7C49E',
        borderTop: '1px solid #000000',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6rem', alignItems: 'start' }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mono" style={{ color: '#000000', fontSize: '0.7rem', letterSpacing: '0.15em' }}>06 / CONTACT</span>
          <div style={{ width: '32px', height: '2px', backgroundColor: '#343148', marginTop: '12px', marginBottom: '2rem' }} />
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

          <div style={{ display: 'flex', gap: '12px', marginTop: '2.5rem' }}>
            {[
  { icon: <FaLinkedin size={16} />, href: 'https://www.linkedin.com/in/muhammad-ramzan-111576246/' },
  { icon: <FaGithub size={16} />, href: 'https://github.com/me-ramzan' },
  ].map((s, i) => (
    <a
      key={i}
        href={s.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '44px',
          height: '44px',
          border: '1.5px solid #000000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#080808',
          textDecoration: 'none',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.color = '#020303'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#010000'; e.currentTarget.style.color = '#080808'; }}
        >
          <motion.span
            whileHover={{ scale: 1.3 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {s.icon}
          </motion.span>
     </a>
  ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            backgroundColor: '#343148',
            borderRadius: '8px',
            padding: '3rem',
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {sent ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{  color: '#F4F1EA', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
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
                    placeholder="Describe your project or opportunity..."
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '100px',
                    }}
                  />
                </div>
              </div>

              {/* Slider */}
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.65rem', color: '#9B9B8E', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  {confirmed ? '✓ CONNECTION CONFIRMED' : 'SLIDE TO CONFIRM CONNECTION '}
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
                  {/* Fill */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${sliderValue}%`,
                    backgroundColor: confirmed ? '#f4f1ea' : '#f4f1ea',
                    transition: confirmed ? 'none' : 'width 0.1s',
                  }} />
                  {/* Handle */}
                  <div
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
                  {/* Center text */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}>
                    <span className="mono" style={{ fontSize: '0.65rem', color: confirmed ? '#F4F1EA' : '#9B9B8E', letterSpacing: '0.1em' }}>
                      {confirmed ? 'DEPLOYING CONNECTION...' : 'CONFIRM CONNECTION'}
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