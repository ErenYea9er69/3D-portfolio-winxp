import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/documents or /api/documents?id=xxx&type=notepad
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const docType = searchParams.get('type');

    if (id) {
      const rows = await sql`
        SELECT id, title, content, doc_type, created_at, updated_at
        FROM user_documents
        WHERE id = ${id}
        LIMIT 1;
      `;
      if (rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: rows[0] });
    }

    // List documents
    let rows;
    if (docType) {
      rows = await sql`
        SELECT id, title, content, doc_type, created_at, updated_at
        FROM user_documents
        WHERE doc_type = ${docType}
        ORDER BY updated_at DESC;
      `;
    } else {
      rows = await sql`
        SELECT id, title, content, doc_type, created_at, updated_at
        FROM user_documents
        ORDER BY updated_at DESC;
      `;
    }

    return NextResponse.json({ success: true, count: rows.length, data: rows });
  } catch (error: unknown) {
    console.error('Document fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch documents';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// POST /api/documents - Create or update a document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, doc_type } = body;

    const docId = id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const docTitle = title || (doc_type === 'wordpad' ? 'Document.rtf' : 'Untitled.txt');
    const docContent = content || '';
    const type = doc_type === 'wordpad' ? 'wordpad' : 'notepad';

    const [saved] = await sql`
      INSERT INTO user_documents (id, title, content, doc_type, created_at, updated_at)
      VALUES (${docId}, ${docTitle}, ${docContent}, ${type}, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        updated_at = NOW()
      RETURNING id, title, content, doc_type, created_at, updated_at;
    `;

    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    console.error('Document save error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save document';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/documents?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Document ID required' }, { status: 400 });
    }

    await sql`DELETE FROM user_documents WHERE id = ${id};`;
    return NextResponse.json({ success: true, message: 'Document deleted successfully' });
  } catch (error: unknown) {
    console.error('Document delete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete document';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
