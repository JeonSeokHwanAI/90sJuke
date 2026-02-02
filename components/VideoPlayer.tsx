"use client";

import { useState, useCallback } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';

interface VideoPlayerProps {
    initialVideoId: string;
    slug: string;
    artist: string;
    title: string;
}

export default function VideoPlayer({ initialVideoId, slug, artist, title }: VideoPlayerProps) {
    const [videoId, setVideoId] = useState(initialVideoId);
    const [isHealing, setIsHealing] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    };

    const handleVideoError = useCallback(async (event: YouTubeEvent) => {
        // Prevent infinite loops if the replacement video is also broken or if we are already healing
        if (isHealing) return;

        console.log("Video error detected, attempting to heal...");
        setIsHealing(true);
        setFeedbackMessage("Broken link detected. Searching for a replacement...");

        try {
            const response = await fetch('/api/video/heal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slug, artist, title }),
            });

            const data = await response.json();

            if (data.success && data.videoId) {
                setVideoId(data.videoId);
                setFeedbackMessage("Video link repaired! Enjoy your music.");
                // Clear success message after 3 seconds
                setTimeout(() => setFeedbackMessage(null), 3000);
            } else {
                setFeedbackMessage("Could not automatically repair the video link.");
            }
        } catch (error) {
            console.error("Healing failed:", error);
            setFeedbackMessage("An error occurred while trying to repair the link.");
        } finally {
            setIsHealing(false);
        }
    }, [slug, artist, title, isHealing]);

    return (
        <div className="relative mb-8">
            <div className={`relative pb-[56.25%] h-0 overflow-hidden border border-[var(--foreground)] shadow-paper bg-black ${isHealing ? 'opacity-50' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-full">
                    <YouTube
                        videoId={videoId}
                        opts={opts}
                        className="w-full h-full"
                        iframeClassName="w-full h-full"
                        onError={handleVideoError}
                    />
                </div>

                {/* Loading / Healing Indicator Overlay */}
                {isHealing && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            {/* Notification Area */}
            {feedbackMessage && (
                <div className={`mt-2 p-2 text-sm text-center font-bold border ${isHealing ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
}
