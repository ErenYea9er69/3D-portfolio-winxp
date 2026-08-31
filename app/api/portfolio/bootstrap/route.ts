import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      profiles,
      projects,
      skills,
      techStack,
      videos,
      wallpapers,
      pictures,
      buddies,
      documents,
    ] = await Promise.all([
      sql`SELECT * FROM portfolio_profile WHERE id = 'main' LIMIT 1;`,
      sql`SELECT * FROM projects ORDER BY sort_order ASC, id ASC;`,
      sql`SELECT * FROM skills ORDER BY sort_order ASC, id ASC;`,
      sql`SELECT * FROM tech_stack ORDER BY sort_order ASC, id ASC;`,
      sql`SELECT * FROM youtube_videos ORDER BY sort_order ASC, id ASC;`,
      sql`SELECT * FROM wallpapers ORDER BY sort_order ASC;`,
      sql`SELECT * FROM pictures ORDER BY sort_order ASC;`,
      sql`SELECT * FROM msn_buddies ORDER BY sort_order ASC;`,
      sql`SELECT id, title, doc_type, updated_at FROM user_documents ORDER BY updated_at DESC;`,
    ]);

    const profile = profiles[0] || null;

    return NextResponse.json(
      {
        success: true,
        data: {
          profile,
          projects,
          skills,
          techStack,
          videos,
          wallpapers,
          pictures,
          buddies,
          documents,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Portfolio bootstrap fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load portfolio data';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
