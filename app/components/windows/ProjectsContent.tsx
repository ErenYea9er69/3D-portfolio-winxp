'use client';

import XPIcon from '../XPIcon';
import { usePortfolioData } from '@/app/lib/usePortfolioData';

export default function ProjectsContent() {
  const { projects, isDbConnected } = usePortfolioData();

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
          <XPIcon src="/icons xp/Windows XP Icons/Folder Closed.png" size={28} alt="Projects" />
          <div>
            <h2 style={{ margin: 0, fontSize: '14px' }}>My Projects</h2>
            <p style={{ margin: '2px 0 0', color: '#666', fontSize: '10px' }}>
              {projects.length} items • Double-click to open
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

      {/* Project list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {projects.map(project => (
          <div 
            key={project.id} 
            className="xp-project-card"
            style={{ cursor: 'pointer' }}
            onDoubleClick={() => window.open(project.url, '_blank')}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ 
                fontSize: '28px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                borderRadius: '4px',
                border: '1px solid #d0d0d0',
                flexShrink: 0
              }}>
                {project.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ 
                  margin: '0 0 4px', 
                  fontSize: '12px',
                  color: '#0a246a'
                }}>
                  {project.name}
                </h3>
                <p style={{ 
                  margin: '0 0 8px', 
                  fontSize: '11px',
                  color: '#444',
                  lineHeight: 1.4
                }}>
                  {project.description}
                </p>
                <div className="xp-project-tags">
                  {(Array.isArray(project.tags) ? project.tags : []).map(tag => (
                    <span key={tag} className="xp-project-tag">{tag}</span>
                  ))}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ fontSize: '10px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    🌐 Visit Site
                  </a>
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '10px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      💻 Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info bar */}
      <div style={{ 
        marginTop: '12px', 
        padding: '8px 10px', 
        background: '#fffde8', 
        border: '1px solid #e8d54e',
        borderRadius: '2px',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ fontSize: '14px' }}>💡</span>
        <span><strong>Tip:</strong> Double-click a project to visit the live site!</span>
      </div>
    </div>
  );
}
