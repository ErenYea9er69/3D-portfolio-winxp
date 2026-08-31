import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

// High-speed in-memory server cache for database assets
interface CachedAsset {
  buffer: Buffer;
  mimeType: string;
  etag: string;
}

const memoryCache = new Map<string, CachedAsset>();
const MAX_CACHE_SIZE = 400; // Cache up to 400 assets in server memory

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];
    if (pathSegments.length === 0) {
      return new NextResponse('Asset path required', { status: 400 });
    }

    // Reconstruct normalized path
    const decodedPath = '/' + pathSegments.map((seg) => decodeURIComponent(seg)).join('/');
    
    // Check if client has valid ETag cache
    const clientEtag = request.headers.get('if-none-match');

    // 1. Check in-memory server cache
    if (memoryCache.has(decodedPath)) {
      const cached = memoryCache.get(decodedPath)!;
      if (clientEtag && clientEtag === cached.etag) {
        return new NextResponse(null, { status: 304 });
      }
      return new Response(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          'Content-Type': cached.mimeType,
          'Content-Length': cached.buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'ETag': cached.etag,
          'X-Asset-Source': 'memory-cache',
        },
      });
    }

    // 2. Query Neon PostgreSQL database
    const rows = await sql`
      SELECT id, mime_type, data, size_bytes
      FROM system_assets
      WHERE id = ${decodedPath} OR id = ${decodedPath.replace(/^\//, '')}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      // Try searching by filename as fallback
      const filename = pathSegments[pathSegments.length - 1];
      const fallbackRows = await sql`
        SELECT id, mime_type, data, size_bytes
        FROM system_assets
        WHERE filename = ${filename}
        LIMIT 1;
      `;
      if (!fallbackRows || fallbackRows.length === 0) {
        return new NextResponse(`Asset not found: ${decodedPath}`, { status: 404 });
      }
      rows.push(fallbackRows[0]);
    }

    const row = rows[0];
    const buffer = Buffer.from(row.data, 'base64');
    const mimeType = row.mime_type || 'image/png';
    const etag = `W/"${row.size_bytes}-${buffer.length}"`;

    // Cache in memory for instant subsequent loads
    if (memoryCache.size >= MAX_CACHE_SIZE) {
      const firstKey = memoryCache.keys().next().value;
      if (firstKey) memoryCache.delete(firstKey);
    }
    memoryCache.set(decodedPath, { buffer, mimeType, etag });

    if (clientEtag && clientEtag === etag) {
      return new NextResponse(null, { status: 304 });
    }

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': etag,
        'X-Asset-Source': 'database',
      },
    });
  } catch (error: unknown) {
    console.error('Asset serving error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(errorMessage, { status: 500 });
  }
}
