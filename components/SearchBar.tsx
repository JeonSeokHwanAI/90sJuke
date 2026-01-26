'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <div className="w-full max-w-sm relative">
            <div className="relative group">
                <input
                    type="text"
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="가수, 제목, 또는 기분을 검색하세요..."
                    className="w-full bg-transparent border-b-2 border-[var(--foreground)] py-2 pl-2 pr-10 
                             text-lg font-serif placeholder:font-serif placeholder:opacity-50 placeholder:italic
                             focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
                />
                <MagnifyingGlassIcon
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--foreground)] opacity-50 group-hover:opacity-100 transition-opacity"
                />
            </div>
        </div>
    );
}
