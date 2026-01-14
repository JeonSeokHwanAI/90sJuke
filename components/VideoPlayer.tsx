"use client";

import YouTube from 'react-youtube';

export default function VideoPlayer({ videoId }: { videoId: string }) {
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <div className="relative pb-[56.25%] h-0 overflow-hidden border border-[var(--foreground)] shadow-paper mb-8 bg-black">
            <div className="absolute top-0 left-0 w-full h-full">
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    className="w-full h-full"
                    iframeClassName="w-full h-full"
                />
            </div>
        </div>
    );
}
