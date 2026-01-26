
import { getAllPosts } from '@/lib/posts';
import PostGrid from '@/components/PostGrid';

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

            <PostGrid posts={posts} />

            <footer className="mt-16 pt-8 border-t border-[var(--foreground)] text-center text-sm opacity-60 font-serif">
                <p>© 2026 90s Juke. All rights reserved.</p>
            </footer>
        </main>
    );
}
