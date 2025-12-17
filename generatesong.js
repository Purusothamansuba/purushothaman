const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"];
const songsDir = path.join(__dirname, "songs");

if (!fs.existsSync(songsDir)) {
    console.error("❌ songs folder not found");
    process.exit(1);
}

// 🔐 Track file hashes (true duplicates)
const seenHashes = new Set();
const songs = [];

function getFileHash(filePath) {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(buffer).digest("hex");
}

fs.readdirSync(songsDir).forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (!AUDIO_EXTENSIONS.includes(ext)) return;

    const fullPath = path.join(songsDir, file);
    const hash = getFileHash(fullPath);

    if (seenHashes.has(hash)) {
        console.log(`⚠️ Duplicate audio ignored (same content): ${file}`);
        return;
    }

    seenHashes.add(hash);

    const cleanName = path.parse(file).name
        .replace(/[_\-]+/g, " ")
        .trim();

    songs.push({
        name: cleanName,
        file,
        type: ext.slice(1),
        hash   // optional, useful for debugging
    });
});

// 📝 Write frontend-safe JS file
fs.writeFileSync(
    "songs.js",
    `const SONGS = ${JSON.stringify(songs, null, 2)};`
);

console.log(`✅ songs.js generated (${songs.length} unique audio files)`);
