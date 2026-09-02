const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL;

async function init() {
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not defined in .env or .env.local');
    process.exit(1);
  }
  console.log('Connecting to Neon PostgreSQL...');
  const sql = neon(DATABASE_URL);

  console.log('Creating tables...');

  // 1. System Assets table
  await sql`
    CREATE TABLE IF NOT EXISTS system_assets (
      id VARCHAR(500) PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      mime_type VARCHAR(100) NOT NULL,
      data TEXT NOT NULL,
      size_bytes INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  console.log('✔ system_assets table verified');

  // 2. Portfolio Profile
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_profile (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      title VARCHAR(100) NOT NULL,
      location VARCHAR(100) NOT NULL,
      bio TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      status VARCHAR(100) NOT NULL,
      education JSONB NOT NULL,
      experience JSONB NOT NULL,
      achievements JSONB NOT NULL,
      social_links JSONB NOT NULL,
      resume_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  console.log('✔ portfolio_profile table verified');

  // 3. Projects
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      tags JSONB NOT NULL,
      icon VARCHAR(20) NOT NULL,
      url TEXT NOT NULL,
      github TEXT,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  console.log('✔ projects table verified');

  // 4. Skills & Tech Stack
  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      icon VARCHAR(20) NOT NULL,
      color VARCHAR(30) NOT NULL,
      items JSONB NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tech_stack (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      icon VARCHAR(20) NOT NULL,
      color VARCHAR(30) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    );
  `;
  console.log('✔ skills & tech_stack tables verified');

  // 5. YouTube Videos
  await sql`
    CREATE TABLE IF NOT EXISTS youtube_videos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      url TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    );
  `;
  console.log('✔ youtube_videos table verified');

  // 6. Wallpapers
  await sql`
    CREATE TABLE IF NOT EXISTS wallpapers (
      id VARCHAR(50) PRIMARY KEY,
      label VARCHAR(100) NOT NULL,
      css TEXT NOT NULL,
      swatch TEXT NOT NULL,
      is_default BOOLEAN DEFAULT FALSE,
      sort_order INT NOT NULL DEFAULT 0
    );
  `;
  console.log('✔ wallpapers table verified');

  // 7. Pictures Gallery
  await sql`
    CREATE TABLE IF NOT EXISTS pictures (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      src TEXT NOT NULL,
      dimensions VARCHAR(50),
      size VARCHAR(50),
      sort_order INT NOT NULL DEFAULT 0
    );
  `;
  console.log('✔ pictures table verified');

  // 8. MSN Buddies & Messages
  await sql`
    CREATE TABLE IF NOT EXISTS msn_buddies (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      status VARCHAR(20) NOT NULL,
      status_text TEXT NOT NULL,
      avatar TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS msn_messages (
      id VARCHAR(100) PRIMARY KEY,
      buddy_id VARCHAR(50) NOT NULL,
      sender VARCHAR(20) NOT NULL,
      sender_name VARCHAR(100) NOT NULL,
      text TEXT NOT NULL,
      is_nudge BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  console.log('✔ msn_buddies & msn_messages tables verified');

  // 9. User Documents (Notepad & WordPad Cloud Docs)
  await sql`
    CREATE TABLE IF NOT EXISTS user_documents (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      doc_type VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  console.log('✔ user_documents table verified');

  // 10. Contact Messages
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      subject VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      is_read BOOLEAN DEFAULT FALSE
    );
  `;
  console.log('✔ contact_messages table verified');

  console.log('\n--- Seeding Initial Data ---');

  // Seed Profile
  await sql`
    INSERT INTO portfolio_profile (
      id, name, title, location, bio, avatar_url, status,
      education, experience, achievements, social_links, resume_url
    ) VALUES (
      'main',
      'Rayen Ben Aissa',
      'Full Stack Developer',
      'Tunisia',
      'I have learned most of my lessons the hard way. Currently freelancing and collaborating with new people on exciting projects. I love playing video games, sharing thoughts on tech, and touch typing in my free time.',
      '/icons xp/Windows XP Icons/User Accounts.png',
      'Available for work',
      '[{"title": "B.Tech in CS & IT", "subtitle": "Trident Academy of Technology"}]'::jsonb,
      '[{"title": "Freelance Developer", "subtitle": "v0 Ambassador by Vercel"}]'::jsonb,
      '["Smart India Hackathon 2022 - EducationX", "Smart India Hackathon 2023 - NexusLink", "v0 Ambassador by Vercel"]'::jsonb,
      '[
        {"name": "GitHub", "icon": "💻", "url": "https://github.com/StarKnightt"},
        {"name": "Portfolio Source", "icon": "⭐", "url": "https://github.com/StarKnightt/windows-xp-portfolio"},
        {"name": "LinkedIn", "icon": "💼", "url": "https://www.linkedin.com/in/prasenjitnayak/"},
        {"name": "X (Twitter)", "icon": "🐦", "url": "https://x.com/Star_Knight12"},
        {"name": "YouTube", "icon": "📺", "url": "https://youtube.com/@Star_Knight12"},
        {"name": "CodePen", "icon": "🎨", "url": "https://codepen.io/StarKnightt"},
        {"name": "Buy Me a Coffee", "icon": "☕", "url": "https://buymeacoffee.com/prasen"}
      ]'::jsonb,
      'https://github.com/StarKnightt'
    ) ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      title = EXCLUDED.title,
      bio = EXCLUDED.bio,
      education = EXCLUDED.education,
      experience = EXCLUDED.experience,
      achievements = EXCLUDED.achievements,
      social_links = EXCLUDED.social_links;
  `;
  console.log('✔ Seeded portfolio profile');

  // Seed Projects
  const projectsData = [
    {
      name: 'CleanType',
      description: 'A super minimalist writing experience. Type with no noise and distraction, a fresh Windows app with clean UI.',
      tags: ['Rust', 'Tauri', 'TypeScript', 'React', 'Vite'],
      icon: '✍️',
      url: 'https://www.cleantype.software/',
      github: 'https://github.com/StarKnightt/CleanType',
      sort_order: 1,
    },
    {
      name: 'Wallpaperz',
      description: 'A modern wallpaper discovery platform where you can find stunning wallpapers and generate images with AI.',
      tags: ['Next.js', 'TailwindCSS', 'Stability AI', 'TypeScript'],
      icon: '🖼️',
      url: 'https://www.wallpaperz.in/',
      github: 'https://github.com/StarKnightt/wallpaperz',
      sort_order: 2,
    },
    {
      name: '3D Carousel Gallery',
      description: 'A beautiful and interactive 3D carousel gallery with image/video support and integrated music player.',
      tags: ['Next.js', 'CSS 3D', 'SoundCloud API'],
      icon: '🎠',
      url: 'https://3dcarousell.vercel.app/',
      github: 'https://github.com/StarKnightt/3D-Carousel',
      sort_order: 3,
    },
    {
      name: 'GitHub Buddy Finder',
      description: 'Helps developers connect with like-minded individuals based on their GitHub activity and language preferences.',
      tags: ['React.js', 'Octokit', 'REST API', 'TailwindCSS'],
      icon: '🤝',
      url: 'https://buddy-find.vercel.app/',
      github: 'https://github.com/StarKnightt/Buddy-Finder',
      sort_order: 4,
    },
    {
      name: 'Solar System',
      description: 'A visually stunning interactive web app that provides information about the solar system with music.',
      tags: ['React.js', 'CSS3', 'Vite'],
      icon: '🌍',
      url: 'https://solarrsystem.vercel.app/',
      github: null,
      sort_order: 5,
    },
    {
      name: 'Coffee Website',
      description: 'A futuristic yet nostalgic coffee shop design with retro vibes and smooth animations.',
      tags: ['React.js', 'TailwindCSS', 'Framer Motion'],
      icon: '☕',
      url: 'https://coffee-websitee.vercel.app/',
      github: 'https://github.com/StarKnightt/Coffee-Website',
      sort_order: 6,
    },
    {
      name: 'Resume Builder',
      description: 'Final year project - an interactive and versatile Dynamic CV Builder with backend functionality.',
      tags: ['MongoDB', 'Express.js', 'Node.js', 'JavaScript'],
      icon: '📄',
      url: 'https://builddresume.vercel.app/',
      github: 'https://github.com/StarKnightt/ResumeBuilder',
      sort_order: 7,
    },
  ];

  await sql`DELETE FROM projects;`;
  for (const p of projectsData) {
    await sql`
      INSERT INTO projects (name, description, tags, icon, url, github, sort_order)
      VALUES (${p.name}, ${p.description}, ${JSON.stringify(p.tags)}, ${p.icon}, ${p.url}, ${p.github}, ${p.sort_order});
    `;
  }
  console.log('✔ Seeded projects');

  // Seed Tech Stack
  const techStackData = [
    { name: 'React', icon: '⚛️', color: '#61dafb', sort_order: 1 },
    { name: 'Next.js', icon: '▲', color: '#000000', sort_order: 2 },
    { name: 'TypeScript', icon: '📘', color: '#3178c6', sort_order: 3 },
    { name: 'Node.js', icon: '🟢', color: '#339933', sort_order: 4 },
    { name: 'TailwindCSS', icon: '🎨', color: '#06b6d4', sort_order: 5 },
    { name: 'PostgreSQL & Neon', icon: '🐘', color: '#00e599', sort_order: 6 },
    { name: 'MongoDB', icon: '🍃', color: '#47a248', sort_order: 7 },
    { name: 'Git', icon: '📦', color: '#f05032', sort_order: 8 },
    { name: 'Rust', icon: '🦀', color: '#dea584', sort_order: 9 },
    { name: 'Tauri', icon: '🖥️', color: '#ffc131', sort_order: 10 },
  ];

  await sql`DELETE FROM tech_stack;`;
  for (const t of techStackData) {
    await sql`
      INSERT INTO tech_stack (name, icon, color, sort_order)
      VALUES (${t.name}, ${t.icon}, ${t.color}, ${t.sort_order});
    `;
  }

  // Seed Skills categories
  const categoriesData = [
    {
      name: 'Frontend',
      icon: '🎨',
      color: '#4a90d9',
      items: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'CSS3', 'HTML5'],
      sort_order: 1,
    },
    {
      name: 'Backend & Databases',
      icon: '⚙️',
      color: '#5cb85c',
      items: ['Node.js', 'Express.js', 'Neon PostgreSQL', 'REST APIs', 'MongoDB', 'Prisma'],
      sort_order: 2,
    },
    {
      name: 'Tools & DevOps',
      icon: '🔧',
      color: '#f0ad4e',
      items: ['Git', 'GitHub', 'Vercel', 'VS Code', 'Vite', 'Docker'],
      sort_order: 3,
    },
    {
      name: 'Exploring',
      icon: '🚀',
      color: '#9b59b6',
      items: ['Rust', 'Tauri', 'AI/ML', 'WebSockets', 'PWA'],
      sort_order: 4,
    },
  ];

  await sql`DELETE FROM skills;`;
  for (const c of categoriesData) {
    await sql`
      INSERT INTO skills (name, icon, color, items, sort_order)
      VALUES (${c.name}, ${c.icon}, ${c.color}, ${JSON.stringify(c.items)}, ${c.sort_order});
    `;
  }
  console.log('✔ Seeded skills and tech stack');

  // Seed YouTube Videos
  const videosData = [
    { title: 'Track Your Coding time for free', url: 'https://youtu.be/tBatfQjWxCg', sort_order: 1 },
    { title: 'Fix multi-cursor in VS Code', url: 'https://youtu.be/E9h7M6ZK_tA', sort_order: 2 },
    { title: 'GitHub Copilot is now free!', url: 'https://www.youtube.com/watch?v=uIJOUe8T3_I', sort_order: 3 },
    { title: 'How to run DeepSeek R1 locally', url: 'https://youtu.be/BgB2pW6QgVg', sort_order: 4 },
  ];

  await sql`DELETE FROM youtube_videos;`;
  for (const v of videosData) {
    await sql`
      INSERT INTO youtube_videos (title, url, sort_order)
      VALUES (${v.title}, ${v.url}, ${v.sort_order});
    `;
  }
  console.log('✔ Seeded youtube videos');

  // Seed Wallpapers
  const wallpapersData = [
    {
      id: 'bliss',
      label: 'Bliss (Default)',
      css: 'url(/windows_xp_original-wallpaper-1920x1080.jpg) center/cover no-repeat',
      swatch: 'linear-gradient(180deg, #5fa8e0 0%, #74b843 60%, #3f8f2a 100%)',
      is_default: true,
      sort_order: 1,
    },
    {
      id: 'azul',
      label: 'Azul',
      css: 'linear-gradient(160deg, #0a3d91 0%, #1465c7 40%, #2f8fe0 70%, #7ec8f5 100%)',
      swatch: 'linear-gradient(160deg, #0a3d91 0%, #7ec8f5 100%)',
      is_default: false,
      sort_order: 2,
    },
    {
      id: 'autumn',
      label: 'Autumn',
      css: 'linear-gradient(160deg, #3c2a14 0%, #7a4a1e 45%, #c07830 75%, #e7a94d 100%)',
      swatch: 'linear-gradient(160deg, #3c2a14 0%, #e7a94d 100%)',
      is_default: false,
      sort_order: 3,
    },
    {
      id: 'redmoon',
      label: 'Red Moon Desert',
      css: 'linear-gradient(160deg, #200a0a 0%, #5c1414 45%, #9c2b1f 75%, #d97a3d 100%)',
      swatch: 'linear-gradient(160deg, #200a0a 0%, #d97a3d 100%)',
      is_default: false,
      sort_order: 4,
    },
    {
      id: 'classic',
      label: 'Windows Classic',
      css: '#008080',
      swatch: '#008080',
      is_default: false,
      sort_order: 5,
    },
    {
      id: 'none',
      label: 'None (Solid Navy)',
      css: '#003399',
      swatch: '#003399',
      is_default: false,
      sort_order: 6,
    },
  ];

  await sql`DELETE FROM wallpapers;`;
  for (const w of wallpapersData) {
    await sql`
      INSERT INTO wallpapers (id, label, css, swatch, is_default, sort_order)
      VALUES (${w.id}, ${w.label}, ${w.css}, ${w.swatch}, ${w.is_default}, ${w.sort_order});
    `;
  }
  console.log('✔ Seeded wallpapers');

  // Seed Pictures
  const picturesData = [
    {
      id: 'bliss',
      title: 'Bliss (Windows XP Wallpaper).jpg',
      src: '/windows_xp_original-wallpaper-1920x1080.jpg',
      dimensions: '1920 x 1080',
      size: '562 KB',
      sort_order: 1,
    },
    {
      id: 'og',
      title: '3D Portfolio Showcase.png',
      src: '/og.png',
      dimensions: '1200 x 630',
      size: '1.65 MB',
      sort_order: 2,
    },
    {
      id: 'alien',
      title: 'Alien Dance Animation.gif',
      src: '/alien-dance.gif',
      dimensions: '400 x 400',
      size: '1.11 MB',
      sort_order: 3,
    },
    {
      id: 'goku',
      title: 'Goku Retro Animation.gif',
      src: '/goku.gif',
      dimensions: '320 x 240',
      size: '189 KB',
      sort_order: 4,
    },
    {
      id: 'dance',
      title: 'Retro XP Dancing.gif',
      src: '/dance.gif',
      dimensions: '300 x 300',
      size: '375 KB',
      sort_order: 5,
    },
    {
      id: 'sleep',
      title: 'Sleeping Cat.gif',
      src: '/sleep.gif',
      dimensions: '450 x 300',
      size: '1.89 MB',
      sort_order: 6,
    },
  ];

  await sql`DELETE FROM pictures;`;
  for (const pic of picturesData) {
    await sql`
      INSERT INTO pictures (id, title, src, dimensions, size, sort_order)
      VALUES (${pic.id}, ${pic.title}, ${pic.src}, ${pic.dimensions}, ${pic.size}, ${pic.sort_order});
    `;
  }
  console.log('✔ Seeded pictures gallery');

  // Seed MSN Buddies
  const buddiesData = [
    {
      id: 'prasenjit',
      name: 'Rayen Ben Aissa (Dev)',
      status: 'online',
      status_text: '⚡ Building fast web apps | Available for hire!',
      avatar: '/icons xp/Windows XP Icons/User Accounts.png',
      sort_order: 1,
    },
    {
      id: 'clippy',
      name: 'Clippy',
      status: 'online',
      status_text: '📎 It looks like you are exploring a portfolio...',
      avatar: '/icons xp/Windows XP Icons/Help and Support.png',
      sort_order: 2,
    },
    {
      id: 'billg',
      name: 'Bill G.',
      status: 'away',
      status_text: '🖥️ 640K ought to be enough for anybody',
      avatar: '/icons xp/Windows XP Icons/My Computer.png',
      sort_order: 3,
    },
    {
      id: 'bonzi',
      name: 'Bonzi Buddy',
      status: 'offline',
      status_text: 'Hello there, friend!',
      avatar: '/icons xp/Windows XP Icons/Game Controller.png',
      sort_order: 4,
    },
  ];

  await sql`DELETE FROM msn_buddies;`;
  for (const b of buddiesData) {
    await sql`
      INSERT INTO msn_buddies (id, name, status, status_text, avatar, sort_order)
      VALUES (${b.id}, ${b.name}, ${b.status}, ${b.status_text}, ${b.avatar}, ${b.sort_order});
    `;
  }
  console.log('✔ Seeded MSN buddies');

  // Seed Default Documents
  const defaultDocs = [
    {
      id: 'welcome-notepad',
      title: 'Welcome.txt',
      content: `Welcome to Rayen Ben Aissa's Windows XP Portfolio!

Everything you see is powered by Next.js and backed live by Neon PostgreSQL.
Feel free to create new text files, save them to the cloud database, or explore the applications!

Contact: prasen.nayak@hotmail.com
GitHub: https://github.com/StarKnightt`,
      doc_type: 'notepad',
    },
    {
      id: 'welcome-wordpad',
      title: 'Resume_Overview.rtf',
      content: `RAYEN BEN AISSA - FULL STACK DEVELOPER
Location: Tunisia
Education: B.Tech in CS & IT (Trident Academy of Technology)

Key Highlights:
- v0 Ambassador by Vercel
- Smart India Hackathon Winner (2022 & 2023)
- Experienced with Next.js, React, Node.js, PostgreSQL, TypeScript, Rust & Tauri

Feel free to reach out for freelance work or full-time opportunities!`,
      doc_type: 'wordpad',
    },
  ];

  for (const d of defaultDocs) {
    await sql`
      INSERT INTO user_documents (id, title, content, doc_type)
      VALUES (${d.id}, ${d.title}, ${d.content}, ${d.doc_type})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content;
    `;
  }
  console.log('✔ Seeded default documents');

  console.log('\n✅ Database schema initialization and data seeding completed successfully!');
}

init().catch((err) => {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
});
