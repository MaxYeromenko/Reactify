import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import { useEffect, useState } from "react";

export default function App() {
    const [videoId, setVideoId] = useState<string | null>("dQw4w9WgXcQ");
    const [playlistId, setPlaylistId] = useState<string | null>(null);

    const [region, setRegion] = useState(() => {
        return localStorage.getItem("region") || "UA";
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "uk_українська музика";
    });

    async function handleSearch(query: string) {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const apiKeySecond = import.meta.env.VITE_YOUTUBE_API_KEY_SECOND;

        async function fetchWithKey(key: string) {
            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(
                    query
                )}&key=${key}&maxResults=1`
            );
            return res;
        }

        let res = await fetchWithKey(apiKey);

        if (!res.ok && apiKeySecond) {
            res = await fetchWithKey(apiKeySecond);
        }

        if (!res.ok) {
            return;
        }

        const data = await res.json();
        if (data.items && data.items.length > 0) {
            setPlaylistId(null);
            setVideoId(data.items[0].id.videoId);
        }
    }

    function handlePlayVideo(id: string) {
        setPlaylistId(null);
        setVideoId(id);
    }
    function handlePlayPlaylist(id: string) {
        setVideoId(null);
        setPlaylistId(id);
    }

    useEffect(() => {
        localStorage.setItem("region", region);
        localStorage.removeItem("youtubeVideoCache");
        localStorage.removeItem("youtubeVideoCache_playlists");
    }, [region]);

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    return (
        <>
            <Header
                onSearch={handleSearch}
                region={region}
                setRegion={setRegion}
                setLanguage={setLanguage}
            />
            <Main
                onPlayVideo={handlePlayVideo}
                onPlayPlaylist={handlePlayPlaylist}
                videoId={videoId}
                playlistId={playlistId}
                region={region}
                language={language}
            />
            <Footer />
        </>
    );
}
