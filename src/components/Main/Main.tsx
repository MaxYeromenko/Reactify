import classes from "./_Main.module.scss";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";
import MusicVideoList from "../MusicVideoList/MusicVideoList";
import Button from "../Button/Button";
import { useEffect, useState } from "react";

type MainProps = {
    onPlayVideo: (query: string) => void;
    onPlayPlaylist: (id: string) => void;
    videoId: string | null;
    playlistId: string | null;
    region: string;
    language: string;
    query: string;
    search: boolean;
    setSearch: (search: boolean) => void;
};

export default function Main({
    videoId,
    playlistId,
    region,
    language,
    onPlayVideo,
    onPlayPlaylist,
    query,
    search,
    setSearch,
}: MainProps) {
    const [page, setPage] = useState("recs");
    const [idList, setIdList] = useState<string[]>(() => {
        const saved = localStorage.getItem("idList");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                console.error("Ошибка парсинга idList из localStorage");
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("idList", JSON.stringify(idList));
    }, [idList]);

    return (
        <main className={classes.main}>
            <div className={classes.buttonsContainer}>
                <Button
                    active={page === "recs"}
                    onClick={() => setPage("recs")}
                >
                    Recommendations
                </Button>
                <Button
                    active={page === "pQueue"}
                    onClick={() => setPage("pQueue")}
                >
                    Playback queue
                </Button>
            </div>
            <div className={page !== "recs" ? classes.hidden : ""}>
                <YouTubePlayer
                    videoId={videoId ?? undefined}
                    playlistId={playlistId ?? undefined}
                />
                <MusicVideoList
                    onPlayVideo={onPlayVideo}
                    onPlayPlaylist={onPlayPlaylist}
                    region={region}
                    language={language}
                    query={query}
                    search={search}
                    setSearch={setSearch}
                    idList={idList}
                    setIdList={setIdList}
                />
            </div>
            <div className={page !== "pQueue" ? classes.hidden : ""}>
                {idList.map((item) => (
                    <p>{item}</p>
                ))}
            </div>
        </main>
    );
}
