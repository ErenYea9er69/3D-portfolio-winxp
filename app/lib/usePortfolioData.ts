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
  bio: "",
  avatar_url: '/icons xp/Windows XP Icons/User Accounts.png',
  status: 'Available for work',
  education: [{ title: 'B.Tech in CS & IT', subtitle: '' }],
  experience: [{ title: 'Freelance Developer', subtitle: '' }],
  achievements: [],
  social_links: [
    { name: 'GitHub', icon: '💻', url: 'https://github.com/ErenYea9er69' },
    { name: 'Portfolio Source', icon: '⭐', url: 'https://github.com/ErenYea9er69/3D-portfolio-winxp' },
    { name: 'X (Twitter)', icon: '🐦', url: 'https://x.com/ErenYea9er' },
  ],
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'MyNet',
    description: 'Windows networking tool (C# / .NET 8) that scans your local network, discovers devices, and lets you block or throttle their bandwidth using ARP spoofing / Layer-2 techniques.',
    tags: ['C#', '.NET 8', 'Windows'],
    icon: '🛜',
    url: 'https://github.com/ErenYea9er69/MyNet',
    github: 'https://github.com/ErenYea9er69/MyNet',
    sort_order: 1,
  },
  {
    id: 2,
    name: 'ScopyAI',
    description: 'Next.js web app for Scopy (AI-powered product). Uses OpenAI, Supabase, Tavily search, and PDF generation — an AI assistant / research or content tool.',
    tags: ['Next.js', 'OpenAI', 'Supabase'],
    icon: '🤖',
    url: 'https://github.com/ErenYea9er69/ScopyAI',
    github: 'https://github.com/ErenYea9er69/ScopyAI',
    sort_order: 2,
  },
  {
    id: 3,
    name: 'anime-site (Tsune)',
    description: 'Next.js anime streaming / browsing site that pulls data via Consumet API, with video player support (Vidstack/HLS), Prisma, auth, and a modern UI.',
    tags: ['Next.js', 'Prisma', 'Vidstack'],
    icon: '🎬',
    url: 'https://anime-site-d5x9.vercel.app/',
    github: 'https://github.com/ErenYea9er69/anime-site',
    sort_order: 3,
  },
  {
    id: 4,
    name: '3D-portfolio-winxp',
    description: 'Interactive Windows XP-themed personal portfolio built with Next.js. Features a full desktop experience with draggable windows, Start menu, classic apps (Notepad, Paint, Minesweeper, Solitaire, etc.), and portfolio sections.',
    tags: ['Next.js', 'TailwindCSS'],
    icon: '🖥️',
    url: 'https://3d-portfolio-winxp.vercel.app',
    github: 'https://github.com/ErenYea9er69/3D-portfolio-winxp',
    sort_order: 4,
  },
  {
    id: 5,
    name: 'AnyBook',
    description: 'Next.js app for browsing structured book summaries. Designed as a healthier alternative to doomscrolling — search books, explore key angles (arguments, quotes, chapters, etc.), and request new titles.',
    tags: ['Next.js', 'React'],
    icon: '📚',
    url: 'https://any-book.vercel.app',
    github: 'https://github.com/ErenYea9er69/AnyBook',
    sort_order: 5,
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

const DEFAULT_VIDEOS: YoutubeVideo[] = [];

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
