import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, subject, and message are all required.' },
        { status: 400 }
      );
    }

    const [newMessage] = await sql`
      INSERT INTO contact_messages (name, email, subject, message, created_at, is_read)
      VALUES (${name.trim()}, ${email.trim()}, ${subject.trim()}, ${message.trim()}, NOW(), FALSE)
      RETURNING id, name, email, subject, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Message delivered and stored in database successfully!',
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Contact submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save contact message';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await sql`
      SELECT id, name, email, subject, message, created_at, is_read
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT 50;
    `;

    return NextResponse.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error: unknown) {
    console.error('Contact fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contact messages';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
