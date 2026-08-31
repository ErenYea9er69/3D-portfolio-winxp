'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  PortfolioProfile,
  Project,
  SkillCategory,
  TechItem,
  YoutubeVideo,
  PictureItem,
  WallpaperItem,
  MsnBuddy,
  UserDocument,
} from './db';

// Fallback defaults for instant 0ms initial render
const DEFAULT_PROFILE: PortfolioProfile = {
  id: 'main',
  name: 'Rayen Ben Aissa',
  title: 'Full Stack Developer',
  location: 'Tunisia',
  bio: "I've learned most of my lessons the hard way. Currently freelancing and collaborating with new people on exciting projects. I love playing video games, sharing thoughts on tech, and touch typing in my free time.",
  avatar_url: '/icons xp/Windows XP Icons/User Accounts.png',
  status: 'Available for work',
  education: [{ title: 'B.Tech in CS & IT', subtitle: 'Trident Academy of Technology' }],
  experience: [{ title: 'Freelance Developer', subtitle: 'v0 Ambassador by Vercel' }],
  achievements: [
    'Smart India Hackathon 2022 - EducationX',
    'Smart India Hackathon 2023 - NexusLink',
    'v0 Ambassador by Vercel',
  ],
  social_links: [
    { name: 'GitHub', icon: '💻', url: 'https://github.com/StarKnightt' },
    { name: 'Portfolio Source', icon: '⭐', url: 'https://github.com/StarKnightt/windows-xp-portfolio' },
    { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/prasenjitnayak/' },
    { name: 'X (Twitter)', icon: '🐦', url: 'https://x.com/Star_Knight12' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com/@Star_Knight12' },
    { name: 'CodePen', icon: '🎨', url: 'https://codepen.io/StarKnightt' },
    { name: 'Buy Me a Coffee', icon: '☕', url: 'https://buymeacoffee.com/prasen' },
  ],
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'CleanType',
    description: 'A super minimalist writing experience. Type with no noise and distraction, a fresh Windows app with clean UI.',
    tags: ['Rust', 'Tauri', 'TypeScript', 'React', 'Vite'],
    icon: '✍️',
    url: 'https://www.cleantype.software/',
    github: 'https://github.com/StarKnightt/CleanType',
    sort_order: 1,
  },
  {
    id: 2,
    name: 'Wallpaperz',
    description: 'A modern wallpaper discovery platform where you can find stunning wallpapers and generate images with AI.',
    tags: ['Next.js', 'TailwindCSS', 'Stability AI', 'TypeScript'],
    icon: '🖼️',
    url: 'https://www.wallpaperz.in/',
    github: 'https://github.com/StarKnightt/wallpaperz',
    sort_order: 2,
  },
  {
    id: 3,
    name: '3D Carousel Gallery',
    description: 'A beautiful and interactive 3D carousel gallery with image/video support and integrated music player.',
    tags: ['Next.js', 'CSS 3D', 'SoundCloud API'],
    icon: '🎠',
    url: 'https://3dcarousell.vercel.app/',
    github: 'https://github.com/StarKnightt/3D-Carousel',
    sort_order: 3,
  },
  {
    id: 4,
    name: 'GitHub Buddy Finder',
    description: 'Helps developers connect with like-minded individuals based on their GitHub activity and language preferences.',
    tags: ['React.js', 'Octokit', 'REST API', 'TailwindCSS'],
    icon: '🤝',
    url: 'https://buddy-find.vercel.app/',
    github: 'https://github.com/StarKnightt/Buddy-Finder',
    sort_order: 4,
  },
  {
    id: 5,
    name: 'Solar System',
    description: 'A visually stunning interactive web app that provides information about the solar system with music.',
    tags: ['React.js', 'CSS3', 'Vite'],
    icon: '🌍',
    url: 'https://solarrsystem.vercel.app/',
    sort_order: 5,
  },
  {
    id: 6,
    name: 'Coffee Website',
    description: 'A futuristic yet nostalgic coffee shop design with retro vibes and smooth animations.',
    tags: ['React.js', 'TailwindCSS', 'Framer Motion'],
    icon: '☕',
    url: 'https://coffee-websitee.vercel.app/',
    github: 'https://github.com/StarKnightt/Coffee-Website',
    sort_order: 6,
  },
  {
    id: 7,
    name: 'Resume Builder',
    description: 'Final year project - an interactive and versatile Dynamic CV Builder with backend functionality.',
    tags: ['MongoDB', 'Express.js', 'Node.js', 'JavaScript'],
    icon: '📄',
    url: 'https://builddresume.vercel.app/',
    github: 'https://github.com/StarKnightt/ResumeBuilder',
    sort_order: 7,
  },
];

const DEFAULT_TECH: TechItem[] = [
  { name: 'React', icon: '⚛️', color: '#61dafb', sort_order: 1 },
  { name: 'Next.js', icon: '▲', color: '#000', sort_order: 2 },
  { name: 'TypeScript', icon: '📘', color: '#3178c6', sort_order: 3 },
  { name: 'Node.js', icon: '🟢', color: '#339933', sort_order: 4 },
  { name: 'TailwindCSS', icon: '🎨', color: '#06b6d4', sort_order: 5 },
  { name: 'PostgreSQL & Neon', icon: '🐘', color: '#00e599', sort_order: 6 },
  { name: 'MongoDB', icon: '🍃', color: '#47a248', sort_order: 7 },
  { name: 'Git', icon: '📦', color: '#f05032', sort_order: 8 },
  { name: 'Rust', icon: '🦀', color: '#dea584', sort_order: 9 },
  { name: 'Tauri', icon: '🖥️', color: '#ffc131', sort_order: 10 },
];

const DEFAULT_SKILLS: SkillCategory[] = [
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

const DEFAULT_VIDEOS: YoutubeVideo[] = [
  { id: 1, title: 'Track Your Coding time for free', url: 'https://youtu.be/tBatfQjWxCg', sort_order: 1 },
  { id: 2, title: 'Fix multi-cursor in VS Code', url: 'https://youtu.be/E9h7M6ZK_tA', sort_order: 2 },
  { id: 3, title: 'GitHub Copilot is now free!', url: 'https://www.youtube.com/watch?v=uIJOUe8T3_I', sort_order: 3 },
  { id: 4, title: 'How to run DeepSeek R1 locally', url: 'https://youtu.be/BgB2pW6QgVg', sort_order: 4 },
];

const DEFAULT_PICTURES: PictureItem[] = [
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

let cachedBootstrap: {
  profile: PortfolioProfile;
  projects: Project[];
  skills: SkillCategory[];
  techStack: TechItem[];
  videos: YoutubeVideo[];
  wallpapers: WallpaperItem[];
  pictures: PictureItem[];
  buddies: MsnBuddy[];
  documents: UserDocument[];
} | null = null;

export function usePortfolioData() {
  const [profile, setProfile] = useState<PortfolioProfile>(cachedBootstrap?.profile || DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(cachedBootstrap?.projects || DEFAULT_PROJECTS);
  const [skills, setSkills] = useState<SkillCategory[]>(cachedBootstrap?.skills || DEFAULT_SKILLS);
  const [techStack, setTechStack] = useState<TechItem[]>(cachedBootstrap?.techStack || DEFAULT_TECH);
  const [videos, setVideos] = useState<YoutubeVideo[]>(cachedBootstrap?.videos || DEFAULT_VIDEOS);
  const [pictures, setPictures] = useState<PictureItem[]>(cachedBootstrap?.pictures || DEFAULT_PICTURES);
  const [isLoading, setIsLoading] = useState(!cachedBootstrap);
  const [isDbConnected, setIsDbConnected] = useState(true);

  const fetchBootstrapData = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio/bootstrap');
      if (!res.ok) throw new Error('Bootstrap API error');
      const json = await res.json();
      if (json.success && json.data) {
        cachedBootstrap = json.data;
        if (json.data.profile) setProfile(json.data.profile);
        if (json.data.projects?.length) setProjects(json.data.projects);
        if (json.data.skills?.length) setSkills(json.data.skills);
        if (json.data.techStack?.length) setTechStack(json.data.techStack);
        if (json.data.videos?.length) setVideos(json.data.videos);
        if (json.data.pictures?.length) setPictures(json.data.pictures);
        setIsDbConnected(true);
      }
    } catch (err) {
      console.warn('Using local cached/fallback data (DB fetch warning):', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBootstrapData();
  }, [fetchBootstrapData]);

  // Submit Contact message to Neon DB
  const submitContactMessage = async (data: { name: string; email: string; subject: string; message: string }) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  };

  // Save Document to Neon DB
  const saveDocument = async (doc: { id?: string; title: string; content: string; doc_type: 'notepad' | 'wordpad' }) => {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    return res.json();
  };

  // Load Document from Neon DB
  const loadDocument = async (id: string) => {
    const res = await fetch(`/api/documents?id=${encodeURIComponent(id)}`);
    return res.json();
  };

  // List Documents from Neon DB
  const listDocuments = async (docType?: 'notepad' | 'wordpad') => {
    const url = docType ? `/api/documents?type=${docType}` : '/api/documents';
    const res = await fetch(url);
    return res.json();
  };

  // Delete Document from Neon DB
  const deleteDocument = async (id: string) => {
    const res = await fetch(`/api/documents?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.json();
  };

  // Update Profile in Neon DB
  const updateProfile = async (data: Partial<PortfolioProfile>) => {
    const payload = { ...profile, ...data };
    const res = await fetch('/api/portfolio/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success && json.data) {
      setProfile(json.data);
      if (cachedBootstrap) {
        cachedBootstrap.profile = json.data;
      }
    }
    return json;
  };

  return {
    profile,
    projects,
    skills,
    techStack,
    videos,
    pictures,
    isLoading,
    isDbConnected,
    refetch: fetchBootstrapData,
    updateProfile,
    submitContactMessage,
    saveDocument,
    loadDocument,
    listDocuments,
    deleteDocument,
  };
}
