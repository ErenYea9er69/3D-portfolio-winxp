import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/msn?buddyId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buddyId = searchParams.get('buddyId');

    const buddies = await sql`
      SELECT id, name, status, status_text, avatar, sort_order
      FROM msn_buddies
      ORDER BY sort_order ASC;
    `;

    let messages = [];
    if (buddyId) {
      messages = await sql`
        SELECT id, buddy_id, sender, sender_name, text, is_nudge, created_at
        FROM msn_messages
        WHERE buddy_id = ${buddyId}
        ORDER BY created_at ASC
        LIMIT 100;
      `;
    } else {
      messages = await sql`
        SELECT id, buddy_id, sender, sender_name, text, is_nudge, created_at
        FROM msn_messages
        ORDER BY created_at ASC
        LIMIT 200;
      `;
    }

    return NextResponse.json({
      success: true,
      buddies,
      messages,
    });
  } catch (error: unknown) {
    console.error('MSN fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch MSN data';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// POST /api/msn - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, buddy_id, sender, sender_name, text, is_nudge } = body;

    if (!buddy_id || !text) {
      return NextResponse.json({ success: false, error: 'buddy_id and text required' }, { status: 400 });
    }

    const msgId = id || `msn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const msgSender = sender || 'user';
    const msgSenderName = sender_name || 'You';
    const nudge = Boolean(is_nudge);

    const [saved] = await sql`
      INSERT INTO msn_messages (id, buddy_id, sender, sender_name, text, is_nudge, created_at)
      VALUES (${msgId}, ${buddy_id}, ${msgSender}, ${msgSenderName}, ${text}, ${nudge}, NOW())
      RETURNING id, buddy_id, sender, sender_name, text, is_nudge, created_at;
    `;

    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    console.error('MSN send error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send MSN message';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
