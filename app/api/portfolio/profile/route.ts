import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, location, bio, status, education, experience, achievements, social_links } = body;

    const [updated] = await sql`
      INSERT INTO portfolio_profile (
        id, name, title, location, bio, avatar_url, status,
        education, experience, achievements, social_links, updated_at
      ) VALUES (
        'main',
        ${name || 'Rayen Ben Aissa'},
        ${title || 'Full Stack Developer'},
        ${location || 'Tunisia'},
        ${bio || ''},
        '/icons xp/Windows XP Icons/User Accounts.png',
        ${status || 'Available for work'},
        ${JSON.stringify(education || [{ title: 'B.Tech in CS & IT', subtitle: 'Trident Academy of Technology' }])}::jsonb,
        ${JSON.stringify(experience || [{ title: 'Freelance Developer', subtitle: 'v0 Ambassador by Vercel' }])}::jsonb,
        ${JSON.stringify(achievements || ['v0 Ambassador by Vercel'])}::jsonb,
        ${JSON.stringify(social_links || [])}::jsonb,
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        location = EXCLUDED.location,
        bio = EXCLUDED.bio,
        status = EXCLUDED.status,
        education = EXCLUDED.education,
        experience = EXCLUDED.experience,
        achievements = EXCLUDED.achievements,
        social_links = EXCLUDED.social_links,
        updated_at = NOW()
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: 'Profile updated in Neon database successfully!',
      data: updated,
    });
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
