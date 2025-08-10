export default async function handler(req, res) {
    // CORS preflight
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(204).end();
    }

    const { q } = req.query;
    const ytKey = process.env.VITE_YOUTUBE_API_KEY;

    console.log('handler called, q=', q, 'ytKey present=', !!ytKey);

    if (!q) return res.status(400).json({ error: "Missing query parameter 'q'" });
    if (!ytKey) {
        console.error('YOUTUBE_API_KEY is missing');
        return res.status(500).json({ error: "Server misconfiguration: YOUTUBE_API_KEY missing" });
    }

    try {
        // 1) get suggestions
        const suggestRes = await fetch(
            `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`,
            { headers: { "User-Agent": "node-fetch" } }
        );

        if (!suggestRes.ok) {
            const body = await suggestRes.text();
            console.error('Suggest API error', suggestRes.status, body.slice(0, 300));
            return res.status(502).json({ error: "Suggest API error", status: suggestRes.status, bodySnippet: body.slice(0, 300) });
        }

        let suggestData;
        try {
            suggestData = await suggestRes.json();
        } catch (parseErr) {
            const text = await suggestRes.text();
            console.error('Failed to parse suggest response:', text.slice(0, 500));
            return res.status(502).json({ error: "Failed to parse suggest response", bodySnippet: text.slice(0, 500) });
        }

        const suggestions = Array.isArray(suggestData[1]) ? suggestData[1] : [];
        if (!suggestions.length) return res.status(200).json({ suggestions: [] });

        // 2) ограничим набор подсказок, чтобы не сжечь квоту
        const candidates = suggestions.slice(0, 8);

        // 3) параллельно проверяем, есть ли муз.видео для подсказки
        const checks = await Promise.allSettled(
            candidates.map(async (s) => {
                const searchRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(s)}&maxResults=1&key=${ytKey}`
                );
                if (!searchRes.ok) {
                    const t = await searchRes.text();
                    console.error('YouTube search error for', s, searchRes.status, t.slice(0, 200));
                    return null;
                }
                const searchData = await searchRes.json();
                return (searchData.items && searchData.items.length > 0) ? s : null;
            })
        );

        const filtered = checks
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value);

        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(200).json({ suggestions: filtered });
    } catch (err) {
        console.error('Unexpected handler error:', err);
        return res.status(500).json({ error: "Unexpected server error", message: String(err) });
    }
}
