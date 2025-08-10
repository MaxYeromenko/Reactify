import Button from "../Button/Button";
import InputRange from "../InputRange/InputRange";
import classes from "./_YouTubePlayer.module.scss";
import { useState, useEffect, useRef } from "react";

declare global {
    interface Window {
        YT: typeof YT;
        onYouTubeIframeAPIReady: () => void;
    }
}

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const hh = h > 0 ? `${String(h).padStart(2, "0")}:` : "";
    return `${hh}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function YouTubePlayer({ videoId }: { videoId: string }) {
    const STORAGE_KEY = `yt-player-state-${videoId}`;
    const playerRef = useRef<YT.Player | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);

    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem(`${STORAGE_KEY}-volume`);
        return saved !== null ? Number(saved) : 10;
    });

    const [currentTime, setCurrentTime] = useState(() => {
        const saved = localStorage.getItem(`${STORAGE_KEY}-time`);
        return saved !== null ? Number(saved) : 0;
    });

    const [videoLength, setVideoLength] = useState(0);

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
                    disablekb: 1,
                    start: currentTime,
                    autoplay: 0,
                },
                events: {
                    onReady: () => {
                        if (!playerRef.current) return;
                        playerRef.current.setVolume(volume);
                        const duration = playerRef.current.getDuration();
                        if (!isNaN(duration)) setVideoLength(duration);

                        if (currentTime > 0) {
                            playerRef.current.seekTo(currentTime, true);
                        }
                    },
                    onStateChange: (event: any) => {
                        setIsPlaying(
                            event.data === window.YT.PlayerState.PLAYING
                        );

                        if (
                            event.data === window.YT.PlayerState.CUED ||
                            event.data === window.YT.PlayerState.PLAYING
                        ) {
                            const duration = playerRef.current?.getDuration();
                            if (duration && !isNaN(duration)) {
                                setVideoLength(duration);
                            }
                        }
                    },
                },
            });
        };

        return () => {
            playerRef.current?.destroy();
        };
    }, [videoId]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
        if (playerRef.current && !isSeeking) {
            intervalId = setInterval(() => {
                const time = playerRef.current?.getCurrentTime() || 0;
                setCurrentTime(time);
            }, 500);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isSeeking]);

    useEffect(() => {
        if (!isSeeking) {
            localStorage.setItem(`${STORAGE_KEY}-time`, currentTime.toString());
        }
    }, [currentTime, isSeeking]);

    useEffect(() => {
        localStorage.setItem(`${STORAGE_KEY}-volume`, volume.toString());
    }, [volume]);

    function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentTime(Number(e.target.value));
        setIsSeeking(true);
    }

    function handleSeekCommit() {
        if (playerRef.current) {
            playerRef.current.seekTo(currentTime, true);
        }
        setIsSeeking(false);
    }

    function toggleVideo() {
        if (!playerRef.current) return;
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
    }

    const changeVolume = (v: number) => {
        setVolume(v);
        playerRef.current?.setVolume(v);
    };

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
                <Button onClick={() => setHidden(!hidden)}>
                    {hidden ? (
                        <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                        <i className="fa-solid fa-chevron-down"></i>
                    )}
                </Button>
                <div className={classes.progressBarContainer}>
                    <span>{formatTime(currentTime)}</span>
                    <InputRange
                        type="range"
                        min={0}
                        max={videoLength}
                        value={currentTime}
                        onChange={handleSeekChange}
                        onPointerUp={handleSeekCommit}
                        onTouchEnd={handleSeekCommit}
                    />
                    <span>{formatTime(videoLength)}</span>
                </div>
            </div>
            <div className={classes.controls}>
                <Button onClick={toggleVideo}>
                    {!isPlaying ? (
                        <i className="fa-solid fa-play"></i>
                    ) : (
                        <i className="fa-solid fa-pause"></i>
                    )}
                </Button>
                <Button
                    onClick={() => {
                        changeVolume(volume === 0 ? 50 : 0);
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
                <InputRange
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
