'use client';

import XPIcon from '../XPIcon';

const projects = [
  {
    id: 1,
    name: 'CleanType',
    description: 'A super minimalist writing experience. Type with no noise and distraction, a fresh Windows app with clean UI.',
    tags: ['Rust', 'Tauri', 'TypeScript', 'React', 'Vite'],
    icon: '✍️',
    url: 'https://www.cleantype.software/',
    github: 'https://github.com/StarKnightt/CleanType',
  },
  {
    id: 2,
    name: 'Wallpaperz',
    description: 'A modern wallpaper discovery platform where you can find stunning wallpapers and generate images with AI.',
    tags: ['Next.js', 'TailwindCSS', 'Stability AI', 'TypeScript'],
    icon: '🖼️',
    url: 'https://www.wallpaperz.in/',
    github: 'https://github.com/StarKnightt/wallpaperz',
  },
  {
    id: 3,
    name: '3D Carousel Gallery',
    description: 'A beautiful and interactive 3D carousel gallery with image/video support and integrated music player.',
    tags: ['Next.js', 'CSS 3D', 'SoundCloud API'],
    icon: '🎠',
    url: 'https://3dcarousell.vercel.app/',
    github: 'https://github.com/StarKnightt/3D-Carousel',
  },
  {
    id: 4,
    name: 'GitHub Buddy Finder',
    description: 'Helps developers connect with like-minded individuals based on their GitHub activity and language preferences.',
    tags: ['React.js', 'Octokit', 'REST API', 'TailwindCSS'],
    icon: '🤝',
    url: 'https://buddy-find.vercel.app/',
    github: 'https://github.com/StarKnightt/Buddy-Finder',
  },
  {
    id: 5,
    name: 'Solar System',
    description: 'A visually stunning interactive web app that provides information about the solar system with music.',
    tags: ['React.js', 'CSS3', 'Vite'],
    icon: '🌍',
    url: 'https://solarrsystem.vercel.app/',
  },
  {
    id: 6,
    name: 'Coffee Website',
    description: 'A futuristic yet nostalgic coffee shop design with retro vibes and smooth animations.',
    tags: ['React.js', 'TailwindCSS', 'Framer Motion'],
    icon: '☕',
    url: 'https://coffee-websitee.vercel.app/',
    github: 'https://github.com/StarKnightt/Coffee-Website',
  },
  {
    id: 7,
    name: 'Resume Builder',
    description: 'Final year project - an interactive and versatile Dynamic CV Builder with backend functionality.',
    tags: ['MongoDB', 'Express.js', 'Node.js', 'JavaScript'],
    icon: '📄',
    url: 'https://builddresume.vercel.app/',
    github: 'https://github.com/StarKnightt/ResumeBuilder',
  },
];

export default function ProjectsContent() {
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
        <XPIcon src="/icons xp/Windows XP Icons/Folder Closed.png" size={28} alt="Projects" />
        <div>
          <h2 style={{ margin: 0, fontSize: '14px' }}>My Projects</h2>
          <p style={{ margin: '2px 0 0', color: '#666', fontSize: '10px' }}>
            {projects.length} items • Double-click to open
          </p>
        </div>
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
                  {project.tags.map(tag => (
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
