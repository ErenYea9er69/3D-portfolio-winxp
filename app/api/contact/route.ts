import { NextRequest, NextResponse } from 'next/server';
import { sql, isDatabaseConfigured } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Type and existence check
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string'
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid input types. All fields must be strings.' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return NextResponse.json(
        { success: false, error: 'Name, email, subject, and message are all required.' },
        { status: 400 }
      );
    }

    // Length constraints to prevent buffer/DB DOS attacks
    if (trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must be 100 characters or fewer.' },
        { status: 400 }
      );
    }
    if (trimmedEmail.length > 254 || !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }
    if (trimmedSubject.length > 150) {
      return NextResponse.json(
        { success: false, error: 'Subject must be 150 characters or fewer.' },
        { status: 400 }
      );
    }
    if (trimmedMessage.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message must be 5000 characters or fewer.' },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured) {
      // Graceful simulated delivery if running in local preview mode without Neon DB
      return NextResponse.json(
        {
          success: true,
          message: 'Message delivered (local demo mode).',
          data: {
            id: Date.now(),
            name: trimmedName,
            email: trimmedEmail,
            subject: trimmedSubject,
            created_at: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }

    const [newMessage] = await sql`
      INSERT INTO contact_messages (name, email, subject, message, created_at, is_read)
      VALUES (${trimmedName}, ${trimmedEmail}, ${trimmedSubject}, ${trimmedMessage}, NOW(), FALSE)
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
    if (!isDatabaseConfigured) {
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
      });
    }

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

