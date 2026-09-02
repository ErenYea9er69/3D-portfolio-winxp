import { NextRequest, NextResponse } from 'next/server';
import { sql, isDatabaseConfigured } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, location, bio, status, education, experience, achievements, social_links } = body;

    const cleanName = typeof name === 'string' ? name.trim().slice(0, 100) : 'Rayen Ben Aissa';
    const cleanTitle = typeof title === 'string' ? title.trim().slice(0, 100) : 'Full Stack Developer';
    const cleanLocation = typeof location === 'string' ? location.trim().slice(0, 100) : 'Tunisia';
    const cleanBio = typeof bio === 'string' ? bio.trim().slice(0, 2000) : '';
    const cleanStatus = typeof status === 'string' ? status.trim().slice(0, 100) : 'Available for work';

    if (!isDatabaseConfigured) {
      return NextResponse.json({
        success: true,
        message: 'Profile updated locally (demo mode).',
        data: {
          id: 'main',
          name: cleanName,
          title: cleanTitle,
          location: cleanLocation,
          bio: cleanBio,
          avatar_url: '/icons xp/Windows XP Icons/User Accounts.png',
          status: cleanStatus,
          education: education || [{ title: 'B.Tech in CS & IT', subtitle: 'Trident Academy of Technology' }],
          experience: experience || [{ title: 'Freelance Developer', subtitle: 'v0 Ambassador by Vercel' }],
          achievements: achievements || ['v0 Ambassador by Vercel'],
          social_links: social_links || [],
          updated_at: new Date().toISOString(),
        },
      });
    }

    const [updated] = await sql`
      INSERT INTO portfolio_profile (
        id, name, title, location, bio, avatar_url, status,
        education, experience, achievements, social_links, updated_at
      ) VALUES (
        'main',
        ${cleanName},
        ${cleanTitle},
        ${cleanLocation},
        ${cleanBio},
        '/icons xp/Windows XP Icons/User Accounts.png',
        ${cleanStatus},
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

