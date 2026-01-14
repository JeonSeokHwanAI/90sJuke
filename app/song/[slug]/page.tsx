import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import VideoPlayer from '@/components/VideoPlayer';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) {
        return { title: 'Not Found' };
    }
    return {
        title: `${post.title} - ${post.artist} | 90s Juke`,
        description: post.oneLine,
    };
}

export default async function SongPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto">
            <nav className="mb-8 font-serif">
                <Link
                    href="/"
                    className="text-sm underline decoration-1 underline-offset-4 hover:decoration-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                    ← Back to Collection
                </Link>
            </nav>

            {/* Header Info */}
            <header className="mb-8 text-center">
                <div className="inline-block border border-[var(--foreground)] px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-[var(--card)]">
                    {post.country === 'JP' ? '🇯🇵 JAPAN' : (post.country === 'KR' ? '🇰🇷 KOREA' : post.country)} / {post.year}
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">
                    {post.title}
                </h1>
                <p className="text-xl font-sans opacity-80 uppercase tracking-wide">
                    {post.artist}
                </p>
            </header>

            {/* Video Player */}
            <VideoPlayer videoId={post.youtubeId} />

            {/* Track Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 p-6 bg-[var(--card)] border border-[var(--foreground)] shadow-paper items-start">
                <div>
                    <span className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Release Date</span>
                    <span className="font-serif">{post.trackInfo.release}</span>
                </div>
                <div>
                    <span className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Record</span>
                    <span className="font-serif">{post.trackInfo.record}</span>
                </div>
                <div className="md:col-span-2 pt-4 mt-2 border-t border-dashed border-[var(--foreground)]">
                    <span className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Comment</span>
                    <p className="font-serif text-[var(--accent)] text-lg italic">
                        “{post.oneLine}”
                    </p>
                </div>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-stone prose-lg max-w-none font-serif 
        prose-headings:font-serif prose-headings:font-bold prose-headings:text-[var(--foreground)]
        prose-p:text-[var(--foreground)] prose-p:leading-relaxed
        prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)] prose-blockquote:bg-[var(--card)] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
        prose-strong:text-[var(--accent)] prose-strong:font-bold
        mb-16">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
                {post.tags.map(tag => (
                    <span key={tag} className="text-sm border border-[var(--foreground)] px-3 py-1 rounded-full opacity-60">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Recommendations */}
            {post.recommendations && post.recommendations.length > 0 && (
                <section className="border-t border-[var(--foreground)] pt-12">
                    <h3 className="text-2xl font-serif font-bold mb-8 text-center">
                        You Might Also Like
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {post.recommendations.map((rec) => (
                            <Link href={`/song/${rec.slug}`} key={rec.slug} className="group">
                                <div className="bg-[var(--card)] p-4 border border-[var(--foreground)] shadow-paper h-full transition-transform hover:-translate-y-1">
                                    <span className="block text-xs font-bold text-[var(--accent)] mb-2 uppercase tracking-wide">
                                        {rec.type}
                                    </span>
                                    <p className="font-serif text-sm opacity-90 group-hover:underline decoration-1 underline-offset-4">
                                        {rec.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </article>
    );
}
