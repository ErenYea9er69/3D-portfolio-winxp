'use client';

import XPIcon from '../XPIcon';
import { usePortfolioData } from '@/app/lib/usePortfolioData';

export default function SkillsContent() {
  const { skills, techStack, videos, isDbConnected } = usePortfolioData();

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '15px',
        paddingBottom: '12px',
        borderBottom: '2px solid #0a246a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #0078d4 0%, #0a246a 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <XPIcon src="/icons xp/Windows XP Icons/Performance.png" size={30} alt="Tech Stack" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', color: '#0a246a' }}>Tech Stack</h2>
            <p style={{ margin: '2px 0 0', color: '#666', fontSize: '11px' }}>
              Technologies I work with
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

      {/* Main Tech Icons */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px',
        justifyContent: 'center',
        padding: '15px',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '6px',
        marginBottom: '15px',
        border: '1px solid #dee2e6'
      }}>
        {techStack.map(tech => (
          <div 
            key={tech.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 12px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              minWidth: '65px',
              cursor: 'default',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
            <span style={{ fontSize: '20px' }}>{tech.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: 500, color: '#333' }}>{tech.name}</span>
          </div>
        ))}
      </div>

      {/* Skill Categories */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '10px',
        marginBottom: '15px'
      }}>
        {skills.map(category => (
          <div 
            key={category.name}
            style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <div style={{ 
              background: category.color,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ fontSize: '14px' }}>{category.icon}</span>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '11px' }}>
                {category.name}
              </span>
            </div>
            <div style={{ 
              padding: '10px',
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '4px' 
            }}>
              {(Array.isArray(category.items) ? category.items : []).map(item => (
                <span 
                  key={item}
                  style={{
                    background: '#f5f5f5',
                    padding: '3px 8px',
                    fontSize: '10px',
                    borderRadius: '10px',
                    border: '1px solid #e8e8e8',
                    color: '#444'
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
