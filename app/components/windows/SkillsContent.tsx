'use client';

import XPIcon from '../XPIcon';

const techStack = [
  { name: 'React', icon: '⚛️', color: '#61dafb' },
  { name: 'Next.js', icon: '▲', color: '#000' },
  { name: 'TypeScript', icon: '📘', color: '#3178c6' },
  { name: 'Node.js', icon: '🟢', color: '#339933' },
  { name: 'TailwindCSS', icon: '🎨', color: '#06b6d4' },
  { name: 'MongoDB', icon: '🍃', color: '#47a248' },
  { name: 'Git', icon: '📦', color: '#f05032' },
  { name: 'Rust', icon: '🦀', color: '#dea584' },
  { name: 'Tauri', icon: '🖥️', color: '#ffc131' },
];

const categories = [
  {
    name: 'Frontend',
    icon: '🎨',
    color: '#4a90d9',
    items: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'CSS3', 'HTML5'],
  },
  {
    name: 'Backend',
    icon: '⚙️',
    color: '#5cb85c',
    items: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'Prisma'],
  },
  {
    name: 'Tools & DevOps',
    icon: '🔧',
    color: '#f0ad4e',
    items: ['Git', 'GitHub', 'Vercel', 'VS Code', 'Vite', 'Docker'],
  },
  {
    name: 'Exploring',
    icon: '🚀',
    color: '#9b59b6',
    items: ['Rust', 'Tauri', 'AI/ML', 'WebSockets', 'PWA'],
  },
];

const videos = [
  { title: 'Track Your Coding time for free', url: 'https://youtu.be/tBatfQjWxCg' },
  { title: 'Fix multi-cursor in VS Code', url: 'https://youtu.be/E9h7M6ZK_tA' },
  { title: 'GitHub Copilot is now free!', url: 'https://www.youtube.com/watch?v=uIJOUe8T3_I' },
  { title: 'How to run DeepSeek R1 locally', url: 'https://youtu.be/BgB2pW6QgVg' },
];

export default function SkillsContent() {
  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '15px',
        paddingBottom: '12px',
        borderBottom: '2px solid #0a246a'
      }}>
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
        {categories.map(category => (
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
              {category.items.map(item => (
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

      {/* YouTube Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
        borderRadius: '6px',
        padding: '12px',
        color: 'white',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '10px'
        }}>
          <span style={{ fontSize: '18px' }}>📺</span>
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>YouTube Content</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {videos.map((video, i) => (
            <a 
              key={i}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'white',
                textDecoration: 'none',
                fontSize: '10px',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <span>▶</span>
              <span>{video.title}</span>
            </a>
          ))}
        </div>
        
        <a 
          href="https://youtube.com/@Star_Knight12" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '10px',
            padding: '6px',
            background: 'white',
            color: '#cc0000',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          Subscribe to Channel
        </a>
      </div>
    </div>
  );
}
