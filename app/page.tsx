import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default async function Home() {
    const posts = getAllPosts();

    return (
        <main>
            <header className="mb-12 text-center border-b border-[var(--foreground)] pb-8 border-dashed">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
                    90s Juke
                </h1>
                <p className="font-serif text-lg text-[var(--foreground)] opacity-80 italic">
                    Analogue Memories from the Golden Era
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                    <Link href={`/song/${post.slug}`} key={post.slug} className="block group">
                        <article className="bg-[var(--card)] p-6 border border-[var(--foreground)] shadow-paper transition-transform duration-200 hover:-translate-y-1 h-full flex flex-col items-start relative overflow-hidden">
                            {/* Decorative corner tape effect (optional, simplified to border) */}

                            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest border border-[var(--foreground)] px-2 py-1 inline-block">
                                <span>{post.country === 'JP' ? '🇯🇵 JAPAN' : (post.country === 'KR' ? '🇰🇷 KOREA' : post.country)}</span>
                                <span className="w-px h-3 bg-[var(--foreground)]"></span>
                                <span>{post.year}</span>
                            </div>

                            <h2 className="text-2xl font-serif font-bold mb-1 group-hover:underline decoration-1 underline-offset-4">
                                {post.title}
                            </h2>

                            <p className="text-sm font-sans mb-4 opacity-80 uppercase tracking-wide">
                                {post.artist}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-xs border border-[var(--foreground)] px-2 py-0.5 rounded-full opacity-60">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 border-t border-dashed border-[var(--foreground)] w-full">
                                <p className="font-serif italic text-[var(--accent)] text-sm">
                                    “{post.oneLine}”
                                </p>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            <footer className="mt-16 pt-8 border-t border-[var(--foreground)] text-center text-sm opacity-60 font-serif">
                <p>© 2026 90s Juke. All rights reserved.</p>
            </footer>
        </main>
    );
}
