import { NextRequest, NextResponse } from 'next/server';
import { sql, isDatabaseConfigured } from '@/app/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const DEFAULT_BUDDIES = [
  { id: 'rayen', name: 'Rayen Ben Aissa (Online)', status: 'online', status_text: 'Building full-stack apps & retro UIs 🚀', avatar: '/icons xp/Windows XP Icons/User Accounts.png', sort_order: 1 },
  { id: 'clippy', name: 'Clippy Assistant', status: 'online', status_text: 'It looks like you are writing code! Need help?', avatar: '/icons xp/Windows XP Icons/Help and Support.png', sort_order: 2 },
  { id: 'bill', name: 'Bill G.', status: 'away', status_text: 'Where do you want to go today?', avatar: '/icons xp/Windows XP Icons/Internet Explorer 6.png', sort_order: 3 },
  { id: 'rover', name: 'Rover the Search Dog', status: 'online', status_text: 'Sniffing around the file system 🐶', avatar: '/icons xp/Windows XP Icons/Search.png', sort_order: 4 },
];

const fallbackMessages: Array<{
  id: string;
  buddy_id: string;
  sender: string;
  sender_name: string;
  text: string;
  is_nudge: boolean;
  created_at: string;
}> = [
  { id: 'msg-1', buddy_id: 'rayen', sender: 'bot', sender_name: 'Rayen', text: 'Hey there! Welcome to my Windows XP portfolio! Feel free to leave a message here or send me a nudge!', is_nudge: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'msg-2', buddy_id: 'clippy', sender: 'bot', sender_name: 'Clippy', text: 'It looks like you are checking out MSN Messenger. Click "Nudge" to shake the window!', is_nudge: false, created_at: new Date(Date.now() - 1800000).toISOString() },
];

// GET /api/msn?buddyId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buddyId = searchParams.get('buddyId');

    if (!isDatabaseConfigured) {
      const messages = buddyId
        ? fallbackMessages.filter(m => m.buddy_id === buddyId)
        : fallbackMessages;
      return NextResponse.json({
        success: true,
        buddies: DEFAULT_BUDDIES,
        messages,
      });
    }

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
      buddies: buddies.length > 0 ? buddies : DEFAULT_BUDDIES,
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

    if (!buddy_id || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ success: false, error: 'buddy_id and text required' }, { status: 400 });
    }

    const msgId = (typeof id === 'string' && id.trim()) ? id.trim() : `msn-${crypto.randomUUID()}`;
    const msgSender = (sender === 'bot' || sender === 'system') ? sender : 'user';
    const msgSenderName = typeof sender_name === 'string' ? sender_name.slice(0, 50) : 'You';
    const cleanText = text.trim().slice(0, 2000);
    const nudge = Boolean(is_nudge);

    if (!isDatabaseConfigured) {
      const savedMsg = {
        id: msgId,
        buddy_id: String(buddy_id),
        sender: msgSender,
        sender_name: msgSenderName,
        text: cleanText,
        is_nudge: nudge,
        created_at: new Date().toISOString(),
      };
      fallbackMessages.push(savedMsg);
      return NextResponse.json({ success: true, data: savedMsg });
    }

    const [saved] = await sql`
      INSERT INTO msn_messages (id, buddy_id, sender, sender_name, text, is_nudge, created_at)
      VALUES (${msgId}, ${buddy_id}, ${msgSender}, ${msgSenderName}, ${cleanText}, ${nudge}, NOW())
      RETURNING id, buddy_id, sender, sender_name, text, is_nudge, created_at;
    `;

    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    console.error('MSN send error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send MSN message';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

