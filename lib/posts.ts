import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content');

export interface Recommendation {
    type: string;
    desc: string;
    slug: string;
}

export interface PostData {
    slug: string;
    title: string;
    artist: string;
    year: string;
    country: string;
    tags: string[];
    youtubeId: string;
    oneLine: string;
    trackInfo: {
        release: string;
        record: string;
    };
    recommendations?: Recommendation[];
    content: string;
}

export function getAllPosts(): PostData[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the slug
        return {
            slug,
            content: matterResult.content,
            ...matterResult.data,
        } as PostData;
    });

    // Sort posts by year (newest first)
    return allPostsData
        .filter(post => post.title) // Filter out validation failures (empty files)
        .sort((a, b) => {
            if (a.year < b.year) {
                return 1;
            } else {
                return -1;
            }
        });
}

export function getPostBySlug(slug: string): PostData | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            slug,
            content: matterResult.content,
            ...matterResult.data,
        } as PostData;
    } catch (err) {
        return null;
    }
}
