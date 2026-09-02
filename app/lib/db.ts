import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Load connection strictly from environment variable to prevent secret leakage
const DATABASE_URL = process.env.DATABASE_URL;

// Safely provide the SQL client or a dummy client that throws descriptive error if unconfigured
export const sql = (DATABASE_URL ? neon(DATABASE_URL) : (() => {
  throw new Error('DATABASE_URL is not configured in environment variables.');
})) as unknown as NeonQueryFunction<false, false>;

export const isDatabaseConfigured = Boolean(DATABASE_URL);


export interface PortfolioProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  bio: string;
  avatar_url: string;
  status: string;
  education: Array<{ title: string; subtitle: string }>;
  experience: Array<{ title: string; subtitle: string }>;
  achievements: string[];
  social_links: Array<{ name: string; icon: string; url: string }>;
  resume_url?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  tags: string[];
  icon: string;
  url: string;
  github?: string;
  sort_order: number;
}

export interface SkillCategory {
  name: string;
  icon: string;
  color: string;
  items: string[];
  sort_order: number;
}

export interface TechItem {
  name: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface YoutubeVideo {
  id: number;
  title: string;
  url: string;
  sort_order: number;
}

export interface PictureItem {
  id: string;
  title: string;
  src: string;
  dimensions?: string;
  size?: string;
  sort_order: number;
}

export interface WallpaperItem {
  id: string;
  label: string;
  css: string;
  swatch: string;
  is_default: boolean;
}

export interface MsnBuddy {
  id: string;
  name: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  status_text: string;
  avatar: string;
  sort_order: number;
}

export interface MsnMessage {
  id: string;
  buddy_id: string;
  sender: 'user' | 'bot' | 'system';
  sender_name: string;
  text: string;
  is_nudge?: boolean;
  created_at: string;
}

export interface UserDocument {
  id: string;
  title: string;
  content: string;
  doc_type: 'notepad' | 'wordpad';
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}
