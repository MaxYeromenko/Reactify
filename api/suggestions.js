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
            // Общие музыкальные термины
            "song", "music", "remix", "audio", "live", "cover", "track", "album",
            "feat", "ft.", "dj", "video", "lyrics", "official", "mp3", "beat",
            "soundtrack", "radio", "concert", "performance", "mix", "orchestra",
            "band", "singer", "ep", "single", "full", "acoustic", "instrumental",
            "demo", "studio", "session", "tour", "gig", "hit", "recording",
            "release", "club", "festival", "karaoke", "mashup", "version",
            "unplugged", "jam", "set", "playlist", "chart", "billboard",

            // Жанры
            "pop", "rock", "hiphop", "rap", "r&b", "electronic", "edm", "house",
            "techno", "trance", "dubstep", "lofi", "jazz", "blues", "classical",
            "reggae", "metal", "punk", "indie", "folk", "country", "trap",
            "drumandbass", "soul", "gospel", "kpop", "jpop", "latin",

            // Популярные исполнители
            "Taylor Swift", "Drake", "Beyoncé", "Adele", "Billie Eilish",
            "Justin Bieber", "The Weeknd", "Ed Sheeran", "Ariana Grande",
            "Bruno Mars", "Post Malone", "Rihanna", "Dua Lipa", "Harry Styles",
            "Coldplay", "Imagine Dragons", "Maroon 5", "Kanye West", "Travis Scott",
            "Eminem", "Kendrick Lamar", "SZA", "Doja Cat", "Selena Gomez",
            "Lady Gaga", "Shawn Mendes", "Katy Perry", "Olivia Rodrigo",
            "BLACKPINK", "BTS", "Shakira", "Bad Bunny", "J Balvin", "Maluma",
            "Anitta", "David Guetta", "Calvin Harris", "Avicii", "Kygo", "Zedd",
            "Marshmello", "Alan Walker", "Steve Aoki", "Tiesto", "Martin Garrix",
            "Metallica", "Linkin Park", "Nirvana", "Queen", "Michael Jackson",
            "Elton John", "Madonna", "Whitney Houston", "Celine Dion",
            "Океан Ельзи", "Святослав Вакарчук", "Monatik", "Tina Karol", "Джамала",
            "KAZKA", "The Hardkiss", "NK", "Время и Стекло", "Dorofeeva", "Alyona Alyona",
            "Jerry Heil", "Kalush", "Kalush Orchestra", "Wellboy", "Artem Pivovarov", "Pianoboy",
            "Антитіла", "Boombox", "MamaRika", "Zlata Ognevich", "Melovin", "TARABAROVA",
            "Go_A", "Yarmak", "TNMK", "СКАЙ", "БEZ ОБМЕЖЕНЬ", "Сергій Бабкін",
            "Khrystyna Soloviy", "Christina Solovey", "Alina Pash", "Jamala", "LATEXFAUNA", "ONUKA",
            "Clonnex"
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
