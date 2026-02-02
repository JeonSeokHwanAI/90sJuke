"use client";

import { useState } from "react";
import WikiEditModal from "./WikiEditModal";

interface WikiEditorProps {
    slug: string;
    initialContent: string;
}

export default function WikiEditor({ slug, initialContent }: WikiEditorProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed top-24 right-6 z-40 bg-[#c0c0c0] text-black px-3 py-1 border-2 border-white border-b-black border-r-black text-sm font-bold shadow-md active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-[#d0d0d0] flex items-center gap-2"
            >
                <span>✏️</span>
                <span>내용 다듬기</span>
            </button>

            <WikiEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                slug={slug}
                initialContent={initialContent}
            />
        </>
    );
}
