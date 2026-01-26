'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import FortuneBox from './FortuneBox';
import LikeButton from './LikeButton';
import { PostData } from '@/lib/posts';

export default function PostGrid({ posts }: { posts: PostData[] }) {
    const [randomPosts, setRandomPosts] = useState<PostData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        let seasonTags: string[] = [];

        // Check season (Spring: 3-5, Summer: 6-8, Autumn: 9-11, Winter: 12-2)
        if (month >= 3 && month <= 5) {
            seasonTags = ['봄'];
        } else if (month >= 6 && month <= 8) {
            seasonTags = ['여름', '바다'];
        } else if (month >= 9 && month <= 11) {
            seasonTags = ['가을'];
        } else {
            seasonTags = ['겨울', '눈'];
        }

        // 1. Filter by seasonal tags
        const seasonalPosts = posts.filter(post =>
            Array.isArray(post.tags) && post.tags.some(tag => seasonTags.includes(tag))
        );

        // 2. Randomize seasonal posts logic could go here, but we will shuffle everything later or prioritize them?
        // Requirement: "Seasonal first". "If not enough, fill with others".

        // Let's pool them specifically
        // Shuffle seasonal posts first to get random ones if there are many
        const shuffledSeasonal = [...seasonalPosts].sort(() => 0.5 - Math.random());

        let selected = shuffledSeasonal.slice(0, 5);

        // 3. Fill with others if < 5
        if (selected.length < 5) {
            const others = posts.filter(p => !selected.includes(p));
            const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
            selected = [...selected, ...shuffledOthers.slice(0, 5 - selected.length)];
        }

        // 4. Final Shuffle of the 5 selected songs
        const finalPosts = selected.sort(() => 0.5 - Math.random());

        setRandomPosts(finalPosts);
        setLoading(false);
    }, [posts]);

    // Filtering Logic
    const filteredPosts = posts.filter(post => {
        const query = searchQuery.toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            post.artist.toLowerCase().includes(query) ||
            post.oneLine?.toLowerCase().includes(query) ||
            post.tags?.some(tag => tag.toLowerCase().includes(query))
        );
    });

    const displayPosts = searchQuery ? filteredPosts : randomPosts;

    if (loading) {
        return (
            <div className="text-center py-20 font-serif text-lg opacity-60">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-dashed border-[var(--foreground)] pb-4 mb-4">
                <h3 className="font-serif text-xl font-bold">
                    {searchQuery ? '🔍 검색 결과' : '🎵 오늘의 추천 플레이리스트'}
                </h3>
                <SearchBar onSearch={setSearchQuery} />
            </div>

            {displayPosts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="font-serif text-xl mb-2">검색 결과가 없습니다.</p>
                    <p className="font-sans opacity-60 text-sm">다른 단어로 찾아보세요.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayPosts.map((post) => (
                        <Link href={`/song/${post.slug}`} key={post.slug} className="block group h-full">
                            <article className="bg-[var(--card)] p-6 border border-[var(--foreground)] shadow-paper transition-transform duration-200 hover:-translate-y-1 h-full flex flex-col items-start relative overflow-hidden">
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
                                    {post.tags?.map(tag => (
                                        <span key={tag} className="text-xs border border-[var(--foreground)] px-2 py-0.5 rounded-full opacity-60">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-4 border-t border-dashed border-[var(--foreground)] w-full flex justify-between items-center gap-4">
                                    <p className="font-serif italic text-[var(--accent)] text-sm flex-grow">
                                        “{post.oneLine}”
                                    </p>
                                    <LikeButton slug={post.slug} />
                                </div>
                            </article>
                        </Link>
                    ))}

                    {/* Render FortuneBox if not searching (to fill the 6th slot) */}
                    {!searchQuery && (
                        <div className="h-full block">
                            <FortuneBox posts={posts} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
