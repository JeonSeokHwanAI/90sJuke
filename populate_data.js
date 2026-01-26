const fs = require('fs');
const path = require('path');

const contentDir = 'e:/Project/vibecode/90sJuke/content';
const files = fs.readdirSync(contentDir);

const template = (slug, title, artist) => `---
title: "${title}"
artist: "${artist}"
year: "199X"
country: "KR"
tags: ["추억", "레트로"]
youtubeId: "dQw4w9WgXcQ"
oneLine: "자동 생성된 데이터입니다."
trackInfo:
  release: "199X.01.01"
  record: "Retro Records"
recommendations:
  - type: "artist"
    desc: "비슷한 감성의 아티스트"
    slug: "zard-myfriend"
---

# ${title}

이 곡은 데이터가 비어있어서 자동으로 채워진 예시 데이터입니다.
추후 실제 데이터로 채워주세요.

> "To be populated..."
`;

// Helper to guess title from slug
function parseSlug(slug) {
    const parts = slug.split('-');
    const artist = parts[0] || 'Unknown';
    const title = parts.slice(1).join(' ') || 'Untitled';
    // Capitalize
    return {
        artist: artist.charAt(0).toUpperCase() + artist.slice(1),
        title: title.charAt(0).toUpperCase() + title.slice(1)
    };
}

let updatedCount = 0;

files.forEach(file => {
    if (!file.endsWith('.md')) return;

    const filePath = path.join(contentDir, file);
    const stats = fs.statSync(filePath);

    if (stats.size === 0) {
        console.log(`Populating empty file: ${file}`);
        const slug = file.replace('.md', '');
        const info = parseSlug(slug);

        fs.writeFileSync(filePath, template(slug, info.title, info.artist));
        updatedCount++;
    }
});

console.log(\`Done. populated \${updatedCount} files.\`);
