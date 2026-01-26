import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    try {
        const likes = await kv.get<number>(`post:likes:${slug}`);
        return NextResponse.json({ likes: likes || 0 });
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ likes: 0 }); // Fallback
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug } = body;

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Increment the like count
        const newCount = await kv.incr(`post:likes:${slug}`);

        return NextResponse.json({ likes: newCount });
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
