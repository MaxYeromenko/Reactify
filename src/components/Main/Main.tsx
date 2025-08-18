import classes from "./_Main.module.scss";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";
import MusicVideoList from "../MusicVideoList/MusicVideoList";
import Button from "../Button/Button";
import { useEffect, useState } from "react";
import PlaybackQueue from "../PlaybackQueue/PlaybackQueue";
import ToastMessage, { type MessageType } from "../ToastMessage/ToastMessage";

type MainProps = {
    onPlayVideo: (query: string) => void;
    onPlayPlaylist: (id: string) => void;
    videoId: string | null;
    setVideoId: (id: string | null) => void;
    playlistId: string | null;
    setPlaylistId: (id: string | null) => void;
    region: string;
    language: string;
    query: string;
    search: boolean;
    setSearch: (search: boolean) => void;
};

export default function Main({
    videoId,
    setVideoId,
    playlistId,
    setPlaylistId,
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
            } catch {}
        }
        return [];
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<MessageType>("info");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        localStorage.setItem("idList", JSON.stringify(idList));
    }, [idList]);

    useEffect(() => {
        if (!message) return;

        setIsActive(true);
        const intervalId = setInterval(() => {
            setIsActive(false);
            setMessage("");
        }, 3000);

        return () => clearInterval(intervalId);
    }, [message]);

    return (
        <main className={classes.main}>
            <div className={isActive ? "" : classes.hidden}>
                <ToastMessage message={message} messageType={messageType} />
            </div>
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
            <div>
                <YouTubePlayer
                    videoId={videoId ?? undefined}
                    setVideoId={setVideoId}
                    playlistId={playlistId ?? undefined}
                    setPlaylistId={setPlaylistId}
                    idList={idList}
                    setIdList={setIdList}
                />
                <MusicVideoList
                    className={page !== "recs" ? classes.hidden : ""}
                    onPlayVideo={onPlayVideo}
                    onPlayPlaylist={onPlayPlaylist}
                    region={region}
                    language={language}
                    query={query}
                    search={search}
                    setSearch={setSearch}
                    setIdList={setIdList}
                    setMessage={setMessage}
                    setMessageType={setMessageType}
                />
            </div>
            <div className={page !== "pQueue" ? classes.hidden : ""}>
                <PlaybackQueue
                    idList={idList}
                    onPlayVideo={onPlayVideo}
                    onPlayPlaylist={onPlayPlaylist}
                    setIdList={setIdList}
                    setMessage={setMessage}
                    setMessageType={setMessageType}
                />
            </div>
        </main>
    );
}
