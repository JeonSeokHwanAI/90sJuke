import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
    try {
        const { slug, artist, title } = await request.json();

        if (!slug || !artist || !title) {
            return NextResponse.json(
                { error: 'Missing required fields: slug, artist, title' },
                { status: 400 }
            );
        }

        const youtube = google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY,
        });

        const query = `${artist} ${title}`;
        console.log(`Searching YouTube for: ${query}`);

        const response = await youtube.search.list({
            part: ['snippet'],
            q: query,
            type: ['video'],
            maxResults: 1,
        });

        const items = response.data.items;
        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No video found' },
                { status: 404 }
            );
        }

        const newVideoId = items[0].id?.videoId;

        if (!newVideoId) {
            return NextResponse.json(
                { error: 'Failed to extract video ID' },
                { status: 500 }
            );
        }

        // Store in Vercel KV
        await kv.set(`video:override:${slug}`, newVideoId);

        console.log(`Healed video for ${slug}: ${newVideoId}`);

        return NextResponse.json({
            success: true,
            videoId: newVideoId,
            message: 'Video healed successfully'
        });

    } catch (error) {
        console.error('Error in healing video:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
