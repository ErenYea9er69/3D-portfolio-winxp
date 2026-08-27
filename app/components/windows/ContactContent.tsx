'use client';
import { useState, FormEvent } from 'react';
const socialLinks = [
  { name: 'GitHub', icon: '💻', url: 'https://github.com/StarKnightt' },
  { name: 'Portfolio Source', icon: '⭐', url: 'https://github.com/StarKnightt/windows-xp-portfolio' },
  { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/prasenjitnayak/' },
  { name: 'X (Twitter)', icon: '🐦', url: 'https://x.com/Star_Knight12' },
  { name: 'YouTube', icon: '📺', url: 'https://youtube.com/@Star_Knight12' },
  { name: 'CodePen', icon: '🎨', url: 'https://codepen.io/StarKnightt' },
  { name: 'Buy Me a Coffee', icon: '☕', url: 'https://buymeacoffee.com/prasen' },
];

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Open email client with pre-filled data
    const mailtoLink = `mailto:prasen.nayak@hotmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
    window.open(mailtoLink);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '15px',
        }}>
          ✉️
        </div>
        <h2 style={{ color: '#0a246a', marginBottom: '10px' }}>Email Client Opened!</h2>
        <p style={{ color: '#444', marginBottom: '20px' }}>
          Complete sending the email in your mail app.<br />
          I&apos;ll get back to you soon!
        </p>
        <button 
          className="xp-button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <span style={{ fontSize: '24px' }}>📧</span>
        <div>
          <h2 style={{ margin: 0, fontSize: '14px' }}>Contact Me</h2>
          <p style={{ margin: '2px 0 0', color: '#666', fontSize: '10px' }}>
            Let&apos;s connect and build something amazing!
          </p>
        </div>
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
          {socialLinks.map(link => (
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
          gap: '8px',
          padding: '8px',
          background: '#f0f8ff',
          border: '1px solid #b0d0ff',
          borderRadius: '2px'
        }}>
          <span style={{ fontSize: '20px' }}>📧</span>
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
          <legend>Quick Message</legend>
          
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
            <button type="submit" className="xp-button">
              📤 Send via Email
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
        Looking forward to hearing from you! 🙌
      </div>
    </div>
  );
}
