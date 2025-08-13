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
                playlistId={playlistId}
                region={region}
                language={language}
                query={query}
                search={search}
            />
            <Footer />
        </>
    );
}
