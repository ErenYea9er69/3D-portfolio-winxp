'use client';

import XPIcon from '../XPIcon';
import { usePortfolioData } from '@/app/lib/usePortfolioData';

export default function AboutContent() {
  const { profile, isDbConnected } = usePortfolioData();

  return (
    <div style={{ maxWidth: '420px' }}>
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
            {isDbConnected && (
              <span style={{ fontSize: '8px', background: '#e8f5e9', color: '#2e7d32', padding: '1px 5px', borderRadius: '4px', border: '1px solid #a5d6a7' }}>
                Neon DB
              </span>
            )}
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
            {profile.education?.[0]?.subtitle || 'Trident Academy of Technology'}
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
