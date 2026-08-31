'use client';
import { useState, FormEvent } from 'react';
import XPIcon from '../XPIcon';
import { usePortfolioData } from '@/app/lib/usePortfolioData';

export default function ContactContent() {
  const { profile, submitContactMessage, isDbConnected } = usePortfolioData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveToDbSuccess, setSaveToDbSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Submit directly to Neon DB
      const dbResult = await submitContactMessage(formData);
      if (dbResult.success) {
        setSaveToDbSuccess(true);
      }
    } catch (err) {
      console.warn('DB submission error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleOpenMailClient = () => {
    const mailtoLink = `mailto:prasen.nayak@hotmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
    window.open(mailtoLink);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 20px' }}>
        <div style={{ 
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <XPIcon src="/icons xp/Windows XP Icons/OE Send and Receive.png" size={54} alt="Sent" />
        </div>
        <h2 style={{ color: '#0a246a', marginBottom: '8px', fontSize: '16px' }}>
          {saveToDbSuccess ? 'Message Saved to Neon Database!' : 'Message Sent!'}
        </h2>
        <p style={{ color: '#444', marginBottom: '15px', fontSize: '11px', lineHeight: 1.5 }}>
          {saveToDbSuccess ? (
            <>
              Your message was received and safely stored in the PostgreSQL database.
              <br />
              Thank you for reaching out!
            </>
          ) : (
            <>Complete sending the email in your mail app. I&apos;ll get back to you soon!</>
          )}
        </p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button 
            className="xp-button"
            onClick={handleOpenMailClient}
            style={{ fontSize: '11px' }}
          >
            ✉️ Also Open in Email App
          </button>
          <button 
            className="xp-button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', subject: '', message: '' });
            }}
            style={{ fontSize: '11px' }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <XPIcon src="/icons xp/Windows XP Icons/Email.png" size={28} alt="Contact" />
          <div>
            <h2 style={{ margin: 0, fontSize: '14px' }}>Contact Me</h2>
            <p style={{ margin: '2px 0 0', color: '#666', fontSize: '10px' }}>
              Let&apos;s connect and build something amazing!
            </p>
          </div>
        </div>
        {isDbConnected && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#e8f5e9',
            border: '1px solid #a5d6a7',
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '9px',
            color: '#2e7d32',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />
            Neon DB Live
          </div>
        )}
      </div>

      {/* Social Links */}
      <fieldset className="xp-fieldset">
        <legend>Social Links</legend>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '6px',
          fontSize: '11px'
        }}>
          {(profile.social_links || []).map(link => (
            <a 
              key={link.name}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                padding: '4px 6px',
                background: '#f8f8f8',
                border: '1px solid #ddd',
                borderRadius: '2px',
                color: '#0066cc',
                textDecoration: 'none'
              }}
            >
              <span>{link.icon}</span> {link.name}
            </a>
          ))}
        </div>
      </fieldset>

      {/* Direct Email */}
      <fieldset className="xp-fieldset">
        <legend>Direct Email</legend>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          padding: '8px',
          background: '#f0f8ff',
          border: '1px solid #b0d0ff',
          borderRadius: '2px'
        }}>
          <XPIcon src="/icons xp/Windows XP Icons/OE Create Mail.png" size={24} alt="Email" />
          <div>
            <a 
              href="mailto:prasen.nayak@hotmail.com"
              style={{ fontWeight: 'bold', fontSize: '12px' }}
            >
              prasen.nayak@hotmail.com
            </a>
            <p style={{ margin: '2px 0 0', color: '#666', fontSize: '10px' }}>
              Click to open in your email client
            </p>
          </div>
        </div>
      </fieldset>

      {/* Contact Form */}
      <form onSubmit={handleSubmit}>
        <fieldset className="xp-fieldset">
          <legend>Send Message to Database</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '3px', fontSize: '11px' }}>
                Your Name:
              </label>
              <input
                type="text"
                className="xp-input"
                style={{ width: '100%' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '3px', fontSize: '11px' }}>
                Your Email:
              </label>
              <input
                type="email"
                className="xp-input"
                style={{ width: '100%' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '11px' }}>
              Subject:
            </label>
            <input
              type="text"
              className="xp-input"
              style={{ width: '100%' }}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '11px' }}>
              Message:
            </label>
            <textarea
              className="xp-textarea"
              style={{ width: '100%', height: '70px' }}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button 
              type="button" 
              className="xp-button" 
              onClick={() => setFormData({ name: '', email: '', subject: '', message: '' })}
            >
              Clear
            </button>
            <button 
              type="submit" 
              className="xp-button"
              disabled={isSubmitting}
              style={{ fontWeight: 'bold', minWidth: '100px' }}
            >
              {isSubmitting ? 'Saving...' : '💾 Send to Cloud DB'}
            </button>
          </div>
        </fieldset>
      </form>

      <div style={{ 
        marginTop: '10px', 
        fontSize: '10px', 
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Looking forward to hearing from you! Messages are saved directly to Postgres. 🙌
      </div>
    </div>
  );
}
