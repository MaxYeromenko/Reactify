import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import { useState } from "react";

export default function App() {
    const [videoId, setVideoId] = useState("dQw4w9WgXcQ");

    async function handleSearch(query: string) {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(
                query
            )}&key=${apiKey}&maxResults=1`
        );
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
