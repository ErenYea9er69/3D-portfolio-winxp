'use client';

import { useState } from 'react';
import XPIcon from '../XPIcon';
import { usePortfolioData } from '@/app/lib/usePortfolioData';

export default function AboutContent() {
  const { profile, updateProfile, isDbConnected } = usePortfolioData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: profile.name,
    title: profile.title,
    location: profile.location,
    bio: profile.bio,
    status: profile.status,
  });

  const handleOpenEdit = () => {
    setFormData({
      name: profile.name,
      title: profile.title,
      location: profile.location,
      bio: profile.bio,
      status: profile.status,
    });
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setIsEditing(false);
          setSaveSuccess(false);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', position: 'relative' }}>
      {/* Profile Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px',
        marginBottom: '15px',
        padding: '15px',
        background: 'linear-gradient(135deg, #e8f4ff 0%, #d0e8ff 100%)',
        borderRadius: '8px',
        border: '1px solid #b8d4f0',
        position: 'relative',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #0078d4 0%, #0a246a 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '3px solid #fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          padding: '6px',
        }}>
          <XPIcon src={profile.avatar_url || '/icons xp/Windows XP Icons/User Accounts.png'} size={54} alt={profile.name} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0a246a', fontWeight: 'bold' }}>
              {profile.name}
            </h2>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button
                className="xp-button"
                onClick={handleOpenEdit}
                style={{ fontSize: '9px', padding: '1px 6px' }}
                title="Edit profile in Neon DB"
              >
                ✏️ Edit Info
              </button>
              {isDbConnected && (
                <span style={{ fontSize: '8px', background: '#e8f5e9', color: '#2e7d32', padding: '1px 5px', borderRadius: '4px', border: '1px solid #a5d6a7' }}>
                  Neon DB
                </span>
              )}
            </div>
          </div>
          <p style={{ margin: 0, color: '#0078d4', fontSize: '12px', fontWeight: 500 }}>
            {profile.title}
          </p>
          <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            📍 {profile.location}
          </p>
          <div style={{ 
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#d4edda',
            color: '#155724',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 500
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              background: '#28a745',
              borderRadius: '50%',
            }} />
            {profile.status}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '380px',
            background: '#ece9d8',
            border: '2px solid #0055ea',
            borderRadius: '6px 6px 0 0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}>
            {/* Modal Title bar */}
            <div style={{
              background: 'linear-gradient(180deg, #0058ee 0%, #3593ff 4%, #288eff 6%, #0055ea 10%, #0055ea 90%, #0040b8 100%)',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
            }}>
              <span>Edit Profile & Location (Neon PostgreSQL)</span>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  background: '#d13824',
                  border: '1px solid #fff',
                  color: 'white',
                  borderRadius: '3px',
                  width: '18px',
                  height: '18px',
                  lineHeight: '14px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} style={{ padding: '12px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                  Full Name:
                </label>
                <input
                  type="text"
                  className="xp-input"
                  style={{ width: '100%' }}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                  Title / Profession:
                </label>
                <input
                  type="text"
                  className="xp-input"
                  style={{ width: '100%' }}
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                  Location / Place of Work:
                </label>
                <input
                  type="text"
                  className="xp-input"
                  style={{ width: '100%' }}
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                  Status:
                </label>
                <input
                  type="text"
                  className="xp-input"
                  style={{ width: '100%' }}
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                  Biography:
                </label>
                <textarea
                  className="xp-textarea"
                  style={{ width: '100%', height: '60px' }}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  required
                />
              </div>

              {saveSuccess && (
                <div style={{ marginBottom: '10px', color: '#155724', background: '#d4edda', padding: '4px', borderRadius: '4px', fontSize: '11px', textAlign: 'center' }}>
                  ✔ Saved to Neon Database successfully!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="xp-button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="xp-button"
                  style={{ fontWeight: 'bold' }}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving to DB...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bio */}
      <div style={{ 
        fontSize: '11px', 
        lineHeight: 1.7, 
        marginBottom: '15px',
        color: '#444'
      }}>
        <p style={{ margin: '0 0 10px' }}>
          {profile.bio}
        </p>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          padding: '10px',
        }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Education</div>
          <div style={{ fontSize: '11px', fontWeight: 500, color: '#333' }}>
            {profile.education?.[0]?.title || 'B.Tech in CS & IT'}
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>
            {profile.education?.[0]?.subtitle || 'University Degree'}
          </div>
        </div>
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          padding: '10px',
        }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Experience</div>
          <div style={{ fontSize: '11px', fontWeight: 500, color: '#333' }}>
            {profile.experience?.[0]?.title || 'Freelance Developer'}
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>
            {profile.experience?.[0]?.subtitle || 'v0 Ambassador by Vercel'}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{
        background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)',
        border: '1px solid #ffc107',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '15px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#856404', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🏆 Achievements
        </div>
        <div style={{ fontSize: '11px', color: '#856404' }}>
          {(profile.achievements || []).map((ach, idx) => (
            <div key={idx} style={{ marginBottom: '4px' }}>• {ach}</div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div style={{ 
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {(profile.social_links || []).slice(0, 3).map((link, idx) => (
          <button 
            key={idx}
            className="xp-button"
            onClick={() => window.open(link.url, '_blank')}
            style={{ flex: 1 }}
          >
            {link.icon} {link.name}
          </button>
        ))}
      </div>

      {/* Portfolio Source */}
      <button 
        className="xp-button"
        onClick={() => window.open('https://github.com/StarKnightt/windows-xp-portfolio', '_blank')}
        style={{ 
          width: '100%', 
          marginTop: '8px',
          background: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
          color: '#fff',
          border: '1px solid #444',
        }}
      >
        ⭐ View Portfolio Source Code
      </button>

      <p style={{ 
        fontSize: '9px', 
        color: '#888', 
        textAlign: 'center', 
        marginTop: '15px',
        paddingTop: '10px',
        borderTop: '1px solid #e0e0e0'
      }}>
        © {new Date().getFullYear()} {profile.name} • Windows XP Portfolio Edition (Neon DB)
      </p>
    </div>
  );
}
