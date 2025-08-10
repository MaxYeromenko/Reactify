export default async function handler(req, res) {
    const { q } = req.query;

    if (!q) {
        res.status(400).json({ error: "Missing query parameter" });
        return;
    }

    try {
        const response = await fetch(
            `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`
        );

        const data = await response.json();
        const suggestions = data[1];

        const musicKeywords = [
            "song",
            "music",
            "remix",
            "audio",
            "live",
            "cover",
            "track",
            "album",
            "feat",
            "ft.",
            "dj",
            "video",
            "lyrics",
            "official",
            "mp3",
            "beat",
            "soundtrack",
            "radio",
            "concert",
            "performance",
            "mix",
            "orchestra",
            "band",
            "singer",
            "album",
            "ep",
            "single"
        ];

        const filtered = suggestions.filter(suggestion =>
            musicKeywords.some(keyword =>
                suggestion.toLowerCase().includes(keyword)
            )
        );

        const finalSuggestions = filtered.length > 0 ? filtered : suggestions;

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({ suggestions: finalSuggestions });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
}
