import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import { useState } from "react";

export default function App() {
    const [videoId, setVideoId] = useState("dQw4w9WgXcQ");

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

        if (res.status === 403 && apiKeySecond) {
            res = await fetchWithKey(apiKeySecond);
        }

        if (!res.ok) {
            console.error("YouTube API error:", res.status, await res.text());
            return;
        }

        const data = await res.json();
        if (data.items && data.items.length > 0) {
            setVideoId(data.items[0].id.videoId);
        }
    }

    return (
        <>
            <Header onSearch={handleSearch} />
            <Main videoId={videoId} />
            <Footer />
        </>
    );
}
