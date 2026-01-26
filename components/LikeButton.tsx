'use client';

import { useState, useEffect } from 'react';

export default function LikeButton({ slug }: { slug: string }) {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBouncing, setIsBouncing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial likes
    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/likes?slug=${slug}`)
            .then(res => res.json())
            .then(data => {
                setLikes(data.likes || 0);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));

        // Check local storage for liked status
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        if (likedPosts.includes(slug)) {
            setIsLiked(true);
        }
    }, [slug]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation if inside a card link
        e.stopPropagation();

        if (isLiked) return; // Prevent double liking mostly for UX

        // Optimistic UI update
        setLikes(prev => prev + 1);
        setIsLiked(true);
        setIsBouncing(true);

        // Save to local storage
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        localStorage.setItem('liked_posts', JSON.stringify([...likedPosts, slug]));

        // Sync with server
        try {
            await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug }),
            });
        } catch (error) {
            console.error('Failed to sync like:', error);
            // Rollback on error if critical, but for likes usually fine to ignore
        }

        // Reset bounce animation
        setTimeout(() => setIsBouncing(false), 500);
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLiked || isLoading}
            className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300
                ${isLiked
                    ? 'bg-[var(--accent)] text-[#F5F1E8] border-[var(--accent)]'
                    : 'bg-transparent border-[var(--foreground)] text-[var(--foreground)] hover:bg-[#F5F1E8]'}
                ${isBouncing ? 'animate-bounce-custom' : ''}
            `}
        >
            <span className="text-sm">
                {isLiked ? '♥' : '♡'}
            </span>
            <span className="font-serif text-sm font-bold min-w-[1ch] text-center">
                {likes}
            </span>

            <style jsx>{`
                @keyframes bounce-custom {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                }
                .animate-bounce-custom {
                    animation: bounce-custom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
            `}</style>
        </button>
    );
}
