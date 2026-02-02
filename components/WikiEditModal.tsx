"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface WikiEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    slug: string;
    initialContent: string;
}

export default function WikiEditModal({
    isOpen,
    onClose,
    slug,
    initialContent,
}: WikiEditModalProps) {
    const [sceneText, setSceneText] = useState("");
    const [witText, setWitText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        if (isOpen && initialContent) {
            // Parse Content
            const sceneMatch = initialContent.match(/## Scene\s+([\s\S]*?)(?=\n## |$)/);
            const witMatch = initialContent.match(/## Wit\s+([\s\S]*?)(?=\n## |$)/);

            if (sceneMatch) setSceneText(sceneMatch[1].trim());
            if (witMatch) setWitText(witMatch[1].trim());
        }
    }, [isOpen, initialContent]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setStatusMessage("저장 중...");

        try {
            // Reassemble Content
            let newContent = initialContent;

            // Replace Scene
            // We use a function replacement to avoid issues with special characters in the replacement string
            newContent = newContent.replace(
                /(## Scene\s+)([\s\S]*?)(?=\n## |$)/,
                `$1${sceneText}\n\n`
            );

            // Replace Wit
            newContent = newContent.replace(
                /(## Wit\s+)([\s\S]*?)(?=\n## |$)/,
                `$1${witText}\n`
            );

            const res = await fetch("/api/wiki/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, content: newContent }),
            });

            if (!res.ok) throw new Error("Failed to update");

            setStatusMessage("반영 요청 완료! 1~2분 뒤 반영됩니다.");
            setTimeout(() => {
                onClose();
                setStatusMessage("");
                setIsSubmitting(false);
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatusMessage("오류가 발생했습니다.");
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* 90s Window Style Container */}
            <div className="w-[800px] bg-[#c0c0c0] border-2 border-white border-b-gray-800 border-r-gray-800 shadow-2xl p-1">

                {/* Title Bar */}
                <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center mb-4 select-none">
                    <span className="font-bold tracking-wider text-sm">Wiki Editor - {slug}</span>
                    <button
                        onClick={onClose}
                        className="bg-[#c0c0c0] text-black w-5 h-5 flex items-center justify-center border border-white border-b-black border-r-black text-xs font-bold hover:active:border-t-black hover:active:border-l-black hover:active:border-b-white hover:active:border-r-white"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-4 space-y-6">
                    {/* Scene Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-800">
                            📼 Scene (그때 그 장면)
                        </label>
                        <textarea
                            value={sceneText}
                            onChange={(e) => setSceneText(e.target.value)}
                            className="w-full h-32 bg-white border-2 border-gray-600 border-b-white border-r-white p-2 font-mono text-sm resize-none focus:outline-none focus:bg-yellow-50"
                            placeholder="그 시절의 풍경을 묘사해주세요..."
                        />
                    </div>

                    {/* Wit Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-800">
                            💬 Wit (아재의 한마디)
                        </label>
                        <textarea
                            value={witText}
                            onChange={(e) => setWitText(e.target.value)}
                            className="w-full h-24 bg-white border-2 border-gray-600 border-b-white border-r-white p-2 font-mono text-sm resize-none focus:outline-none focus:bg-yellow-50"
                            placeholder="위트 있는 한마디를 남겨주세요..."
                        />
                    </div>

                    {/* Footer / Status */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-400">
                        <div className="text-sm font-bold text-blue-800 blink">
                            {statusMessage}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`
                px-6 py-2 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black
                text-sm font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d0d0d0]'}
              `}
                        >
                            {isSubmitting ? "전송 중..." : "💾 반영 요청"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
