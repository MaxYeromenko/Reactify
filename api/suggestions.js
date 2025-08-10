export default async function handler(req, res) {
    const { q } = req.query;
    const ytKey = process.env.YOUTUBE_API_KEY;

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.status(204).end();
        return;
    }

    if (!ytKey) {
        return res.status(500).json({ error: "YouTube API key is missing" });
    }

    if (!q) {
        return res.status(400).json({ error: "Missing query parameter" });
    }

    try {
        const suggestRes = await fetch(
            `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`
        );

        const suggestData = await suggestRes.json();
        const suggestions = suggestData[1];

        const filteredResults = await Promise.all(
            suggestions.map(async (s) => {
                const searchRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(s)}&maxResults=1&key=${ytKey}`
                );
                const searchData = await searchRes.json();
                return (searchData.items && searchData.items.length > 0) ? s : null;
            })
        );

        const filtered = filteredResults.filter(Boolean);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({ suggestions: filtered });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
}
