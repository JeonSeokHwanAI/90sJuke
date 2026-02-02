import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(req: Request) {
    try {
        const { slug, content } = await req.json();

        if (!slug || !content) {
            return NextResponse.json({ error: 'Missing slug or content' }, { status: 400 });
        }

        const token = process.env.GITHUB_TOKEN;
        const owner = process.env.REPO_OWNER;
        const repo = process.env.REPO_NAME;

        if (!token || !owner || !repo) {
            console.error('Missing GitHub environment variables');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const octokit = new Octokit({ auth: token });
        const path = `content/${slug}.md`;

        // 1. Get current file to get SHA (required for update)
        let sha: string | undefined;
        try {
            const { data } = await octokit.repos.getContent({
                owner,
                repo,
                path,
            });

            if (Array.isArray(data)) {
                return NextResponse.json({ error: 'Path is a directory, not a file' }, { status: 400 });
            }

            sha = data.sha;
        } catch (error: any) {
            if (error.status === 404) {
                // File doesn't exist, we might want to create it or error out. 
                // For this wiki feature, we expect the file to exist.
                return NextResponse.json({ error: 'File not found on GitHub' }, { status: 404 });
            }
            throw error;
        }

        // 2. Update file
        const message = 'Update: Scene & Wit by User';
        const contentEncoded = Buffer.from(content).toString('base64');

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message,
            content: contentEncoded,
            sha,
        });

        return NextResponse.json({ success: true, message: 'Wiki updated successfully' });

    } catch (error: any) {
        console.error('Error updating wiki:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
