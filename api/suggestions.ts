import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: "Missing query parameter" });
    }

    try {
        const response = await fetch(
            `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q as string)}`
        );

        const data = await response.json();
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({ suggestions: data[1] });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
}
