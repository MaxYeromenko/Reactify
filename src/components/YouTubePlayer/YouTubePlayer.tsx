import Button from "../Button/Button";
import classes from "./_YouTubePlayer.module.scss";
import { useState, useEffect, useRef } from "react";

declare global {
    interface Window {
        YT: typeof YT;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function YouTubePlayer() {
    const playerRef = useRef<YT.Player | null>(null);
    const [videoId] = useState("dQw4w9WgXcQ");
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(10);
    const [hidden, setHidden] = useState(false);
    // async function searchTrack(query: string) {
    //     const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    //     const res = await fetch(
    //         `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
    //             query
    //         )}&key=${apiKey}&maxResults=2`
    //     );
    //     const data = await res.json();
    //     if (data.items.length > 0) {
    //         setVideoId(data.items[0].id.videoId);
    //     }
    // }

    useEffect(() => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player("yt-player", {
                videoId,
                playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                },
                events: {
                    onReady: () => playerRef.current?.setVolume(volume),
                    onStateChange: (event: any) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                        } else {
                            setIsPlaying(false);
                        }
                    },
                },
            });
        };

        return () => {
            playerRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.loadVideoById(videoId);
            playerRef.current.setVolume(volume);
        }
    }, [videoId]);

    function toggleVideo() {
        if (isPlaying) playerRef.current?.pauseVideo();
        else playerRef.current?.playVideo();
        setIsPlaying(!isPlaying);
    }

    const changeVolume = (v: number) => {
        setVolume(v);
        playerRef.current?.setVolume(v);
    };

    const toggleVisibility = () => setHidden(!hidden);

    return (
        <div
            className={
                classes.container +
                (hidden ? " " + classes.resetAspectRatio : "")
            }
        >
            <div className={classes.playerContainer}>
                <div
                    className={
                        classes.iframeContainer +
                        (hidden ? " " + classes.hidden : "")
                    }
                >
                    <div id="yt-player" className={classes.iframe}></div>
                </div>
                <Button onClick={toggleVisibility}>
                    {hidden && <i className="fa-solid fa-chevron-up"></i>}
                    {!hidden && <i className="fa-solid fa-chevron-down"></i>}
                </Button>
            </div>
            <div className={classes.controls}>
                <Button onClick={toggleVideo}>
                    {!isPlaying && <i className="fa-solid fa-play"></i>}
                    {isPlaying && <i className="fa-solid fa-pause"></i>}
                </Button>
                <Button
                    onClick={() => {
                        playerRef.current?.setVolume(0);
                        changeVolume(0);
                    }}
                >
                    {volume === 0 ? (
                        <i className="fa-solid fa-volume-xmark"></i>
                    ) : volume <= 50 ? (
                        <i className="fa-solid fa-volume-low"></i>
                    ) : (
                        <i className="fa-solid fa-volume-high"></i>
                    )}
                </Button>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                />
            </div>
        </div>
    );
}
