import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import { useEffect, useState } from "react";

export default function App() {
    const [videoId, setVideoId] = useState<string | null>(
        getInitialMedia().videoId
    );
    const [playlistId, setPlaylistId] = useState<string | null>(
        getInitialMedia().playlistId
    );

    const [region, setRegion] = useState(() => {
        return localStorage.getItem("region") || "UA";
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "uk_українська музика";
    });
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState(false);

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

    function getInitialMedia(): {
        videoId: string | null;
        playlistId: string | null;
    } {
        const savedQueue = localStorage.getItem("idList");
        const savedVideoCache = localStorage.getItem("youtubeVideoCache");
        const savedPlaylistCache = localStorage.getItem(
            "youtubeVideoCache_playlists"
        );

        try {
            if (savedQueue) {
                const queue: string[] = JSON.parse(savedQueue);

                if (queue.length > 0) {
                    const firstId = queue[0];

                    if (savedVideoCache) {
                        const videoCache = JSON.parse(
                            savedVideoCache
                        ) as Record<string, any>;
                        if (videoCache[firstId]) {
                            return { videoId: firstId, playlistId: null };
                        }
                    }

                    if (savedPlaylistCache) {
                        const playlistCache = JSON.parse(
                            savedPlaylistCache
                        ) as Record<string, any>;
                        if (playlistCache[firstId]) {
                            return { videoId: null, playlistId: firstId };
                        }
                    }
                    localStorage.removeItem("idList");
                }
            }
        } catch {}

        return { videoId: "dQw4w9WgXcQ", playlistId: null };
    }

    return (
        <>
            <Header
                query={query}
                setQuery={setQuery}
                region={region}
                setRegion={setRegion}
                setLanguage={setLanguage}
                setSearch={setSearch}
            />
            <Main
                onPlayVideo={handlePlayVideo}
                onPlayPlaylist={handlePlayPlaylist}
                videoId={videoId}
                setVideoId={setVideoId}
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
                region={region}
                language={language}
                query={query}
                search={search}
                setSearch={setSearch}
            />
            <Footer />
        </>
    );
}
