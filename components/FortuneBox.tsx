'use client';

import { useState } from 'react';
import Link from 'next/link';
import LikeButton from './LikeButton';
import { PostData } from '@/lib/posts';

const FORTUNES = [
    { type: '대길 (大吉)', msg: '오랫동안 기다리던 소식이 들려옵니다. \n귀인을 만나 뜻밖의 행운을 얻을 운세입니다.' },
    { type: '중길 (中吉)', msg: '평범한 일상 속에 작은 행복이 숨어있습니다. \n오래된 서랍 속에서 잊고 있던 추억을 발견합니다.' },
    { type: '소길 (小吉)', msg: '잠시 쉬어가도 좋습니다. \n따뜻한 커피 한 잔과 음악으로 마음을 달래보세요.' },
    { type: '길 (吉)', msg: '우연히 들은 노래가 당신의 하루를 바꿉니다. \n마음을 열고 주변을 둘러보세요.' },
];

export default function FortuneBox({ posts }: { posts: PostData[] }) {
    const [isShaking, setIsShaking] = useState(false);
    const [result, setResult] = useState<{ fortune: typeof FORTUNES[0], song: PostData } | null>(null);

    const drawFortune = () => {
        if (isShaking) return;

        setIsShaking(true);
        // Reset result briefly if re-rolling, or just keep shaking

        setTimeout(() => {
            const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
            const randomSong = posts[Math.floor(Math.random() * posts.length)];

            setResult({
                fortune: randomFortune,
                song: randomSong
            });
            setIsShaking(false);
        }, 1500);
    };

    return (
        <article
            className={`
                bg-[var(--card)] p-6 border border-[var(--foreground)] shadow-paper h-full flex flex-col relative overflow-hidden
                cursor-pointer transition-transform duration-200 select-none
                ${isShaking ? 'animate-shake' : 'hover:-translate-y-1'}
            `}
            onClick={drawFortune}
        >
            {!result ? (
                // Initial State: Fortune Machine Ticket
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="text-4xl mb-4">🥠</div>
                    <h3 className="font-serif text-2xl font-bold mb-2">운세 뽑기</h3>
                    <p className="font-sans text-sm opacity-60">
                        여기를 눌러서<br />
                        오늘의 운세와 추천곡을<br />
                        확인해보세요.
                    </p>
                    <div className="mt-6 w-12 h-1 bg-[var(--accent)] rounded-full opacity-50"></div>
                </div>
            ) : (
                // Result State
                <div className="flex flex-col h-full animate-fadeIn">
                    {/* Header: Fortune Type */}
                    <div className="flex items-center justify-between mb-4 border-b border-dashed border-[var(--foreground)] pb-2">
                        <span className="text-[var(--accent)] font-bold text-lg">{result.fortune.type}</span>
                        <span className="text-xs opacity-50 cursor-pointer hover:underline" onClick={(e) => {
                            e.stopPropagation();
                            setResult(null); // Reset
                        }}>다시 뽑기 ↻</span>
                    </div>

                    {/* Fortune Message */}
                    <p className="font-serif text-sm mb-6 whitespace-pre-line leading-relaxed flex-grow">
                        {result.fortune.msg}
                    </p>

                    {/* Song Recommendation */}
                    <div className="mt-auto pt-4 bg-[#FFFDF5] -mx-6 -mb-6 p-6 border-t border-[var(--foreground)]">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs opacity-60 font-sans uppercase tracking-widest">Recommended</p>
                            <div onClick={(e) => e.stopPropagation()}>
                                <LikeButton slug={result.song.slug} />
                            </div>
                        </div>
                        <Link
                            href={`/song/${result.song.slug}`}
                            className="block group"
                            onClick={(e) => e.stopPropagation()} // Prevent re-triggering shake
                        >
                            <h4 className="text-lg font-serif font-bold group-hover:underline decoration-1 underline-offset-4 truncate">
                                {result.song.title}
                            </h4>
                            <p className="text-xs opacity-80">{result.song.artist}</p>
                        </Link>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                    animation-iteration-count: infinite;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </article>
    );
}
