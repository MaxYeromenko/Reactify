export default async function handler(req, res) {
    const { q } = req.query;

    if (!q) {
        res.status(400).json({ error: "Missing query parameter" });
        return;
    }

    try {
        const suggestRes = await fetch(
            `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`
        );

        const suggestions = await suggestRes.json()[1];

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({ suggestions });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
}
